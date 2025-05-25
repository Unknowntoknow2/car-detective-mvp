
import { supabase } from '@/integrations/supabase/client';
import { VehicleContext, AssistantContext, AskAIRequest } from '@/types/assistant';

export interface AINResponse {
  answer: string;
  error?: string;
}

export async function askAIN(
  question: string,
  vehicleContext?: VehicleContext,
  chatHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<AINResponse> {
  try {
    console.log('🤖 Sending request to AIN:', { question, hasContext: !!vehicleContext });
    
    const requestBody = {
      message: question,
      vinContext: vehicleContext,
      chatHistory
    };

    const { data, error } = await supabase.functions.invoke('ask-ain', {
      body: requestBody
    });

    if (error) {
      console.error('❌ Supabase function error:', error);
      throw new Error(error.message || 'Failed to get response from AI assistant');
    }

    if (!data || !data.answer) {
      console.error('❌ Invalid response format:', data);
      throw new Error('Invalid response from AI assistant');
    }

    console.log('✅ AIN response received:', { answerLength: data.answer.length });
    return { answer: data.answer };

  } catch (error) {
    console.error('❌ AIN service error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unable to connect to AI assistant';
    return { 
      answer: '', 
      error: errorMessage 
    };
  }
}
