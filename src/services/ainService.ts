
import { supabase } from '@/integrations/supabase/client';
import { VehicleContext, AssistantContext, AskAIRequest } from '@/types/assistant';

export interface AINResponse {
  answer: string;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function askAIN(
  question: string,
  vehicleContext?: VehicleContext,
  chatHistory?: ChatMessage[]
): Promise<AINResponse> {
  try {
    const requestBody = {
      message: question,
      vinContext: vehicleContext,
      chatHistory
    };

    const { data, error } = await supabase.functions.invoke('ask-ain', {
      body: requestBody
    });

    if (error) {
      // Handle specific error types
      if (error.message?.includes('429') || error.message?.includes('rate_limit')) {
        return { 
          answer: '', 
          error: 'AIN is experiencing high demand. Please try again in a moment.' 
        };
      } else if (error.message?.includes('authentication')) {
        return { 
          answer: '', 
          error: 'AIN service is temporarily unavailable. Our team has been notified.' 
        };
      } else {
        return { 
          answer: '', 
          error: 'Unable to connect to AIN. Please check your connection and try again.' 
        };
      }
    }

    if (!data) {
      return { 
        answer: '', 
        error: 'No response received from AIN. Please try again.' 
      };
    }

    if (data.error) {
      return { 
        answer: '', 
        error: data.error 
      };
    }

    if (!data.answer) {
      return { 
        answer: '', 
        error: 'Invalid response from AIN. Please try again.' 
      };
    }
    return { answer: data.answer };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Network or connection errors
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
      return { 
        answer: '', 
        error: 'Network connection failed. Please check your internet and try again.' 
      };
    }
    
    return { 
      answer: '', 
      error: 'AIN is temporarily unavailable. Please try again in a moment.' 
    };
  }
}
