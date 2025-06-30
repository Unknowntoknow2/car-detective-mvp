
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

let openai: OpenAIClient | null = null;

try {
  const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (openaiApiKey) {
    openai = new OpenAIClient({
      apiKey: openaiApiKey,
    });
  } else {
    console.warn('OpenAI API key not found. Some features may not work.');
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
  openai = null;
}

export { openai };
export default openai;
