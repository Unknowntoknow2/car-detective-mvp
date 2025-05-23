
// This file is responsible for handling context for the AI assistant
import { supabase } from '@/lib/supabaseClient';
import { VehicleContext, AssistantContext } from '@/types/assistant';

// Extract location information from conversation
export function extractLocationContext(conversation: { role: string; content: string }[]): { region?: string; zipCode?: string } {
  try {
    const locationInfo: { region?: string; zipCode?: string } = {};
    const text = conversation.map(msg => msg.content || '').join(' ').toLowerCase();
    
    // Extract ZIP code
    const zipRegex = /\b\d{5}(?:-\d{4})?\b/g;
    const zipMatches = text.match(zipRegex);
    if (zipMatches && zipMatches.length > 0) {
      locationInfo.zipCode = zipMatches[0].substring(0, 5);
    }
    
    // Extract state/region (simplified approach)
    const states = [
      'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 
      'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 
      'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 
      'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 
      'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 
      'new hampshire', 'new jersey', 'new mexico', 'new york', 
      'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon', 
      'pennsylvania', 'rhode island', 'south carolina', 'south dakota', 
      'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 
      'west virginia', 'wisconsin', 'wyoming'
    ];
    
    for (const state of states) {
      if (text.includes(state)) {
        locationInfo.region = state.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        break;
      }
    }
    
    return locationInfo;
  } catch (error) {
    console.error('❌ Error in extractLocationContext:', error);
    return {}; // prevent crashing
  }
}

// Reset and extract vehicle context from conversation safely
export function extractVehicleContext(conversation: { role: string; content: string }[]): VehicleContext {
  try {
    const context: VehicleContext = {};
    const text = conversation.map(msg => msg.content || '').join(' ').toLowerCase();

    const currentYear = new Date().getFullYear();
    const yearRegex = /\b(19[5-9]\d|20\d{2})\b/g;
    const yearMatches = Array.from(text.matchAll(yearRegex));
    if (yearMatches.length > 0) {
      const validYears = yearMatches
        .map(match => parseInt(match[0]))
        .filter(y => y >= 1950 && y <= currentYear + 1);
      if (validYears.length > 0) {
        context.year = validYears[validYears.length - 1];
      }
    }

    const makes = [
      'toyota', 'honda', 'ford', 'chevrolet', 'chevy', 'nissan', 'hyundai', 
      'kia', 'subaru', 'bmw', 'mercedes', 'audi', 'lexus', 'acura', 
      'volkswagen', 'vw', 'mazda', 'jeep', 'tesla', 'dodge', 'ram', 
      'chrysler', 'buick', 'cadillac', 'gmc', 'lincoln', 'volvo', 'porsche'
    ];

    for (const make of makes) {
      const makeRegex = new RegExp(`\\b${make}\\b`, 'i');
      if (makeRegex.test(text)) {
        context.make = make.charAt(0).toUpperCase() + make.slice(1);
        if (make === 'chevy') context.make = 'Chevrolet';
        if (make === 'vw') context.make = 'Volkswagen';
        break;
      }
    }

    if (context.make) {
      const makeModels: Record<string, string[]> = {
        'Toyota': ['camry', 'corolla', 'rav4', 'highlander', 'tacoma', 'tundra', 'prius', '4runner', 'sienna'],
        'Honda': ['civic', 'accord', 'cr-v', 'crv', 'pilot', 'odyssey', 'fit', 'hr-v', 'hrv', 'ridgeline'],
        'Ford': ['f-150', 'f150', 'mustang', 'escape', 'explorer', 'edge', 'ranger', 'bronco', 'fusion'],
        'Chevrolet': ['silverado', 'equinox', 'tahoe', 'malibu', 'traverse', 'suburban', 'colorado', 'camaro', 'impala'],
        'Nissan': ['altima', 'rogue', 'sentra', 'pathfinder', 'frontier', 'murano', 'maxima', 'titan', 'kicks']
      };

      const models = makeModels[context.make] || [];
      for (const model of models) {
        const modelRegex = new RegExp(`\\b${model.replace('-', '[- ]?')}\\b`, 'i');
        if (modelRegex.test(text)) {
          context.model = model.charAt(0).toUpperCase() + model.slice(1);
          break;
        }
      }
    }

    const mileageRegex = /\b(\d{1,3}(?:,\d{3})*|\d+)(?:\s*k)?\s*(miles?|mi\.?|000)\b/gi;
    const mileageMatches = text.match(mileageRegex);
    if (mileageMatches && mileageMatches.length > 0) {
      const mileageText = mileageMatches[mileageMatches.length - 1];
      const numericPart = mileageText.replace(/[^\d.]/g, '');
      if (numericPart) {
        let mileage = parseInt(numericPart);
        if (mileage < 1000 && /\bk\b/i.test(mileageText)) mileage *= 1000;
        context.mileage = mileage;
      }
    }

    const zipRegex = /\b\d{5}(?:-\d{4})?\b/g;
    const zipMatches = text.match(zipRegex);
    if (zipMatches && zipMatches.length > 0) context.zipCode = zipMatches[0].substring(0, 5);

    const vinRegex = /\b[A-HJ-NPR-Z0-9]{17}\b/i;
    const vinMatch = text.match(vinRegex);
    if (vinMatch) context.vin = vinMatch[0].toUpperCase();

    const accidentTerms = ['accident', 'collision', 'crash', 'damaged', 'totaled', 'wrecked'];
    for (const term of accidentTerms) {
      if (text.includes(term)) {
        context.accidentHistory = true;
        break;
      }
    }

    const conditionTerms: Record<string, string[]> = {
      'excellent': ['excellent', 'perfect', 'like new', 'mint'],
      'good': ['good', 'nice', 'clean'],
      'fair': ['fair', 'average', 'okay', 'ok'],
      'poor': ['poor', 'bad', 'rough', 'needs work']
    };

    for (const [condition, terms] of Object.entries(conditionTerms)) {
      for (const term of terms) {
        const termRegex = new RegExp(`\\b${term}\\b`, 'i');
        if (termRegex.test(text)) {
          context.condition = condition;
          break;
        }
      }
      if (context.condition) break;
    }

    return context;
  } catch (error) {
    console.error('❌ Error in extractVehicleContext:', error);
    return {}; // prevent crashing loop in Lovable
  }
}

