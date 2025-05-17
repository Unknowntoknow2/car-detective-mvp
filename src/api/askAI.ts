import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { getValuationContext } from '@/utils/getValuationContext';
import { ValuationResult } from '@/types/valuation';

interface Message {
  role: 'user' | 'assistant' | 'system';
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
    
    // Prepare the system prompt with enhanced context
    const systemPrompt = `You are AIN — Auto Intelligence Network™, a GPT-4-powered vehicle valuation assistant built by Car Detective. Your job is to assist users with car valuations, market trends, premium report benefits, dealer offers, and CARFAX® insights. 

Use the user's context (make, model, year, mileage, condition, ZIP, premium status, dealer role) to give smart, helpful answers. Always respond in a confident, conversational tone.

Never guess. If info is missing (e.g., no valuation), ask for it clearly.

Your goal: help individuals sell smarter and help dealers make profitable decisions with speed and trust.
${enhancedContext && Object.keys(enhancedContext).length > 0 ? `\nUser context: ${JSON.stringify(enhancedContext, null, 2)}` : ''}`;
    
    // First try using Supabase Function if available
    try {
      const { data, error } = await supabase.functions.invoke('ask-ai', {
        body: {
          question,
          userContext: enhancedContext,
          systemPrompt,
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
        systemPrompt,
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
