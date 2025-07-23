
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketSearchParams {
  make: string;
  model: string;
  year: number;
  trim?: string;
  zip: string;
  mileage?: number;
  radius?: number;
}

interface MarketListing {
  id: string;
  source: string;
  price: number;
  mileage?: number;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  vin?: string;
  dealerName?: string;
  location?: string;
  condition?: string;
  link?: string;
  isCpo?: boolean;
  confidenceScore?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const params: MarketSearchParams = await req.json();
    console.log('🔍 OpenAI Market Search Request:', params);

    // Enhanced Google-style search prompt for real-time listings
    const searchPrompt = `You are a listings intelligence agent. Your task is to search the web for *at least 20 real-time used car listings* matching the following:

- Make/Model: ${params.make} ${params.model}${params.trim ? ` ${params.trim}` : ''}
- Year: ${params.year}
- Max mileage: ${params.mileage ? `under ${params.mileage.toLocaleString()} miles` : 'under 125,000 miles'}
- Zip code: ${params.zip}
- Radius: within ${params.radius || 100} miles

Your goal is to return listings like Google does — with photos, prices, dealer names, location, and direct URLs to the listing page.

Use sites such as:
- cars.com
- autotrader.com
- carfax.com
- ebay.com
- cargurus.com
- craigslist.org
- facebook marketplace
- carmax.com
- carvana.com

Return the result as a JSON array with each item containing:
{
  "id": "unique-listing-id",
  "title": "2010 Nissan Altima Hybrid",
  "price": 7998,
  "mileage": 104000,
  "year": 2010,
  "make": "Nissan",
  "model": "Altima",
  "trim": "Hybrid",
  "location": "Sacramento, CA",
  "dealerName": "Premier Nissan",
  "link": "https://www.autotrader.com/cars-for-sale/vehicledetail...",
  "imageUrl": "https://cdn.example.com/car.jpg",
  "source": "autotrader.com",
  "condition": "used",
  "vin": "1N4AL2AP0BN123456",
  "isCpo": false,
  "confidenceScore": 95
}

Make sure the listings are real and current. Do NOT fabricate data. Use real data extracted from the sites. Return only the JSON array, no explanations.`;

    console.log('🌐 Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a car market research assistant. Search for real automotive listings and extract structured data. Always return valid JSON arrays with the requested fields. Focus on finding actual current listings with real prices and dealer information.'
          },
          {
            role: 'user',
            content: searchPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('📄 OpenAI Raw Response:', content);

    // Try to parse the JSON response
    let listings: MarketListing[] = [];
    try {
      // Look for JSON array in the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        listings = JSON.parse(jsonMatch[0]);
      } else {
        // Try to parse the entire content
        listings = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response as JSON:', parseError);
      console.log('Raw content:', content);
      
      // Return empty array if parsing fails
      listings = [];
    }

    // Validate and enhance the listings
    const validatedListings = listings
      .filter(listing => 
        listing.price && 
        listing.price > 1000 && 
        listing.price < 200000 &&
        listing.source
      )
      .map(listing => ({
        ...listing,
        id: listing.id || crypto.randomUUID(),
        zipCode: params.zip,
        confidenceScore: listing.confidenceScore || 75,
        fetchedAt: new Date().toISOString(),
        sourceType: 'live'
      }));

    console.log('✅ Validated OpenAI Market Listings:', {
      totalFound: listings.length,
      validListings: validatedListings.length,
      sources: [...new Set(validatedListings.map(l => l.source))],
      priceRange: validatedListings.length > 0 ? {
        min: Math.min(...validatedListings.map(l => l.price)),
        max: Math.max(...validatedListings.map(l => l.price)),
        avg: Math.round(validatedListings.reduce((sum, l) => sum + l.price, 0) / validatedListings.length)
      } : null
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: validatedListings,
        meta: {
          searchParams: params,
          totalFound: listings.length,
          validatedCount: validatedListings.length,
          sources: [...new Set(validatedListings.map(l => l.source))],
          confidence: validatedListings.length >= 3 ? 80 : validatedListings.length >= 1 ? 65 : 40
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ OpenAI Market Search Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        data: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
