
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
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

export interface AssistantContext {
  isPremium: boolean;
  hasDealerAccess: boolean;
  valuationId?: string;
  vehicleContext?: VehicleContext;
}

export interface AskAIRequest {
  question: string;
  userContext: AssistantContext;
  chatHistory?: ChatMessage[];
  systemPrompt?: string;
}

export interface AskAIResponse {
  answer: string;
}
