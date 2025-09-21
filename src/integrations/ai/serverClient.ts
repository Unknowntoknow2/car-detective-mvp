// Server-side OpenAI integration via Edge Function
import { supabase } from '@/integrations/supabase/client';

export interface AICompletionRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AICompletionResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class ServerAIClient {
  async createCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('ask-ain', {
        body: {
          messages: request.messages,
          model: request.model || 'gpt-3.5-turbo',
          temperature: request.temperature || 0.7,
          max_tokens: request.maxTokens || 1000
        }
      });

      if (error) {
        throw new Error(`AI service error: ${error.message}`);
      }

      if (!data?.content) {
        throw new Error('Invalid response from AI service');
      }

      return {
        content: data.content,
        usage: data.usage
      };
    } catch (error) {
      throw new Error('AI service temporarily unavailable. Please try again.');
    }
  }

  async generateValuationExplanation(
    vehicleInfo: { make: string; model: string; year: number; mileage: number },
    estimatedValue: number,
    adjustments: Array<{ factor: string; impact: number; description: string }>
  ): Promise<string> {
    const messages = [
      {
        role: 'system' as const,
        content: 'You are a vehicle valuation expert. Explain valuations clearly and professionally.'
      },
      {
        role: 'user' as const,
        content: `Explain the valuation for a ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} with ${vehicleInfo.mileage.toLocaleString()} miles, valued at $${estimatedValue.toLocaleString()}. Key factors: ${adjustments.map(a => `${a.factor}: ${a.impact > 0 ? '+' : ''}$${a.impact}`).join(', ')}`
      }
    ];

    const response = await this.createCompletion({ messages });
    return response.content;
  }
}

// Export singleton instance
export const serverAI = new ServerAIClient();