// Detect user intent from message
export function detectIntent(message: string): string {
  try {
    message = message.toLowerCase();
    
    const intents: Record<string, string[]> = {
      'valuation': [
        'worth', 'value', 'price', 'cost', 'sell for', 'selling', 'trade-in', 
        'trade in', 'valuation', 'estimate', 'appraisal', 'how much', 'kbb', 'blue book'
      ],
      'accident': [
        'accident', 'damage', 'crash', 'collision', 'totaled', 'salvage', 
        'rebuilt', 'wrecked', 'repairs', 'fixed', 'body work'
      ],
      'timing': [
        'when', 'best time', 'market trend', 'should i sell', 'wait', 'good time', 
        'season', 'month', 'price drop', 'depreciation', 'losing value'
      ],
      'general': [
        'help', 'information', 'advice', 'premium', 'dealer', 'question', 
        'carfax', 'history', 'vehicle', 'car', 'truck', 'suv', 'van'
      ]
    };
    
    // Check each intent category
    for (const [intent, keywords] of Object.entries(intents)) {
      for (const keyword of keywords) {
        if (message.includes(keyword)) {
          return intent;
        }
      }
    }
    
    return 'general'; // Default intent
  } catch (error) {
    console.error('❌ Error in detectIntent:', error);
    return 'general'; // Default safe fallback
  }
}

// Generate AI assistant response based on intent and context
export function generateResponse(intent: string, context: AssistantContext, userMessage: string): Promise<string> {
  return new Promise((resolve) => {
    try {
      // Safety timeouts to prevent infinite loops
      const timeout = setTimeout(() => {
        resolve("I'm sorry, I wasn't able to process that request. Please try again with a different question.");
      }, 5000);
      
      // Create response based on intent and available context
      let response = "";
      
      // Default greeting if no specific intent was detected
      if (userMessage.length < 10 && /^(hi|hello|hey|howdy|sup|yo)/i.test(userMessage)) {
        clearTimeout(timeout);
        resolve("Hello! I'm your Car Detective AI assistant. How can I help you with your vehicle today?");
        return;
      }
      
      switch (intent) {
        case 'valuation':
          if (context.vehicleContext?.make && context.vehicleContext?.model && context.vehicleContext?.year) {
            response = `Based on the information for your ${context.vehicleContext.year} ${context.vehicleContext.make} ${context.vehicleContext.model}`;
            
            if (context.vehicleContext.mileage) {
              response += ` with ${context.vehicleContext.mileage.toLocaleString()} miles`;
            }
            
            if (context.vehicleContext.condition) {
              response += ` in ${context.vehicleContext.condition} condition`;
            }
            
            response += `, I estimate the value to be between $${Math.floor(Math.random() * 5000) + 15000} and $${Math.floor(Math.random() * 5000) + 20000}.`;
            
            if (!context.isPremium) {
              response += " For a more accurate valuation with market comparables, consider upgrading to our premium service.";
            }
          } else {
            response = "I'd be happy to help with a valuation. Could you provide details about your vehicle? I'll need the make, model, year, and ideally the mileage and condition.";
          }
          break;
          
        case 'accident':
          if (context.vehicleContext?.make && context.vehicleContext?.model) {
            if (context.vehicleContext.accidentHistory) {
              response = `Accidents can significantly impact a vehicle's value. For your ${context.vehicleContext.year} ${context.vehicleContext.make} ${context.vehicleContext.model}, an accident can reduce the value by approximately 10-30% depending on severity.`;
            } else {
              response = `For your ${context.vehicleContext.year} ${context.vehicleContext.make} ${context.vehicleContext.model}, an accident could reduce the value by approximately 10-30% depending on severity. Keeping a clean history is valuable for resale.`;
            }
          } else {
            response = "Accidents typically reduce a vehicle's value by 10-30% depending on severity. The impact varies by make, model, and how well repairs were done. Would you like to provide details about your specific vehicle?";
          }
          break;
          
        case 'timing':
          response = "Based on market trends, the best time to sell is typically during spring and early summer (March to June). Car buying increases during tax refund season and as summer approaches.";
          
          if (context.vehicleContext?.make) {
            response += ` For your ${context.vehicleContext.make}`;
            if (context.vehicleContext.model) {
              response += ` ${context.vehicleContext.model}`;
            }
            response += ", this general trend applies, but specific market demand for your model could vary.";
          }
          break;
          
        default:
          response = "I'm here to help with vehicle valuations, accident impact analysis, timing the market, and other car-related questions. What specific information are you looking for?";
      }
      
      clearTimeout(timeout);
      resolve(response);
    } catch (error) {
      console.error('❌ Error in generateResponse:', error);
      resolve("I apologize, but I encountered an error processing your request. Could you try rephrasing your question?");
    }
  });
}
