import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { make, model, year, trim, mileage, condition, zip } = await req.json();
    console.log('🔍 Searching market listings for:', { make, model, year, trim, mileage, condition, zip });

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('❌ OpenAI API key not found');
      return new Response(JSON.stringify({ 
        listings: [], 
        error: 'OpenAI API key not configured' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create search query and cache key
    const searchQuery = `${year} ${make} ${model} ${trim || ''}`.trim();
    const cacheKey = `${searchQuery}_${zip || 'any'}_${mileage || 'any'}_${condition || 'any'}`;

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check cache first
    const { data: cachedResult } = await supabase
      .from('market_search_cache')
      .select('results')
      .eq('search_query', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (cachedResult) {
      console.log('✅ Found cached results for:', searchQuery);
      return new Response(JSON.stringify({ 
        listings: cachedResult.results,
        cached: true 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare OpenAI prompt for market search
    const prompt = `You are a car market analyst. Find real vehicle listings that match these criteria:

Vehicle: ${searchQuery}
Mileage: Around ${mileage || 'any'} miles
Condition: ${condition || 'used'}
Location: Near ${zip || 'any location'}

Search actual car listing platforms like:
- AutoTrader.com
- Cars.com
- CarGurus.com
- CarMax.com
- Carvana.com
- Local dealer websites
- Facebook Marketplace
- Craigslist

Return ONLY a JSON array of up to 8 real listings with this exact structure:
[
  {
    "year": 2013,
    "make": "Toyota",
    "model": "Sienna",
    "trim": "XLE",
    "price": 18500,
    "mileage": 115000,
    "condition": "good",
    "location": "Los Angeles, CA",
    "source": "AutoTrader",
    "link": "https://www.autotrader.com/cars-for-sale/...",
    "photos": ["https://example.com/photo1.jpg"]
  }
]

IMPORTANT: Only return actual, real listings with working URLs. Do not fabricate data.`;

    console.log('🤖 Calling OpenAI with prompt for:', searchQuery);

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a vehicle market analyst that finds real car listings. Return only valid JSON arrays of actual vehicle listings.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse the JSON response
    let listings = [];
    try {
      // Clean the response to extract JSON
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        listings = JSON.parse(jsonMatch[0]);
      } else {
        console.log('⚠️ No JSON array found in OpenAI response');
        listings = [];
      }
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response:', parseError);
      console.log('Raw content:', content);
      listings = [];
    }

    console.log(`✅ Found ${listings.length} listings from OpenAI`);

    // Cache the results
    if (listings.length > 0) {
      await supabase
        .from('market_search_cache')
        .insert({
          search_query: cacheKey,
          search_params: {
            make,
            model,
            year,
            trim,
            mileage,
            condition,
            zip
          },
          results: listings
        });
    }

    return new Response(JSON.stringify({ 
      listings,
      searchQuery,
      cached: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in search-market-listings function:', error);
    return new Response(JSON.stringify({ 
      listings: [], 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});