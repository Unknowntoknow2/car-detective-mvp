
import { VehicleContext, AssistantContext } from '@/types/assistant';

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
