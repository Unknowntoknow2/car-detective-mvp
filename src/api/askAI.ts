
import { AskAIRequest, AskAIResponse, AssistantContext, ChatMessage } from '@/types/assistant';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const askAI = async (request: AskAIRequest): Promise<AskAIResponse> => {
  try {
    console.log('🤖 Sending AI request:', { 
      question: request.question.substring(0, 50) + '...', 
      hasContext: !!request.userContext,
      supabaseUrl: SUPABASE_URL ? 'configured' : 'missing'
    });

    if (!SUPABASE_URL) {
      throw new Error('Supabase URL not configured');
    }

    const url = `${SUPABASE_URL}/functions/v1/ask-ai`;
    console.log('🌐 Making request to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY || ''}`,
      },
      body: JSON.stringify(request),
    });

    console.log('🤖 AI response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('🤖 AI response received:', { answerLength: data.answer?.length });
    
    return data;
  } catch (error) {
    console.error('❌ AI request failed:', error);
    throw error;
  }
};

// Test connection function
export const testAIConnection = async (): Promise<boolean> => {
  try {
    const response = await askAI({
      question: 'test',
      userContext: { isPremium: false, hasDealerAccess: false }
    });
    return response.answer === 'Connection successful';
  } catch (error) {
    console.error('AI connection test failed:', error);
    return false;
  }
};
