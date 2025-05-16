
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { getValuationContext } from '@/utils/getValuationContext';
import { ValuationResult } from '@/types/valuation';

// GPT_AI_ASSISTANT_V1
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

interface AskAIParams {
  question: string;
  userContext?: Record<string, any> | null;
  chatHistory?: Message[];
  valuationId?: string;
}

export async function askAI({ question, userContext, chatHistory, valuationId }: AskAIParams): Promise<{
  answer?: string;
  error?: string;
}> {
  try {
    // Enhance context with valuation data if available
    let enhancedContext = { ...userContext };
    
    if (valuationId) {
      const valuation = await getValuationContext(valuationId);
      if (valuation) {
        enhancedContext = {
          ...enhancedContext,
          valuation: {
            make: valuation.make,
            model: valuation.model,
            year: valuation.year,
            mileage: valuation.mileage,
            condition: valuation.condition,
            zipCode: valuation.zipCode,
            estimatedValue: valuation.estimatedValue,
            confidenceScore: valuation.confidenceScore,
            isPremium: valuation.premium_unlocked
          }
        };
      }
    }
    
    // First try using Supabase Function if available
    try {
      const { data, error } = await supabase.functions.invoke('ask-ai', {
        body: {
          question,
          userContext: enhancedContext,
          chatHistory: chatHistory?.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }
      });
      
      if (!error && data?.answer) {
        return { answer: data.answer };
      }
      
      // If Supabase function failed, we'll try the regular API endpoint as fallback
      console.warn('Supabase function failed, falling back to regular endpoint', error);
    } catch (e) {
      console.warn('Supabase not configured, using regular endpoint');
    }
    
    // Regular API endpoint as fallback
    const response = await fetch('/api/ask-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        userContext: enhancedContext,
        chatHistory
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }
    
    const data = await response.json();
    return { answer: data.answer };
    
  } catch (error: any) {
    console.error('AI assistant error:', error);
    return { error: error.message || 'Failed to get AI response' };
  }
}
