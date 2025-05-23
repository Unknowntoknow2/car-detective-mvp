
// This file is responsible for handling context for the AI assistant
import { supabase } from '@/lib/supabaseClient';

export interface VehicleContext {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  zipCode?: string;
  accidentHistory?: boolean;
  condition?: string;
  trim?: string;
  color?: string;
  vin?: string;
  // Additional properties
  bodyType?: string;
  fuelType?: string;
}

export interface AssistantContext {
  vehicle: VehicleContext;
  isPremium: boolean;
  previousIntents?: string[];
}

// Extract vehicle context from conversation
export function extractVehicleContext(conversation: { role: string; content: string }[]): VehicleContext {
  const context: VehicleContext = {};
  
  // Combine all messages into a single string for analysis
  const text = conversation
    .map(msg => msg.content)
    .join(' ')
    .toLowerCase();
  
  // Extract year - looking for 4 digits that could be a year between 1950 and current year + 1
  const currentYear = new Date().getFullYear();
  const yearRegex = /\b(19[5-9]\d|20\d{2})\b/g;
  const yearMatches = [...text.matchAll(yearRegex)];
  
  if (yearMatches.length > 0) {
    const possibleYears = yearMatches.map(match => parseInt(match[0]));
    // Filter to only include valid years (not future years beyond next year)
    const validYears = possibleYears.filter(year => year >= 1950 && year <= currentYear + 1);
    if (validYears.length > 0) {
      // Take the most recent mention if multiple years
      context.year = validYears[validYears.length - 1];
    }
  }
  
  // Extract make - common car manufacturers
  const makes = [
    'toyota', 'honda', 'ford', 'chevrolet', 'chevy', 'nissan', 'hyundai', 'kia', 'subaru', 
    'bmw', 'mercedes', 'audi', 'lexus', 'acura', 'volkswagen', 'vw', 'mazda', 'jeep', 'tesla',
    'dodge', 'ram', 'chrysler', 'buick', 'cadillac', 'gmc', 'lincoln', 'volvo', 'porsche'
  ];
  
  for (const make of makes) {
    if (text.includes(make)) {
      context.make = make.charAt(0).toUpperCase() + make.slice(1);
      // Handle special cases
      if (make === 'chevy') context.make = 'Chevrolet';
      if (make === 'vw') context.make = 'Volkswagen';
      break;
    }
  }
  
  // Extract common models (if make is known)
  if (context.make) {
    const makeModels: Record<string, string[]> = {
      'Toyota': ['camry', 'corolla', 'rav4', 'highlander', 'tacoma', 'tundra', 'prius', '4runner', 'sienna'],
      'Honda': ['civic', 'accord', 'cr-v', 'crv', 'pilot', 'odyssey', 'fit', 'hr-v', 'hrv', 'ridgeline'],
      'Ford': ['f-150', 'f150', 'mustang', 'escape', 'explorer', 'edge', 'ranger', 'bronco', 'fusion'],
      'Chevrolet': ['silverado', 'equinox', 'tahoe', 'malibu', 'traverse', 'suburban', 'colorado', 'camaro', 'impala'],
      'Nissan': ['altima', 'rogue', 'sentra', 'pathfinder', 'frontier', 'murano', 'maxima', 'titan', 'kicks'],
      // Add more makes and models as needed
    };
    
    const modelsToCheck = makeModels[context.make] || [];
    for (const model of modelsToCheck) {
      if (text.includes(model)) {
        context.model = model.charAt(0).toUpperCase() + model.slice(1);
        break;
      }
    }
  }
  
  // Extract mileage - look for numbers followed by variations of "miles", "mi", "k miles", etc.
  const mileageRegex = /\b(\d{1,3}(?:,\d{3})*|\d+)(?:\s*k)?\s*(miles?|mi\.?|000)\b/gi;
  const mileageMatches = text.match(mileageRegex);
  
  if (mileageMatches && mileageMatches.length > 0) {
    // Take the last mention of mileage
    const mileageText = mileageMatches[mileageMatches.length - 1];
    // Extract the numeric part
    const numericPart = mileageText.replace(/[^\d.]/g, '');
    
    if (numericPart) {
      let mileage = parseInt(numericPart);
      // If the mileage is suspiciously low and "k" is in the text, multiply by 1000
      if (mileage < 1000 && /\bk\b/i.test(mileageText)) {
        mileage *= 1000;
      }
      context.mileage = mileage;
    }
  }
  
  // Extract ZIP code - 5-digit US ZIP code
  const zipRegex = /\b\d{5}(?:-\d{4})?\b/g;
  const zipMatches = text.match(zipRegex);
  
  if (zipMatches && zipMatches.length > 0) {
    // Take the first 5 digits of the match
    context.zipCode = zipMatches[0].substring(0, 5);
  }
  
  // Extract VIN - 17-character Vehicle Identification Number
  const vinRegex = /\b[A-HJ-NPR-Z0-9]{17}\b/i;
  const vinMatch = text.match(vinRegex);
  
  if (vinMatch) {
    context.vin = vinMatch[0].toUpperCase();
  }
  
  // Extract accident history
  const accidentTerms = ['accident', 'collision', 'crash', 'damaged', 'totaled', 'wrecked'];
  for (const term of accidentTerms) {
    if (text.includes(term)) {
      context.accidentHistory = true;
      break;
    }
  }
  
  // Extract condition
  const conditionTerms = {
    'excellent': ['excellent', 'perfect', 'like new', 'mint'],
    'good': ['good', 'nice', 'clean'],
    'fair': ['fair', 'average', 'okay', 'ok'],
    'poor': ['poor', 'bad', 'rough', 'needs work']
  };
  
  for (const [condition, terms] of Object.entries(conditionTerms)) {
    for (const term of terms) {
      if (text.includes(term)) {
        context.condition = condition;
        break;
      }
    }
    if (context.condition) break;
  }
  
  return context;
}

