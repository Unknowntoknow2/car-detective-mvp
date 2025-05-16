
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

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
}

export async function askAI({ question, userContext, chatHistory }: AskAIParams): Promise<{
  answer?: string;
  error?: string;
}> {
  try {
    // First try using Supabase Function if available
    try {
      const { data, error } = await supabase.functions.invoke('ask-ai', {
        body: {
          question,
          userContext,
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
        userContext,
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
