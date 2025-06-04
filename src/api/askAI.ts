<<<<<<< HEAD

import { AskAIRequest, AskAIResponse, ChatMessage } from '@/types/assistant';
=======
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getValuationContext } from "@/utils/getValuationContext";
import { ValuationResult } from "@/types/valuation";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: number;
}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

const SUPABASE_URL = 'https://xltxqqzattxogxtqrggt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY';

<<<<<<< HEAD
export const askAI = async (request: AskAIRequest): Promise<AskAIResponse> => {
  try {
    console.log('🤖 Sending AI request:', { 
      question: request.question.substring(0, 50) + '...', 
      hasContext: !!request.userContext
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

=======
export async function askAI(
  { question, userContext, chatHistory, valuationId }: AskAIParams,
): Promise<{
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
            isPremium: valuation.premium_unlocked,
          },
        };
      }
    }

    // Prepare the system prompt with enhanced context
    const systemPrompt =
      `You are AIN — Auto Intelligence Network™, a GPT-4-powered vehicle valuation assistant built by Car Detective. Your job is to assist users with car valuations, market trends, premium report benefits, dealer offers, and CARFAX® insights. 

Use the user's context (make, model, year, mileage, condition, ZIP, premium status, dealer role) to give smart, helpful answers. Always respond in a confident, conversational tone.

Never guess. If info is missing (e.g., no valuation), ask for it clearly.

Your goal: help individuals sell smarter and help dealers make profitable decisions with speed and trust.
${
        enhancedContext && Object.keys(enhancedContext).length > 0
          ? `\nUser context: ${JSON.stringify(enhancedContext, null, 2)}`
          : ""
      }`;

    // First try using Supabase Function if available
    try {
      const { data, error } = await supabase.functions.invoke("ask-ai", {
        body: {
          question,
          userContext: enhancedContext,
          systemPrompt,
          chatHistory: chatHistory?.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        },
      });

      if (!error && data?.answer) {
        return { answer: data.answer };
      }

      // If Supabase function failed, we'll try the regular API endpoint as fallback
      console.warn(
        "Supabase function failed, falling back to regular endpoint",
        error,
      );
    } catch (e) {
      console.warn("Supabase not configured, using regular endpoint");
    }

    // Regular API endpoint as fallback
    const response = await fetch("/api/ask-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        userContext: enhancedContext,
        systemPrompt,
        chatHistory,
      }),
    });

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI service error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
<<<<<<< HEAD
    console.log('🤖 AI response received:', { answerLength: data.answer?.length });
    
    return data;
  } catch (error) {
    console.error('❌ AI request failed:', error);
    throw new Error('Unable to connect to AI assistant. Please try again.');
=======
    return { answer: data.answer };
  } catch (error: any) {
    console.error("AI assistant error:", error);
    return { error: error.message || "Failed to get AI response" };
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  }
};

// Legacy support for existing components
export const askAIN = async (messages: ChatMessage[]) => {
  try {
    const lastMessage = messages[messages.length - 1];
    const question = lastMessage?.content || '';
    
    const response = await askAI({
      question,
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

    return { reply: response.answer };
  } catch (error: any) {
    console.error('AIN API error:', error.message);
    throw error;
  }
};