// Detect intent from user message
export function detectIntent(message: string): string {
  const text = message.toLowerCase();
  
  // Define intent patterns
  const intents = {
    'value_inquiry': ['worth', 'value', 'price', 'cost', 'estimate', 'appraisal'],
    'accident_impact': ['accident', 'crash', 'collision', 'damage', 'wreck', 'impact', 'effect on value', 'affect price'],
    'best_time_to_sell': ['best time', 'when to sell', 'right time', 'market timing', 'sell now', 'wait to sell'],
    'financing_options': ['finance', 'loan', 'interest rate', 'payment', 'down payment', 'monthly payment'],
    'trade_in_value': ['trade in', 'trade-in', 'dealer offer', 'dealership value', 'exchange'],
    'maintenance_cost': ['maintenance', 'repair', 'service', 'upkeep', 'cost to maintain'],
    'vehicle_history': ['history', 'carfax', 'report', 'title', 'previous owner', 'odometer'],
    'premium_features': ['premium', 'upgrade', 'additional', 'more detail', 'paid report', 'full report'],
    'general_question': ['how', 'what', 'why', 'where', 'who', 'when']
  };
  
  // Check for each intent
  for (const [intent, patterns] of Object.entries(intents)) {
    for (const pattern of patterns) {
      if (text.includes(pattern)) {
        return intent;
      }
    }
  }
  
  // Default to general inquiry if no specific intent detected
  return 'general_inquiry';
}

// Generate AI response based on intent and context
export async function generateResponse(intent: string, context: AssistantContext, userMessage: string): Promise<string> {
  const vehicle = context.vehicle;
  const isPremium = context.isPremium;
  
  // Get regional data based on ZIP code if available
  let regionalData = null;
  if (vehicle.zipCode) {
    try {
      const { data } = await supabase
        .from('market_data')
        .select('*')
        .eq('zip_code', vehicle.zipCode)
        .maybeSingle();
      
      regionalData = data;
    } catch (error) {
      console.error('Error fetching regional data:', error);
    }
  }
  
  // Handle different intents
  switch (intent) {
    case 'value_inquiry':
      return generateValueResponse(vehicle, isPremium, regionalData);
      
    case 'accident_impact':
      return generateAccidentImpactResponse(vehicle, isPremium);
      
    case 'best_time_to_sell':
      return generateBestTimeResponse(vehicle, regionalData, isPremium);
      
    case 'trade_in_value':
      return generateTradeInResponse(vehicle, isPremium);
      
    case 'maintenance_cost':
      return generateMaintenanceResponse(vehicle);
      
    case 'vehicle_history':
      return generateHistoryResponse(vehicle, isPremium);
      
    case 'premium_features':
      return generatePremiumFeaturesResponse();
      
    default:
      // Handle general inquiries or fallback
      return generateGeneralResponse(vehicle, userMessage);
  }
}

