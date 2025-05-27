
export interface VehicleContext {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  vin?: string;
  features?: string[];
  zipCode?: string;
  accidentHistory?: boolean;
}

export interface AssistantContext {
  vehicle?: VehicleContext;
  valuation?: any;
  user?: any;
  session?: any;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  id?: string;
}

export interface AskAIRequest {
  message: string;
  context?: AssistantContext;
  history?: ChatMessage[];
  question?: string;
  userContext?: any;
  chatHistory?: ChatMessage[];
  systemPrompt?: string;
}

export interface AskAIResponse {
  response: string;
  context?: AssistantContext;
  success: boolean;
  error?: string;
  answer?: string;
}
