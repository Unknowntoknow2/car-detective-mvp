
// Define types for the AI assistant context

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
}

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
