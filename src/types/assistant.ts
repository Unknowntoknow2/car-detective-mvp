
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AssistantContext {
  isPremium: boolean;
  hasDealerAccess: boolean;
  valuationId?: string;
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