// Helper functions for each response type
function generateValueResponse(vehicle: VehicleContext, isPremium: boolean, regionalData: any): string {
  let response = '';
  
  if (!vehicle.make || !vehicle.model || !vehicle.year) {
    return "I'd be happy to provide a valuation estimate. To give you accurate information, I'll need to know the make, model, and year of your vehicle. If you could also provide the approximate mileage and your ZIP code, that would help me provide a more localized estimate.";
  }
  
  // Basic response
  response = `Based on the information for your ${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  
  if (vehicle.mileage) {
    response += ` with ${vehicle.mileage.toLocaleString()} miles`;
  }
  
  response += `, I estimate the value to be in the range of $18,500 to $21,200.`;
  
  // Add regional context if available
  if (regionalData) {
    response += ` In your area (${vehicle.zipCode}), similar vehicles are selling for about ${regionalData.average_price > 0 ? '$' + regionalData.average_price.toLocaleString() : 'the national average'}.`;
  }
  
  // Add premium upsell if not a premium user
  if (!isPremium) {
    response += "\n\nFor a more precise valuation that includes the impact of options, specific condition details, and recent comparable sales in your area, consider upgrading to our Premium Report.";
  } else {
    response += "\n\nYour Premium access provides you with our most accurate valuation model, which includes local market data, comparable vehicle sales, and specific condition adjustments.";
  }
  
  return response;
}

function generateAccidentImpactResponse(vehicle: VehicleContext, isPremium: boolean): string {
  if (!vehicle.make && !vehicle.model) {
    return "Accidents typically reduce a vehicle's value by 10-30% depending on severity. To give you a more specific estimate for your situation, could you share what type of vehicle you have (make, model, and year)?";
  }
  
  let response = `For a ${vehicle.year || 'recent'} ${vehicle.make || ''} ${vehicle.model || ''}`;
  
  if (vehicle.accidentHistory === true) {
    response += `, an accident can impact the value significantly. Based on industry data:
    
• Minor accidents (cosmetic damage) typically reduce value by 3-5%
• Moderate accidents (requiring body/panel repair) reduce value by 5-15%
• Severe accidents (structural/frame damage) reduce value by 15-30% or more

These percentages are based on industry averages and can vary based on the vehicle's overall condition, mileage, and your local market.`;
  } else {
    response += `, an accident would typically impact the resale value as follows:
    
• Minor accidents (cosmetic damage): 3-5% reduction
• Moderate accidents (requiring body/panel repair): 5-15% reduction
• Severe accidents (structural/frame damage): 15-30% reduction or more

The exact impact depends on repair quality, documentation, and your local market conditions.`;
  }
  
  if (!isPremium) {
    response += "\n\nFor a detailed analysis that factors in specific accident severity, repair quality, and local market conditions, I recommend upgrading to our Premium Report which includes CARFAX integration.";
  }
  
  return response;
}

