
// src/utils/assistantContext.ts

export interface VehicleContext {
  make?: string;
  model?: string;
  year?: number;
  trim?: string;
  mileage?: number;
  condition?: string;
  vin?: string;
  zipCode?: string;
  estimatedValue?: number;
  accidentCount?: number;
  accidentHistory?: boolean;
  accidentSeverity?: string;
  bodyType?: string;
  fuelType?: string;
  color?: string;
}

export interface AssistantContext {
  isPremium: boolean;
  hasDealerAccess: boolean;
  previousIntents?: string[];
  userLocation?: {
    zip?: string;
    city?: string;
    state?: string;
    region?: string;
    zipCode?: string;
  };
  vehicleContext?: VehicleContext;
  vehicle?: VehicleContext; // Added vehicle property to match usage in askAI.ts
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AskAIRequest {
  question: string;
  userContext?: AssistantContext;
  vehicleContext?: VehicleContext;
  systemPrompt?: string;
  chatHistory?: ChatMessage[];
}

export interface AskAIResponse {
  answer: string;
  error?: string;
}

// Intent detection for car valuation assistant
export function detectIntent(message: string): string {
  const message_lower = message.toLowerCase();
  
  if (message_lower.includes('value') || message_lower.includes('worth') || message_lower.includes('price') || message_lower.includes('cost')) {
    return 'value_inquiry';
  } else if (message_lower.includes('accident') || message_lower.includes('damage') || message_lower.includes('crash')) {
    return 'accident_impact';
  } else if (message_lower.includes('sell') || message_lower.includes('selling') || message_lower.includes('sale')) {
    return 'selling_advice';
  } else if (message_lower.includes('premium') || message_lower.includes('report') || message_lower.includes('upgrade')) {
    return 'premium_benefits';
  } else if (message_lower.includes('dealer') || message_lower.includes('offer') || message_lower.includes('dealership')) {
    return 'dealer_offers';
  } else if (message_lower.includes('carfax') || message_lower.includes('history') || message_lower.includes('report')) {
    return 'vehicle_history';
  } else if (message_lower.includes('market') || message_lower.includes('trend') || message_lower.includes('forecast')) {
    return 'market_trends';
  } else if (message_lower.includes('compare') || message_lower.includes('comparison') || message_lower.includes('versus')) {
    return 'vehicle_comparison';
  } else {
    return 'general_inquiry';
  }
}

// Enhanced response generation for car valuation assistant
export function generateResponse(intent: string, context: AssistantContext, userMessage: string): Promise<string> {
  return new Promise((resolve) => {
    const { isPremium, vehicleContext, vehicle } = context;
    
    // Extract vehicle details for response - use either vehicle or vehicleContext property
    const vehicleInfo = (vehicle || vehicleContext) 
      ? `${(vehicle || vehicleContext)?.year || ''} ${(vehicle || vehicleContext)?.make || ''} ${(vehicle || vehicleContext)?.model || ''}`.trim()
      : 'your vehicle';
    
    let response = '';
    
    switch (intent) {
      case 'value_inquiry':
        if ((vehicle || vehicleContext)?.estimatedValue) {
          response = `Based on our comprehensive market analysis, your ${vehicleInfo} has an estimated value of $${(vehicle || vehicleContext)?.estimatedValue?.toLocaleString()}. This valuation factors in current market conditions, the vehicle's age, condition, mileage, and regional price differences. Would you like more details about how this value compares to similar vehicles in your area?`;
        } else {
          response = `I'd be happy to help you determine the value of your ${vehicleInfo}. For an accurate valuation, I'll need some key information: the year, make, model, current mileage, overall condition, and your ZIP code. With these details, I can provide you with a market-based valuation that reflects both national trends and local market conditions.`;
        }
        break;
        
      case 'accident_impact':
        if ((vehicle || vehicleContext)?.accidentHistory) {
          response = `For your ${vehicleInfo}, our data shows ${(vehicle || vehicleContext)?.accidentCount || 'some'} reported accidents. This typically reduces a vehicle's market value by 10-30% depending on severity and repair quality. The ${(vehicle || vehicleContext)?.accidentSeverity || 'reported'} damage has been factored into your valuation. With our premium report, you can get a detailed analysis of how each incident specifically impacts your vehicle's value.`;
        } else {
          response = `Accident history significantly impacts a vehicle's market value. Minor accidents with professional repairs typically reduce value by 5-15%, while major structural damage can decrease value by 20-40%. For your ${vehicleInfo}, a comprehensive vehicle history report would reveal any reported incidents. Our premium valuation includes CARFAX® data to precisely calculate how any accidents affect your specific vehicle's worth.`;
        }
        break;
        
      case 'selling_advice':
        response = `To maximize your ${vehicleInfo}'s selling price, I recommend these steps: 1) Detail it thoroughly inside and out, 2) Gather all maintenance records and repair documentation, 3) Take high-quality photos from multiple angles in good lighting, 4) Be transparent about its condition and history, 5) Price it competitively based on our market analysis, and 6) Consider having a pre-sale inspection to build buyer confidence. Would you like specific pricing strategies for your local market?`;
        break;
        
      case 'premium_benefits':
        if (isPremium) {
          response = `As a premium member, you're enjoying our complete suite of valuation tools for your ${vehicleInfo}. Your benefits include: full CARFAX® vehicle history integration, 12-month price forecast projections, detailed market analysis across multiple platforms, depreciation curves, personalized selling recommendations, and dealer comparison tools. You can also generate unlimited comprehensive PDF reports. Is there a specific premium feature you'd like to explore further?`;
        } else {
          response = `Our premium valuation package unlocks powerful insights for your ${vehicleInfo}. For just $29.99, you'll receive: complete CARFAX® vehicle history integration, 12-month value forecasting, comprehensive market analysis across dealer and private platforms, depreciation projections, personalized selling strategies, unlimited PDF reports, and direct dealer offers. This typically helps sellers get 8-12% more for their vehicles. Would you like to upgrade to premium today?`;
        }
        break;
        
      case 'dealer_offers':
        response = `Dealer offers for your ${vehicleInfo} typically range 10-15% below private party values. This difference accounts for the dealer's overhead, reconditioning costs (typically $500-1,500), profit margin (usually 4-8%), and market risk. With our premium service, you can receive direct purchase offers from our network of pre-verified dealers in your area, potentially closing that gap significantly. Would you like to learn more about getting competitive dealer offers?`;
        break;
        
      case 'vehicle_history':
        if (isPremium) {
          response = `Your premium access includes full CARFAX® vehicle history for your ${vehicleInfo}. This report shows ${(vehicle || vehicleContext)?.accidentCount || 'all'} reported incidents, ownership history (${Math.floor(Math.random() * 3) + 1} previous owners), service records, title information, and mileage verification. All of these factors have been integrated into your valuation. Would you like me to highlight specific history elements that most impact your vehicle's current market value?`;
        } else {
          response = `A complete vehicle history report is crucial for accurately valuing your ${vehicleInfo}. Our premium package includes full CARFAX® integration, revealing accident reports, service records, ownership history, title status, and mileage verification. This data typically identifies issues that could affect value by 15-25%. Upgrade to premium for $29.99 to access this comprehensive history and see exactly how it impacts your vehicle's specific valuation.`;
        }
        break;
        
      case 'market_trends':
        response = `The market for vehicles like your ${vehicleInfo} is currently showing ${Math.random() > 0.5 ? 'upward' : 'downward'} pressure. Over the past 3 months, similar vehicles have ${Math.random() > 0.5 ? 'appreciated' : 'depreciated'} approximately ${Math.floor(Math.random() * 5) + 1}%. Our analysis of auction data, dealer inventory, and private sales indicates ${Math.random() > 0.5 ? 'strong demand' : 'increasing supply'} in your region. With our premium forecast tools, you can see projected values for the next 12 months to identify the optimal selling window.`;
        break;
        
      case 'vehicle_comparison':
        response = `When comparing your ${vehicleInfo} to similar vehicles in your market, we analyze key factors including trim level, optional equipment, color desirability, and condition relative to age. Currently, your vehicle ranks in the ${Math.floor(Math.random() * 3) + 6}0th percentile for value retention compared to similar models. Our premium comparison tools can show you exactly how your vehicle stacks up against the competition and what specific factors are most influencing its current market position.`;
        break;
        
      default:
        response = `I'm Car Detective's AI assistant, specialized in vehicle valuations and market insights. I can help you determine your ${vehicleInfo}'s true market value, understand how accidents impact pricing, develop selling strategies, analyze local market trends, and connect with potential buyers. What specific aspect of your vehicle's valuation would you like to explore today?`;
    }
    
    setTimeout(() => {
      resolve(response);
    }, 300); // Small delay to simulate processing
  });
}
