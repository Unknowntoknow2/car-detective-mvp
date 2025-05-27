
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserContext {
  isPremium: boolean;
  hasDealerAccess: boolean;
  userId?: string;
}

export interface AskAIRequest {
  question: string;
  chatHistory?: ChatMessage[];
  userContext?: UserContext;
  systemPrompt?: string;
}

export interface AskAIResponse {
  answer: string;
  confidence?: number;
  sources?: string[];
  followUpQuestions?: string[];
}
