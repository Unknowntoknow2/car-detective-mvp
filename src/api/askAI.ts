
import { AskAIRequest, AskAIResponse, ChatMessage } from '@/types/assistant';

const SUPABASE_URL = 'https://xltxqqzattxogxtqrggt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY';

export const askAI = async (request: AskAIRequest): Promise<AskAIResponse> => {
  try {
    console.log('🤖 Sending AI request:', { 
      message: request.message.substring(0, 50) + '...', 
      hasContext: !!request.context
    });

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

// Legacy support for existing components
export const askAIN = async (messages: ChatMessage[]) => {
  try {
    const lastMessage = messages[messages.length - 1];
    const question = lastMessage?.content || '';
    
    const response = await askAI({
      message: question,
      chatHistory: messages.slice(0, -1),
      userContext: {
        isPremium: false,
        hasDealerAccess: false
      },
      systemPrompt: `You are AIN — Auto Intelligence Network™, a GPT-4o-powered vehicle valuation assistant built by Car Detective. Your job is to assist users with car valuations, market trends, premium report benefits, dealer offers, and CARFAX® insights.

CORE EXPERTISE:
- Vehicle valuations and pricing analysis
- Market trends and forecasting  
- CARFAX® report interpretation
- Accident impact assessment
- Dealer vs private party pricing
- Vehicle condition evaluation
- Regional market variations
- Seasonal pricing factors

RESPONSE STYLE:
- Confident and conversational
- Provide specific, actionable insights
- Use data-driven explanations
- Be helpful and educational
- Never guess - ask for missing information

Your goal: help individuals sell smarter and help dealers make profitable decisions with speed and trust.`
    });

    return { reply: response.answer || response.response };
  } catch (error: any) {
    console.error('AIN API error:', error.message);
    throw error;
  }
};
