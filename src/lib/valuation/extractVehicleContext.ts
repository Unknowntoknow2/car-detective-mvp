
import { VehicleContext } from '@/types/assistant';

/**
 * Safely extracts vehicle context from conversation messages
 * @param conversation Array of chat messages
 * @returns Vehicle context object with extracted information
 */
export function extractVehicleContext(conversation: { role: string; content: string }[]): VehicleContext {
  try {
    const context: VehicleContext = {};
    
    // Combine all messages into a single string for pattern matching
    const text = conversation.map(msg => msg.content || '').join(' ').toLowerCase();

    // Extract year (between 1950 and next year)
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

    // Extract car make
    const makes = [
      'toyota', 'honda', 'ford', 'chevrolet', 'chevy', 'nissan', 'hyundai', 
      'kia', 'subaru', 'bmw', 'mercedes', 'audi', 'lexus', 'acura', 
      'volkswagen', 'vw', 'mazda', 'jeep', 'tesla', 'dodge', 'ram', 
      'chrysler', 'buick', 'cadillac', 'gmc', 'lincoln', 'volvo', 'porsche'
    ];
    
    for (const make of makes) {
      // Look for make mentions with word boundaries
      const makeRegex = new RegExp(`\\b${make}\\b`, 'i');
      if (makeRegex.test(text)) {
        context.make = make.charAt(0).toUpperCase() + make.slice(1);
        // Handle common abbreviations
        if (make === 'chevy') context.make = 'Chevrolet';
        if (make === 'vw') context.make = 'Volkswagen';
        break;
      }
    }

    // Extract model if make is available
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
        // Look for model mentions with word boundaries
        const modelRegex = new RegExp(`\\b${model.replace('-', '[- ]?')}\\b`, 'i');
        if (modelRegex.test(text)) {
          context.model = model.charAt(0).toUpperCase() + model.slice(1);
          break;
        }
      }
    }

    // Extract mileage
    const mileageRegex = /\b(\d{1,3}(?:,\d{3})*|\d+)(?:\s*k)?\s*(miles?|mi\.?|000)\b/gi;
    const mileageMatches = text.match(mileageRegex);
    if (mileageMatches && mileageMatches.length > 0) {
      const mileageText = mileageMatches[mileageMatches.length - 1];
      const numericPart = mileageText.replace(/[^\d.]/g, '');
      if (numericPart) {
        let mileage = parseInt(numericPart);
        // Handle 'k' abbreviation for thousands
        if (mileage < 1000 && /\bk\b/i.test(mileageText)) {
          mileage *= 1000;
        }
        context.mileage = mileage;
      }
    }

    // Extract ZIP code
    const zipRegex = /\b\d{5}(?:-\d{4})?\b/g;
    const zipMatches = text.match(zipRegex);
    if (zipMatches && zipMatches.length > 0) {
      context.zipCode = zipMatches[0].substring(0, 5);
    }

    // Extract VIN
    const vinRegex = /\b[A-HJ-NPR-Z0-9]{17}\b/i;
    const vinMatch = text.match(vinRegex);
    if (vinMatch) {
      context.vin = vinMatch[0].toUpperCase();
    }

    // Detect accident history
    const accidentTerms = ['accident', 'collision', 'crash', 'damaged', 'totaled', 'wrecked'];
    context.accidentCount = 0;
    for (const term of accidentTerms) {
      if (text.includes(term)) {
        context.accidentCount = 1;
        
        // Try to determine severity
        if (text.includes('minor') || text.includes('small')) {
          context.accidentSeverity = 'minor';
        } else if (text.includes('major') || text.includes('severe') || text.includes('serious')) {
          context.accidentSeverity = 'major';
        } else {
          context.accidentSeverity = 'moderate';
        }
        break;
      }
    }

    // Determine vehicle condition
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

    // Extract estimated value mentions
    const valueRegex = /\$(\d{1,3}(?:,\d{3})*|\d+)/g;
    const valueMatches = text.match(valueRegex);
    if (valueMatches && valueMatches.length > 0) {
      const valueText = valueMatches[valueMatches.length - 1];
      const numericValue = valueText.replace(/[^\d.]/g, '');
      if (numericValue) {
        context.estimatedValue = parseInt(numericValue);
      }
    }

    return context;
  } catch (error) {
    console.error('Error extracting vehicle context:', error);
    // Return empty object to prevent crashes
    return {};
  }
}

