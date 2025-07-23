import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LiveSearchRequest {
  make: string;
  model: string;
  year: number;
  zipCode?: string;
  maxResults?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { make, model, year, zipCode, maxResults = 5 }: LiveSearchRequest = await req.json();

    const searchPrompt = `Find current vehicle listings for ${year} ${make} ${model}${zipCode ? ` near ${zipCode}` : ''} from major automotive websites like CarGurus, Cars.com, AutoTrader, Craigslist, EchoPark. 

Extract and return ONLY valid listings in this JSON format:
[
  {
    "year": ${year},
    "make": "${make}",
    "model": "${model}",
    "trim": "trim_if_available",
    "mileage": actual_number,
    "price": actual_price_number,
    "link": "full_url",
    "source": "site_name",
    "location": "city_state",
    "fetchedAt": "${new Date().toISOString()}"
  }
]

Requirements:
- Only include listings with valid price, mileage, and working links
- Skip listings over 30 days old
- Return maximum ${maxResults} best matches
- Verify listings are actual vehicle sales (not parts/services)`;

    console.log('🔍 Live Market Search:', { make, model, year, zipCode });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: 'You are a vehicle listing search expert. Search for current vehicle listings and return structured JSON data. Only return valid, current listings with complete information.' 
          },
          { role: 'user', content: searchPrompt }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('🤖 OpenAI Response:', content);

    // Parse the JSON response
    let listings = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        listings = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response as JSON:', parseError);
      listings = [];
    }

    // Validate and filter listings
    const validListings = listings.filter((listing: any) => 
      listing.price && 
      listing.link && 
      listing.year && 
      listing.make && 
      listing.model &&
      listing.mileage !== undefined
    ).map((listing: any) => ({
      ...listing,
      sourceType: 'live',
      fetchedAt: new Date().toISOString()
    }));

    console.log(`✅ Found ${validListings.length} valid live listings`);

    return new Response(JSON.stringify({ 
      listings: validListings,
      source: 'live_search',
      searchPerformed: true,
      totalFound: validListings.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in live-market-search:', error);
    return new Response(JSON.stringify({ 
      listings: [],
      source: 'error',
      searchPerformed: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});