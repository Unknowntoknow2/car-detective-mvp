
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, vinContext, chatHistory } = await req.json();
    
    if (!message || typeof message !== 'string') {
      console.error('Invalid message:', message);
      return new Response(
        JSON.stringify({ error: 'Message is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get OpenAI API key from environment variable
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      console.error("Missing OpenAI API key");
      return new Response(
        JSON.stringify({ error: "AI service configuration error. Please contact support." }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing AIN request:', { 
      message: message.substring(0, 50) + '...', 
      hasVinContext: !!vinContext,
      hasHistory: !!(chatHistory && chatHistory.length > 0)
    });

    // Prepare system prompt with vehicle context
    let systemPrompt = `You are AIN — Auto Intelligence Network™, a GPT-4o-powered vehicle valuation assistant built by Car Detective. 

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

Always aim to provide valuable, accurate information that helps users make informed decisions about their vehicles.`;

    if (vinContext) {
      systemPrompt += `\n\nCurrent vehicle context: ${JSON.stringify(vinContext)}`;
    }

    // Prepare messages array for OpenAI
    const messages = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ];

    // Add chat history for context if available
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach(msg => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        }
      });
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    console.log('Sending request to OpenAI with', messages.length, 'messages');

    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 800,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      
      // Handle specific OpenAI errors
      if (error.error?.code === 'invalid_api_key') {
        return new Response(
          JSON.stringify({ error: 'AI service authentication failed. Please contact support.' }), 
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else if (error.error?.code === 'rate_limit_exceeded') {
        return new Response(
          JSON.stringify({ error: 'AI service is busy. Please try again in a moment.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({ error: 'AI service temporarily unavailable. Please try again.' }), 
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const responseData = await response.json();
    const answer = responseData.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';

    console.log('AI response generated successfully, length:', answer.length);

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing AIN request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