/**
 * Extracts location information from the conversation
 * @param conversation Chat messages
 * @returns Location object with zipCode and region if found
 */
export function extractLocationContext(conversation: { role: string; content: string }[]): { zipCode?: string; region?: string } {
  try {
    const text = conversation.map(msg => msg.content || '').join(' ').toLowerCase();
    const result: { zipCode?: string; region?: string } = {};
    
    // Extract ZIP code
    const zipRegex = /\b\d{5}(?:-\d{4})?\b/g;
    const zipMatches = text.match(zipRegex);
    if (zipMatches && zipMatches.length > 0) {
      result.zipCode = zipMatches[0].substring(0, 5);
    }
    
    // Extract region/state
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
    
    // Also check state abbreviations
    const stateAbbr = [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 
      'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 
      'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 
      'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 
      'WI', 'WY'
    ];
    
    for (const state of states) {
      if (text.includes(state)) {
        result.region = state.charAt(0).toUpperCase() + state.slice(1);
        break;
      }
    }
    
    // Try abbreviations if no full state name found
    if (!result.region) {
      for (let i = 0; i < stateAbbr.length; i++) {
        const regex = new RegExp(`\\b${stateAbbr[i]}\\b`, 'i');
        if (regex.test(text)) {
          // Map back to full state name
          result.region = states[i].charAt(0).toUpperCase() + states[i].slice(1);
          break;
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error extracting location context:', error);
    return {};
  }
}

/**
 * Detects intent from user message
 * Safe implementation that won't crash
 */
export function detectIntent(message: string): string {
  try {
    const text = message.toLowerCase();
    
    // Define intent categories and their trigger phrases
    const intentCategories: Record<string, string[]> = {
      'valuation': [
        'worth', 'value', 'price', 'appraisal', 'estimate', 'how much', 
        'sell for', 'cost', 'market value'
      ],
      'accident': [
        'accident', 'crash', 'collision', 'damaged', 'repair', 'insurance', 
        'claim', 'wreck', 'totaled', 'salvage'
      ],
      'timing': [
        'when should', 'best time', 'market trend', 'sell now', 'wait', 
        'depreciation', 'appreciate', 'value drop', 'hold onto'
      ],
      'general': [
        'help', 'hello', 'hi', 'info', 'information', 'advice', 'question', 
        'tell me', 'what is', 'how do'
      ]
    };
    
    // Determine the intent based on matched keywords
    for (const [intent, keywords] of Object.entries(intentCategories)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return intent;
        }
      }
    }
    
    // Default intent if no match found
    return 'general';
  } catch (error) {
    console.error('Error detecting intent:', error);
    return 'general';
  }
}

/**
 * Generates a response based on intent and context
 * Safe implementation that handles errors gracefully
 */
export function generateResponse(intent: string, context: any, userMessage: string): Promise<string> {
  return new Promise((resolve) => {
    try {
      // Default responses when context is minimal
      if (!context || !context.vehicle) {
        if (intent === 'valuation') {
          resolve("I'd be happy to help estimate your vehicle's value. Could you provide some details like the make, model, year, and mileage of your car?");
          return;
        }
        
        if (intent === 'accident') {
          resolve("I can help explain how accidents affect car value. Do you have a specific vehicle with accident history you'd like to discuss?");
          return;
        }
        
        if (intent === 'timing') {
          resolve("Timing the market for selling a vehicle depends on many factors. Could you tell me about the vehicle you're considering selling?");
          return;
        }
        
        resolve("I'm your car valuation assistant. I can help estimate your vehicle's value, explain how accidents affect pricing, or advise on the best time to sell. What information can I provide for you today?");
        return;
      }
      
      // Handle valuation intent with vehicle context
      if (intent === 'valuation') {
        const { make, model, year, mileage, condition } = context.vehicle;
        
        if (make && model && year) {
          let response = `Based on the information for your ${year} ${make} ${model}`;
          
          if (mileage) {
            response += ` with ${mileage.toLocaleString()} miles`;
          }
          
          if (context.vehicle.estimatedValue) {
            response += `, I estimate its value around $${context.vehicle.estimatedValue.toLocaleString()}.`;
          } else {
            response += `, I would need more details to provide an accurate valuation. Factors like condition, location, and optional features all affect the price.`;
          }
          
          if (condition) {
            response += ` Being in ${condition} condition ` + (condition === 'excellent' ? 'positively impacts' : condition === 'poor' ? 'significantly reduces' : 'factors into') + ' this estimate.';
          }
          
          if (context.vehicle.accidentCount && context.vehicle.accidentCount > 0) {
            response += ` Note that the accident history typically reduces value by 10-30% depending on severity.`;
          }
          
          resolve(response);
          return;
        }
        
        resolve("I'd be happy to help estimate your vehicle's value. Could you provide some details like the make, model, year, and mileage of your car?");
        return;
      }
      
      // Handle accident intent
      if (intent === 'accident') {
        if (context.vehicle.accidentCount && context.vehicle.accidentCount > 0) {
          const severity = context.vehicle.accidentSeverity || 'moderate';
          const impactMap: Record<string, string> = {
            'minor': '10-15%',
            'moderate': '15-25%',
            'major': '30-50%'
          };
          
          resolve(`For your ${context.vehicle.year || ''} ${context.vehicle.make || ''} ${context.vehicle.model || ''}, having a ${severity} accident typically reduces the value by ${impactMap[severity]}. Vehicles with clean histories command premium prices, so this is an important factor for buyers.`);
          return;
        }
        
        resolve("Accidents typically reduce a vehicle's value by 10-50% depending on severity. Minor incidents might only affect value by 10-15%, while major accidents can decrease value by 30% or more. Clean vehicle history reports command premium prices in the market.");
        return;
      }
      
      // Handle timing intent
      if (intent === 'timing') {
        const currentMonth = new Date().getMonth();
        let seasonalAdvice = "";
        
        if (currentMonth >= 2 && currentMonth <= 4) {
          seasonalAdvice = "Spring is generally a good time to sell as buyers look for vehicles after tax returns.";
        } else if (currentMonth >= 5 && currentMonth <= 7) {
          seasonalAdvice = "Summer can be ideal for selling convertibles and sports cars when demand is higher.";
        } else if (currentMonth >= 8 && currentMonth <= 10) {
          seasonalAdvice = "Fall is often when dealers offer incentives on new models, which can affect used car values.";
        } else {
          seasonalAdvice = "Winter typically sees slower sales except for SUVs and AWD vehicles in snowy regions.";
        }
        
        if (context.vehicle.make && context.vehicle.model) {
          resolve(`For your ${context.vehicle.year || ''} ${context.vehicle.make} ${context.vehicle.model}, ${seasonalAdvice} Also consider that vehicles typically depreciate 15-20% per year in the first few years, then 7-12% annually after that.`);
          return;
        }
        
        resolve(`${seasonalAdvice} Generally, vehicles depreciate fastest in their first 3-5 years. If your car is newer, waiting might mean more value loss. For older vehicles, timing matters less as depreciation slows considerably after 5-7 years.`);
        return;
      }
      
      // Default general response
      resolve("I'm your car valuation assistant. I can help estimate your vehicle's value, explain how accidents affect pricing, or advise on the best time to sell. What specific information are you looking for today?");
      
    } catch (error) {
      console.error('Error generating response:', error);
      resolve("I'm sorry, I encountered an issue processing that request. Could you try rephrasing or providing different details about your vehicle?");
    }
  });
}
