
import { supabase } from '@/integrations/supabase/client';
import { VehicleContext, AssistantContext, AskAIRequest } from '@/types/assistant';

export interface AINResponse {
  answer: string;
  error?: string;
}

export async function askAIN(
  question: string,
  vehicleContext?: VehicleContext,
  chatHistory?: Array<{ role: string; content: string }>
): Promise<AINResponse> {
  try {
    console.log('🤖 Sending request to AIN:', { question, hasContext: !!vehicleContext });
    
    const userContext: AssistantContext = {
      isPremium: true, // TODO: Get from user context
      hasDealerAccess: false, // TODO: Get from user context
      vehicleContext,
    };

    const request: AskAIRequest = {
      question,
      userContext,
      chatHistory,
      systemPrompt: `You are AIN — Auto Intelligence Network™, a GPT-4o-powered vehicle valuation assistant built by Car Detective. 

Your role is to help users understand car valuations, market trends, and vehicle insights with confidence and expertise.

Key capabilities:
- Vehicle valuation analysis and explanations
- Market trend insights and forecasting
- Accident impact assessment
- Dealer vs private party pricing guidance
- Regional market variations
- CARFAX® report interpretation

Response style:
- Be conversational but authoritative
- Provide specific, actionable insights
- Use data-driven explanations when possible
- Be helpful and educational
- Ask clarifying questions when needed

${vehicleContext ? `Current vehicle context: ${JSON.stringify(vehicleContext)}` : 'No specific vehicle context provided'}

Always aim to provide valuable, accurate information that helps users make informed decisions about their vehicles.`
    };

    const { data, error } = await supabase.functions.invoke('ask-ai', {
      body: request
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