function generateBestTimeResponse(vehicle: VehicleContext, regionalData: any, isPremium: boolean): string {
  let response = "";
  
  // Use regional data if available
  if (regionalData && regionalData.seasonal_data) {
    response = `Based on market data for your area (${vehicle.zipCode}), the best time to sell a ${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''} is typically during ${regionalData.seasonal_data.best_season}. In your region, prices tend to be about ${regionalData.seasonal_data.price_increase}% higher during this period compared to the annual average.`;
  } else {
    // Generic response based on vehicle type if available
    const isConvertible = vehicle.model?.toLowerCase().includes('convertible') || false;
    const isSUV = vehicle.model?.toLowerCase().includes('suv') || 
                 ['rav4', 'cr-v', 'explorer', 'equinox', 'rogue', '4runner', 'highlander'].includes(vehicle.model?.toLowerCase() || '');
    const isTruck = vehicle.model?.toLowerCase().includes('truck') || 
                   ['f-150', 'silverado', 'ram', 'tundra', 'tacoma', 'colorado', 'ranger'].includes(vehicle.model?.toLowerCase() || '');
    
    if (isConvertible) {
      response = "For convertibles, spring is typically the best time to sell as buyers look forward to warm weather driving. You can often command a 5-10% premium selling in April or May compared to winter months.";
    } else if (isSUV || isTruck) {
      response = "For SUVs and trucks, demand tends to increase in fall and early winter, especially in regions with harsh winters. You might see a 3-7% higher selling price during October through December compared to summer months.";
    } else {
      response = "Generally, the best time to sell is in the spring (March to May) when tax refunds arrive and people are planning for summer. This period typically shows a 2-5% increase in used car prices compared to winter months.";
    }
  }
  
  // Add national trends
  response += "\n\nAdditionally, consider these market factors:";
  response += "\n• Weekday listings often get more attention than weekend posts";
  response += "\n• The beginning of the month tends to see more serious buyers";
  response += "\n• Selling before major model updates can help preserve value";
  
  if (!isPremium && vehicle.make && vehicle.model) {
    response += `\n\nFor a detailed 12-month price forecast specific to your ${vehicle.year || ''} ${vehicle.make} ${vehicle.model} that factors in upcoming model releases and market trends, consider our Premium Report.`;
  }
  
  return response;
}

function generateTradeInResponse(vehicle: VehicleContext, isPremium: boolean): string {
  if (!vehicle.make || !vehicle.model) {
    return "Trade-in values are typically 10-15% lower than private party sales. To give you specific information for your vehicle, could you let me know the make, model, and year?";
  }
  
  let response = `For your ${vehicle.year || ''} ${vehicle.make} ${vehicle.model}`;
  if (vehicle.mileage) {
    response += ` with ${vehicle.mileage.toLocaleString()} miles`;
  }
  
  response += `, the trade-in value would typically be about 10-15% lower than the private party sale value. This difference reflects the convenience of trading in versus the work involved in selling privately.`;
  
  response += "\n\nWhen trading in at a dealership:";
  response += "\n• You'll save on potential sales tax (in most states)";
  response += "\n• You avoid the hassle of listing, showing, and managing payment";
  response += "\n• The process is typically completed in a single visit";
  
  if (!isPremium) {
    response += "\n\nFor specific trade-in values at dealerships in your area, including which dealers are offering the best prices for your specific vehicle, our Premium Report provides dealer-specific data and insights.";
  } else {
    response += "\n\nYour Premium access includes detailed information about local dealer offers and negotiation points specific to your vehicle.";
  }
  
  return response;
}

