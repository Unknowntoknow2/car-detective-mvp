
import { AssistantContext, VehicleContext } from '@/types/assistant';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Intent detection keywords for different categories
const intentKeywords = {
  valuation: [
    'worth', 'value', 'price', 'valuation', 'appraisal', 'estimate', 'how much',
    'kbb', 'kelly blue book', 'trade-in', 'retail', 'fair market'
  ],
  accident: [
    'accident', 'damage', 'crash', 'collision', 'repair', 'totaled', 'salvage', 
    'carfax', 'history', 'insurance claim'
  ],
  timing: [
    'when', 'best time', 'market trend', 'sell now', 'wait', 'depreciation', 
    'appreciate', 'season', 'month', 'fall', 'summer', 'winter', 'spring'
  ],
  general: [
    'premium', 'report', 'carfax', 'offer', 'dealer', 'subscription', 'feature',
    'benefits', 'help', 'info', 'information', 'explain'
  ]
};

type IntentCategory = 'valuation' | 'accident' | 'timing' | 'general' | 'unknown';

// Extract vehicle context from conversation history
export function extractVehicleContext(messages: Message[]): VehicleContext {
  const vehicleContext: VehicleContext = {};
  
  // Extract information from user messages
  for (const message of messages) {
    if (message.role === 'user') {
      const content = message.content.toLowerCase();
      
      // Extract year (4 digit number between 1980-2025)
      const yearMatch = content.match(/\b(19[8-9]\d|20[0-2]\d)\b/);
      if (yearMatch && !vehicleContext.year) {
        vehicleContext.year = parseInt(yearMatch[0]);
      }
      
      // Extract make
      const commonMakes = ['toyota', 'honda', 'ford', 'chevrolet', 'bmw', 'audi', 'tesla', 'hyundai', 'kia'];
      for (const make of commonMakes) {
        if (content.includes(make) && !vehicleContext.make) {
          vehicleContext.make = make.charAt(0).toUpperCase() + make.slice(1);
          break;
        }
      }
      
      // Extract model - simplified approach
      const commonModels = ['camry', 'civic', 'f-150', 'model 3', 'accord', '3 series', 'silverado'];
      for (const model of commonModels) {
        if (content.includes(model) && !vehicleContext.model) {
          vehicleContext.model = model.charAt(0).toUpperCase() + model.slice(1);
          break;
        }
      }
      
      // Extract mileage
      const mileageMatch = content.match(/\b(\d{1,3}(,\d{3})*|\d+)\s*(k|thousand|mi|miles)\b/i);
      if (mileageMatch && !vehicleContext.mileage) {
        let mileage = mileageMatch[1].replace(/,/g, '');
        if (mileageMatch[3].toLowerCase() === 'k' || mileageMatch[3].toLowerCase() === 'thousand') {
          mileage = String(parseInt(mileage) * 1000);
        }
        vehicleContext.mileage = parseInt(mileage);
      }
      
      // Extract condition
      const conditions = ['excellent', 'good', 'fair', 'poor'];
      for (const condition of conditions) {
        if (content.includes(condition) && !vehicleContext.condition) {
          vehicleContext.condition = condition;
          break;
        }
      }
      
      // Extract ZIP code (5-digit number)
      const zipMatch = content.match(/\b\d{5}\b/);
      if (zipMatch && !vehicleContext.zipCode) {
        vehicleContext.zipCode = zipMatch[0];
      }
      
      // Extract VIN (17 character alphanumeric)
      const vinMatch = content.match(/\b[A-HJ-NPR-Z0-9]{17}\b/i);
      if (vinMatch && !vehicleContext.vin) {
        vehicleContext.vin = vinMatch[0].toUpperCase();
      }
      
      // Extract estimated value
      const valueMatch = content.match(/\$\s?(\d{1,3}(,\d{3})*|\d+)/);
      if (valueMatch && !vehicleContext.estimatedValue) {
        vehicleContext.estimatedValue = parseInt(valueMatch[1].replace(/,/g, ''));
      }
      
      // Extract accident information
      if (content.includes('accident') || content.includes('accidents')) {
        // Count of accidents
        const countMatch = content.match(/(\d+)\s+(accident|accidents)/);
        if (countMatch && !vehicleContext.accidentCount) {
          vehicleContext.accidentCount = parseInt(countMatch[1]);
        }
        
        // Severity
        const severities = ['minor', 'moderate', 'major', 'severe'];
        for (const severity of severities) {
          if (content.includes(severity) && !vehicleContext.accidentSeverity) {
            vehicleContext.accidentSeverity = severity;
            break;
          }
        }
      }
    }
  }
  
  return vehicleContext;
}

