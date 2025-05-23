
import { supabase } from '@/lib/supabaseClient';

export interface VehicleContext {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  zipCode?: string;
  condition?: string;
  vin?: string;
  accidentCount?: number;
  accidentSeverity?: 'minor' | 'moderate' | 'severe' | null;
  valuationId?: string;
  estimatedValue?: number;
}

export interface AssistantContext {
  vehicle?: VehicleContext;
  userLocation?: {
    zipCode: string;
    region?: string;
    state?: string;
  };
  isPremium?: boolean;
  previousIntents?: string[];
}

// Extract vehicle context from conversation history
export function extractVehicleContext(messages: Array<{role: string, content: string}>): VehicleContext {
  const context: VehicleContext = {};
  const allText = messages.map(m => m.content.toLowerCase()).join(' ');
  
  // Extract year (4 digit number between 1990-2025)
  const yearMatch = allText.match(/\b(19[9][0-9]|20[0-2][0-9])\b/);
  if (yearMatch) context.year = parseInt(yearMatch[0]);
  
  // Extract make from common car manufacturers
  const makePatterns = [
    'toyota', 'honda', 'ford', 'chevrolet', 'chevy', 'bmw', 'mercedes', 'audi', 
    'lexus', 'hyundai', 'kia', 'nissan', 'subaru', 'mazda', 'volkswagen', 'vw',
    'tesla', 'porsche', 'jeep', 'dodge', 'ram', 'chrysler', 'cadillac', 'buick',
    'gmc', 'acura', 'infiniti', 'lincoln', 'volvo', 'jaguar', 'land rover'
  ];
  
  for (const make of makePatterns) {
    if (allText.includes(make)) {
      context.make = make === 'chevy' ? 'chevrolet' : make === 'vw' ? 'volkswagen' : make;
      break;
    }
  }
  
  // Extract model (if make is found)
  if (context.make) {
    const commonModels: Record<string, string[]> = {
      'toyota': ['camry', 'corolla', 'rav4', 'highlander', 'tacoma', 'tundra', 'prius'],
      'honda': ['civic', 'accord', 'cr-v', 'pilot', 'odyssey', 'fit', 'ridgeline'],
      'ford': ['f-150', 'f150', 'mustang', 'escape', 'explorer', 'edge', 'fusion', 'focus'],
      'chevrolet': ['silverado', 'malibu', 'equinox', 'tahoe', 'suburban', 'camaro', 'colorado'],
      'bmw': ['3 series', '5 series', '7 series', 'x3', 'x5', 'x7', 'i4', 'i7'],
      // Add more as needed
    };
    
    const models = commonModels[context.make] || [];
    for (const model of models) {
      if (allText.includes(model)) {
        context.model = model;
        break;
      }
    }
  }
  
  // Extract mileage
  const mileageMatch = allText.match(/\b(\d{1,3}(,\d{3})*|\d+)\s*(k|thousand)?\s*(miles?)\b/i);
  if (mileageMatch) {
    let mileage = mileageMatch[1].replace(/,/g, '');
    if (mileageMatch[3] && (mileageMatch[3].toLowerCase() === 'k' || mileageMatch[3].toLowerCase() === 'thousand')) {
      mileage = String(parseInt(mileage) * 1000);
    }
    context.mileage = parseInt(mileage);
  }
  
  // Extract ZIP code (5 digits)
  const zipMatch = allText.match(/\b(\d{5})\b/);
  if (zipMatch) context.zipCode = zipMatch[0];
  
  // Extract condition
  const conditionPatterns = ['excellent', 'good', 'fair', 'poor'];
  for (const condition of conditionPatterns) {
    if (allText.includes(condition)) {
      context.condition = condition;
      break;
    }
  }
  
  // Extract VIN (17 characters)
  const vinMatch = allText.match(/\b[A-HJ-NPR-Z0-9]{17}\b/i);
  if (vinMatch) context.vin = vinMatch[0].toUpperCase();
  
  // Extract accident info
  if (allText.includes('accident') || allText.includes('accidents')) {
    // Look for numbers followed by accident(s)
    const accidentCountMatch = allText.match(/(\d+)\s*(accidents?)/i);
    if (accidentCountMatch) {
      context.accidentCount = parseInt(accidentCountMatch[1]);
    } else if (allText.includes('no accident') || allText.includes('zero accident')) {
      context.accidentCount = 0;
    } else {
      // Default to 1 if accidents are mentioned but count isn't specified
      context.accidentCount = 1;
    }
    
    // Check for severity
    if (allText.includes('minor accident') || allText.includes('small accident')) {
      context.accidentSeverity = 'minor';
    } else if (allText.includes('moderate accident') || allText.includes('medium accident')) {
      context.accidentSeverity = 'moderate';
    } else if (allText.includes('severe accident') || allText.includes('major accident')) {
      context.accidentSeverity = 'severe';
    }
  }
  
  return context;
}

