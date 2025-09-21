
interface OpenAIConfig {
  apiKey: string;
  organization?: string;
  baseURL?: string;
}

class OpenAIClient {
  private apiKey: string;
  private baseURL: string;
  private organization?: string;

  constructor(config: OpenAIConfig) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'https://api.openai.com/v1';
    this.organization = config.organization;
  }

  async createChatCompletion(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    temperature?: number;
    max_tokens?: number;
  }) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };

    if (this.organization) {
      headers['OpenAI-Organization'] = this.organization;
    }

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

// SECURITY: Removed client-side OpenAI API key exposure
// OpenAI functionality moved to server-side Edge Functions
export const openai = null;

if (import.meta.env.NODE_ENV !== 'production') {
  console.warn('OpenAI client disabled - use server-side Edge Functions for AI features');
}

export default openai;