// Detect intent from user message
export function detectIntent(message: string): IntentCategory {
  const lowerMessage = message.toLowerCase();
  
  // Check each intent category
  for (const category of Object.keys(intentKeywords) as Array<keyof typeof intentKeywords>) {
    for (const keyword of intentKeywords[category]) {
      if (lowerMessage.includes(keyword)) {
        return category as IntentCategory;
      }
    }
  }
  
  return 'unknown';
}

// Generate response based on intent and context
export async function generateResponse(
  intent: string, 
  context: AssistantContext, 
  userMessage: string
): Promise<string> {
  // Default responses for different intents
  const responses = {
    valuation: [
      "Based on the information you've provided, I can help estimate your vehicle's value.",
      "To give you an accurate valuation, I'd need to know the make, model, year, and condition of your vehicle.",
      "Vehicle values can vary based on many factors including mileage, condition, and local market trends."
    ],
    accident: [
      "Accident history can impact a vehicle's value by 10-30% depending on severity.",
      "If your vehicle has been in an accident, the impact on value depends on how well it was repaired.",
      "Multiple accidents generally have a compounding effect on a vehicle's value."
    ],
    timing: [
      "The best time to sell is typically spring and early summer when demand is highest.",
      "If you're not in a rush, monitoring market trends can help you identify the optimal selling time.",
      "Waiting for the right season can sometimes increase your selling price by 5-10%."
    ],
    general: [
      "Our premium reports include CARFAX® history, market analysis, and detailed valuation breakdowns.",
      "Premium features give you access to dealer offers, market forecasts, and comprehensive condition assessments.",
      "I'm here to help with any car-related questions you might have."
    ],
    unknown: [
      "I'm here to help with vehicle valuations, accident impact assessments, market timing, and more.",
      "Could you provide more details about your vehicle so I can better assist you?",
      "Feel free to ask about your car's value, accident history impact, or the best time to sell."
    ]
  };
  
  // Use the correct type for indexing
  const intentCategory = (intent in responses) ? 
    intent as keyof typeof responses : 
    'unknown' as keyof typeof responses;
  
  // Select a random response from the appropriate category
  const responseOptions = responses[intentCategory];
  const randomResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];
  
  // Enhance the response with context if available
  let enhancedResponse = randomResponse;
  
  if (context.vehicle) {
    if (context.vehicle.make && context.vehicle.model) {
      enhancedResponse += ` For your ${context.vehicle.year || ''} ${context.vehicle.make} ${context.vehicle.model}`;
      
      if (context.vehicle.mileage) {
        enhancedResponse += ` with ${context.vehicle.mileage.toLocaleString()} miles`;
      }
      
      enhancedResponse += ", ";
    }
    
    if (intent === 'valuation' && context.vehicle.estimatedValue) {
      enhancedResponse += ` I estimate a value of approximately $${context.vehicle.estimatedValue.toLocaleString()}, `;
    }
    
    if (intent === 'accident' && context.vehicle.accidentCount !== undefined) {
      if (context.vehicle.accidentCount === 0) {
        enhancedResponse += " with no accident history, your vehicle should maintain its full market value, ";
      } else {
        enhancedResponse += ` with ${context.vehicle.accidentCount} ${context.vehicle.accidentSeverity || ''} accident${context.vehicle.accidentCount > 1 ? 's' : ''}, you might see a value reduction of approximately `;
        
        let reductionPercent = 10;
        if (context.vehicle.accidentCount > 1) reductionPercent += 5 * (context.vehicle.accidentCount - 1);
        if (context.vehicle.accidentSeverity === 'major' || context.vehicle.accidentSeverity === 'severe') reductionPercent += 10;
        
        enhancedResponse += `${reductionPercent}%, `;
      }
    }
  }
  
  if (context.userLocation && intent === 'timing') {
    const region = context.userLocation.region;
    const zipCode = context.userLocation.zipCode;
    
    if (region === 'Northeast') {
      enhancedResponse += " In the Northeast, spring is particularly good for selling as buyers emerge after winter. ";
    } else if (region === 'Southwest' || region === 'West') {
      enhancedResponse += " In your region, the market remains relatively consistent year-round due to the climate. ";
    }
    
    if (zipCode) {
      enhancedResponse += ` Based on your location (${zipCode}), local market conditions appear favorable. `;
    }
  }
  
  if (context.isPremium) {
    enhancedResponse += " As a premium user, you have access to our complete market analysis and dealer network. ";
  } else if (intent === 'valuation' || intent === 'accident') {
    enhancedResponse += " For a more detailed analysis, consider upgrading to our premium service. ";
  }
  
  // Personalize the ending
  enhancedResponse += " Would you like more specific information about something else?";
  
  return enhancedResponse;
}
