import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, userContext, chatHistory, systemPrompt } = await req.json();
    
    if (!question || typeof question !== 'string') {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get OpenAI API key from environment variable
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      console.error("Missing OpenAI API key");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing AI request:', { 
      question: question.substring(0, 50) + '...', 
      hasContext: !!userContext,
      hasHistory: !!(chatHistory && chatHistory.length > 0),
      apiKeyConfigured: !!apiKey
    });

    // Prepare enhanced system prompt for car valuation assistant
    const enhancedSystemPrompt = systemPrompt || `You are AIN — Auto Intelligence Network™, a GPT-4o-powered vehicle valuation assistant built by Car Detective. Your job is to assist users with car valuations, market trends, premium report benefits, dealer offers, and CARFAX® insights. 

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

CONTEXT AWARENESS:
${userContext ? `User context: ${JSON.stringify(userContext)}` : 'No specific user context provided'}

Your goal: help individuals sell smarter and help dealers make profitable decisions with speed and trust.`;

    // Prepare messages array for OpenAI
    const messages = [
      {
        role: 'system',
        content: systemPrompt || `You are AIN — Auto Intelligence Network™, a GPT-4-powered vehicle valuation assistant built by Car Detective. Your job is to assist users with car valuations, market trends, premium report benefits, dealer offers, and CARFAX® insights. 

Use the user's context (make, model, year, mileage, condition, ZIP, premium status, dealer role) to give smart, helpful answers. Always respond in a confident, conversational tone.

Never guess. If info is missing (e.g., no valuation), ask for it clearly.

Your goal: help individuals sell smarter and help dealers make profitable decisions with speed and trust.
        
${userContext ? `User context: ${JSON.stringify(userContext)}` : ''}`,
      },
    ];

    // Add chat history for context if available
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((msg) => {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({
            role: msg.role,
            content: msg.content,
          });
        }
      });
    }

    // Add current question
    messages.push({
      role: "user",
      content: question,
    });

    console.log('Sending request to OpenAI with', messages.length, 'messages');

    // Make request to OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 800,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return new Response(
        JSON.stringify({ error: 'Failed to get AI response' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const responseData = await response.json();
    const answer = responseData.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error processing AI request:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