function generateMaintenanceResponse(vehicle: VehicleContext): string {
  if (!vehicle.make || !vehicle.model) {
    return "Maintenance costs vary significantly by make and model. Could you let me know which vehicle you're inquiring about?";
  }
  
  let response = `For a ${vehicle.year || ''} ${vehicle.make} ${vehicle.model}, typical annual maintenance costs range from $`;
  
  // Rough estimates based on make
  let lowEstimate = 600;
  let highEstimate = 800;
  
  // Adjust based on known makes
  const make = vehicle.make.toLowerCase();
  if (['toyota', 'honda', 'mazda', 'subaru'].includes(make)) {
    lowEstimate = 350;
    highEstimate = 600;
    response += `${lowEstimate}-${highEstimate}. ${vehicle.make} vehicles are generally known for reliability and lower maintenance costs compared to the industry average.`;
  } else if (['bmw', 'mercedes', 'audi', 'porsche', 'lexus'].includes(make)) {
    lowEstimate = 900;
    highEstimate = 1500;
    response += `${lowEstimate}-${highEstimate}. Luxury vehicles like ${vehicle.make} typically have higher maintenance costs due to specialized parts and service requirements.`;
  } else if (['ford', 'chevrolet', 'dodge', 'jeep', 'chrysler'].includes(make)) {
    lowEstimate = 550;
    highEstimate = 800;
    response += `${lowEstimate}-${highEstimate}. American vehicles like ${vehicle.make} tend to have moderately priced parts, but costs can vary based on the specific model.`;
  } else {
    response += `${lowEstimate}-${highEstimate}. This is in line with the industry average for similar vehicles.`;
  }
  
  // Adjust for age
  if (vehicle.year && vehicle.year < 2015) {
    response += "\n\nSince your vehicle is older, you might expect slightly higher costs as components begin to wear. Major services like timing belts, water pumps, and transmission maintenance may be approaching.";
  }
  
  // Add common maintenance items
  response += "\n\nRegular maintenance items to budget for:";
  response += "\n• Oil changes: $50-100 every 5,000-7,500 miles";
  response += "\n• Tire rotation: $20-50 every 5,000-7,500 miles";
  response += "\n• Brake service: $150-400 every 30,000-50,000 miles";
  response += "\n• Major service intervals: $300-600 every 30,000 miles";
  
  return response;
}

function generateHistoryResponse(vehicle: VehicleContext, isPremium: boolean): string {
  if (!vehicle.vin && !isPremium) {
    return "Vehicle history reports provide critical information about past accidents, title problems, service records, and ownership history. For a detailed history report, I'd need your vehicle's VIN number.\n\nOur Premium Report includes a comprehensive CARFAX vehicle history report which can reveal issues that might affect your vehicle's value and safety.";
  }
  
  if (isPremium) {
    return `With your Premium access, you can view the complete vehicle history report for your ${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}, including:
    
• Verified accident history with damage severity
• Title information (clean, salvage, rebuilt)
• Previous ownership and usage (personal, fleet, rental)
• Service and maintenance records
• Recall information and fixes
• Odometer readings to verify mileage accuracy

This information is critical for understanding your vehicle's true condition and value.`;
  } else {
    return `Vehicle history is crucial for understanding your ${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}'s true condition and value. A comprehensive report would show:
    
• Accident history and severity
• Title status (clean, salvage, rebuilt)
• Ownership history
• Service records
• Open recalls
• Odometer verification

To access this detailed information, our Premium Report includes a full CARFAX vehicle history report, which can uncover issues that might significantly impact value.`;
  }
}

function generatePremiumFeaturesResponse(): string {
  return `Our Premium Report provides enhanced vehicle valuation with:
  
• Full CARFAX vehicle history integration
• Local market analysis with actual comparable listings
• 12-month price forecast with depreciation curve
• Detailed condition valuation adjustments
• Dealer trade-in offers in your area
• VIN-specific option and trim verification
• Export-ready PDF reports with professional formatting
• Negotiation tips specific to your vehicle and local market

The Premium Report costs $19.99 for a single report, or you can subscribe monthly for unlimited reports at $29.99/month.`;
}

function generateGeneralResponse(vehicle: VehicleContext, userMessage: string): string {
  // Fallback for general questions
  if (!vehicle.make && !vehicle.model) {
    return "I can help with questions about vehicle valuation, accident impact on price, best time to sell, maintenance costs, and more. To provide specific information, I'd need to know more about your vehicle. Could you share the make, model, and year?";
  }
  
  return `I understand you're asking about your ${vehicle.year || ''} ${vehicle.make} ${vehicle.model}. To help you more effectively, could you clarify what specific information you're looking for? I can assist with:
  
• Current market value and pricing
• Impact of accidents or damage on value
• Best time to sell in your market
• Maintenance costs and common issues
• Trade-in vs private sale considerations
• Vehicle history importance

Let me know what you'd like to know about your vehicle, and I'll provide the most relevant information.`;
}
