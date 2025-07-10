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
    const { query, model = "gpt-4.1-2025-04-14", max_tokens = 2000 } = await req.json();

    if (!query) {
      throw new Error('Query parameter is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('🔍 OpenAI Web Search request:', { query, model });

    // Use OpenAI with web search capabilities
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: `You are a web search assistant that finds real vehicle listings and prices. Search for the requested vehicle and return detailed price information from multiple sources like AutoTrader, Cars.com, CarGurus, CarMax, etc. Include specific prices, mileage, and dealer information when available.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens,
        temperature: 0.1,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    console.log('✅ OpenAI web search completed');

    return new Response(
      JSON.stringify({ 
        success: true, 
        content,
        usage: data.usage 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ OpenAI web search error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});