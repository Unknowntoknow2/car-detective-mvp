
// ✅ File: src/utils/assistantContext.ts

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

// Basic implementation of intent detection (simplified version)
export function detectIntent(message: string): string {
  const message_lower = message.toLowerCase();
  
  if (message_lower.includes('value') || message_lower.includes('worth')) {
    return 'value_inquiry';
  } else if (message_lower.includes('accident') || message_lower.includes('damage')) {
    return 'accident_impact';
  } else if (message_lower.includes('sell') || message_lower.includes('selling')) {
    return 'selling_advice';
  } else if (message_lower.includes('premium') || message_lower.includes('report')) {
    return 'premium_benefits';
  } else if (message_lower.includes('dealer') || message_lower.includes('offer')) {
    return 'dealer_offers';
  } else if (message_lower.includes('carfax') || message_lower.includes('history')) {
    return 'vehicle_history';
  } else {
    return 'general_inquiry';
  }
}

// Basic implementation of response generation based on intent
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
          response = `Based on our data, your ${vehicleInfo} has an estimated value of $${(vehicle || vehicleContext)?.estimatedValue?.toLocaleString()}. This estimate takes into account the vehicle's age, condition, and mileage.`;
        } else {
          response = `I'd be happy to help you determine the value of ${vehicleInfo}. To provide an accurate estimate, I'll need some information like the year, make, model, mileage, and condition of your vehicle.`;
        }
        break;
        
      case 'accident_impact':
        if ((vehicle || vehicleContext)?.accidentHistory) {
          response = `Accident history can impact a vehicle's value. For your ${vehicleInfo}, the accident records show ${(vehicle || vehicleContext)?.accidentCount || 'some'} incidents, which typically reduces value by 10-30% depending on severity.`;
        } else {
          response = `Accident history can significantly impact a vehicle's value. Generally, a vehicle with accident history can see a reduction in value of 10-30% depending on the severity of the damage.`;
        }
        break;
        
      case 'selling_advice':
        response = `When selling your ${vehicleInfo}, consider these tips: 1) Clean it thoroughly inside and out, 2) Gather all maintenance records, 3) Take quality photos, 4) Be honest about its condition, and 5) Price it competitively based on market research.`;
        break;
        
      case 'premium_benefits':
        if (isPremium) {
          response = `As a premium member, you have access to comprehensive vehicle history reports, market value trends, depreciation forecasts, and personalized selling advice for your ${vehicleInfo}.`;
        } else {
          response = `Our premium reports provide in-depth vehicle history, market value trends, depreciation forecasts, and personalized selling advice. Upgrade to premium to unlock these features for your ${vehicleInfo}.`;
        }
        break;
        
      case 'dealer_offers':
        response = `Dealer offers for your ${vehicleInfo} will typically be lower than private sale values, usually by about 10-15%. This difference accounts for the dealer's overhead costs and profit margin when they resell the vehicle.`;
        break;
        
      case 'vehicle_history':
        if (isPremium) {
          response = `Your premium access includes full CARFAX® vehicle history reports. For your ${vehicleInfo}, this shows detailed ownership history, service records, and reported incidents.`;
        } else {
          response = `CARFAX® reports provide crucial vehicle history information including ownership history, service records, and accident reports. Upgrade to premium to access the full history for your ${vehicleInfo}.`;
        }
        break;
        
      default:
        response = `I'm here to help with any questions about your ${vehicleInfo}, including its value, selling advice, or market trends. What else would you like to know?`;
    }
    
    setTimeout(() => {
      resolve(response);
    }, 300); // Small delay to simulate processing
  });
}
