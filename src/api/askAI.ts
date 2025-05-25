
import { AskAIRequest, AskAIResponse } from '@/types/assistant';

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
      throw new Error('AI service not configured');
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/ask-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(request),
    });

    console.log('🤖 AI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI service error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('🤖 AI response received:', { answerLength: data.answer?.length });
    
    return data;
  } catch (error) {
    console.error('❌ AI request failed:', error);
    throw new Error('Unable to connect to AI assistant. Please try again.');
  }
};