// Detect intent from user message
export function detectIntent(message: string): string {
  message = message.toLowerCase();
  
  if (message.includes('accident') || message.includes('damage') || message.includes('collision')) {
    return 'accident_impact';
  }
  
  if (message.includes('best time') || message.includes('when should i sell') || message.includes('market timing')) {
    return 'best_time_to_sell';
  }
  
  if (message.includes('worth') || message.includes('value') || message.includes('price') || message.includes('how much')) {
    return 'valuation';
  }
  
  if (message.includes('carfax') || message.includes('history') || message.includes('report')) {
    return 'vehicle_history';
  }
  
  if (message.includes('feature') || message.includes('option') || message.includes('upgrade')) {
    return 'feature_impact';
  }
  
  if (message.includes('trade') || message.includes('dealer') || message.includes('dealership')) {
    return 'trade_in';
  }
  
  if (message.includes('maintenance') || message.includes('repair') || message.includes('issue')) {
    return 'maintenance';
  }
  
  if (message.includes('compare') || message.includes('vs') || message.includes('versus')) {
    return 'comparison';
  }
  
  return 'general';
}

// Generate response based on intent and available context
export async function generateResponse(
  intent: string, 
  context: AssistantContext, 
  userMessage: string
): Promise<string> {
  const vehicle = context.vehicle || {};
  const hasVehicleBasics = !!(vehicle.make && vehicle.model && vehicle.year);
  
  // Check if we're missing critical information based on intent
  if (intent === 'valuation' && !hasVehicleBasics) {
    return `To give you an accurate valuation, I'll need some basic information about your vehicle. ${!vehicle.make ? 'What make is it? ' : ''}${!vehicle.model ? 'What model? ' : ''}${!vehicle.year ? 'What year? ' : ''}`;
  }
  
  if (intent === 'accident_impact') {
    if (!hasVehicleBasics) {
      return "To tell you how an accident impacts your vehicle's value, I'll need to know what vehicle you have. Can you share the make, model, and year?";
    }
    
    // If we have basics but not accident details
    if (vehicle.accidentCount === undefined) {
      return `For your ${vehicle.year} ${vehicle.make} ${vehicle.model}, accident impact varies by severity. Minor accidents typically reduce value by 3-5%, moderate by 5-10%, and severe by 10-20% or more. Has your vehicle been in an accident, and if so, how severe was it?`;
    }
    
    // If we have accident details
    const severity = vehicle.accidentSeverity || 'moderate';
    const impactPercentages = {
      'minor': '3-5%',
      'moderate': '5-10%',
      'severe': '10-20%'
    };
    
    let response = `Based on your ${vehicle.year} ${vehicle.make} ${vehicle.model} with ${vehicle.accidentCount} ${vehicle.accidentCount === 1 ? 'accident' : 'accidents'} (${severity}), `;
    
    if (context.isPremium) {
      return response + `I estimate the impact on value to be around ${impactPercentages[severity]}. This is based on recent market data for similar vehicles with accident history. Would you like a detailed breakdown of how this affects specific aspects of your valuation?`;
    } else {
      return response + `I estimate the impact on value to be around ${impactPercentages[severity]}. For a detailed analysis including CARFAX accident history and specific value impact, you might want to consider our Premium report. Would you like more information about that?`;
    }
  }
  
  if (intent === 'best_time_to_sell') {
    const zipInfo = vehicle.zipCode || context.userLocation?.zipCode;
    let region = 'your area';
    let seasonalAdvice = 'spring (March-May) is typically the best time to sell';
    
    // Regional customization based on ZIP code
    if (zipInfo) {
      // Simple mapping based on first digit of ZIP
      const firstDigit = zipInfo.charAt(0);
      
      if (['0', '1'].includes(firstDigit)) {
        region = 'the Northeast';
        seasonalAdvice = 'early spring (March-April) is typically best, before the summer vacation season';
      } else if (['2', '3'].includes(firstDigit)) {
        region = 'the Southeast';
        seasonalAdvice = 'late winter to early spring (February-April) is typically best, before the extreme heat';
      } else if (['4', '5'].includes(firstDigit)) {
        region = 'the Midwest';
        seasonalAdvice = 'spring (April-May) is best, after the winter weather but before summer vacations';
      } else if (['6', '7'].includes(firstDigit)) {
        region = 'the Central/Southwest region';
        seasonalAdvice = 'late winter (February-March) is often best, before the extreme heat of summer';
      } else if (['8', '9'].includes(firstDigit)) {
        region = 'the West Coast';
        seasonalAdvice = 'early spring (March-April) typically sees higher demand and better prices';
        
        // Special case for Bay Area
        if (zipInfo.startsWith('94') || zipInfo.startsWith('95')) {
          region = 'the Bay Area';
          seasonalAdvice = 'early spring (March-April) typically sees higher demand due to tech hiring cycles and bonus season';
        }
      }
    }
    
    if (hasVehicleBasics) {
      return `For your ${vehicle.year} ${vehicle.make} ${vehicle.model} in ${region}, ${seasonalAdvice}. This is when inventory is lower and demand starts increasing, potentially getting you 5-10% more than during the off-season. Additionally, vehicles like yours tend to hold value better in ${region} due to regional preferences and driving conditions.`;
    } else {
      return `In ${region}, ${seasonalAdvice}. This is when inventory is lower and demand starts increasing, potentially getting you 5-10% more than during the off-season. If you tell me your vehicle's make, model, and year, I can provide more specific timing advice for your particular vehicle.`;
    }
  }
  
  // Default response for other intents or when we don't have enough context
  if (!hasVehicleBasics) {
    return "I'd be happy to help with that! To give you the most accurate information, could you tell me what vehicle you have? I'll need the make, model, and year at minimum.";
  }
  
  return `I understand you're asking about your ${vehicle.year} ${vehicle.make} ${vehicle.model}. To better assist you with your specific question, could you provide a bit more detail about what you'd like to know?`;
}
