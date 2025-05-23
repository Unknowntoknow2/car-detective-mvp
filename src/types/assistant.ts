
export interface AssistantContext {
  isPremium: boolean;
  hasDealerAccess: boolean;
  userLocation?: {
    zip?: string;
    city?: string;
    state?: string;
    region?: string;
    zipCode?: string;
  };
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
  accidentSeverity?: string;
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
