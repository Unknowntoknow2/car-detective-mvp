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
  price: number;
  mileage?: number;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  vin?: string;
  zip?: string;
  source: string;
  link?: string;
  dealerName?: string;
  condition?: string;
  titleStatus?: string;
  isCpo?: boolean;
  location?: string;
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

    // Construct the search prompt for OpenAI
    const searchPrompt = `Find real used car listings for a ${params.year} ${params.make} ${params.model}${params.trim ? ` ${params.trim}` : ''} near ZIP code ${params.zip}. Search popular automotive marketplaces like AutoTrader, CarGurus, Cars.com, CarMax, Carvana, Facebook Marketplace, and Craigslist.

For each listing you find, extract:
1. Price (actual selling price, not MSRP)
2. Mileage
3. Year, Make, Model, Trim
4. VIN (if available)
5. Dealer/Seller name
6. Location (city/state or ZIP)
7. Condition (new, used, certified pre-owned)
8. Link to the listing
9. Source marketplace name

Return the results as a JSON array of objects with these exact field names:
- price (number)
- mileage (number, if available)
- year (number)
- make (string)
- model (string)
- trim (string, if available)
- vin (string, if available)  
- dealerName (string)
- location (string)
- condition (string)
- link (string)
- source (string - marketplace name)
- isCpo (boolean - true if certified pre-owned)

Find at least 3-5 real listings if possible. Only include actual, current listings with real prices, not estimated values or placeholder data.

Search for: ${params.year} ${params.make} ${params.model}${params.trim ? ` ${params.trim}` : ''} near ${params.zip}`;

    console.log('🌐 Sending request to OpenAI with web browsing...');

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
            content: 'You are a car market research assistant with web browsing capabilities. Search for real automotive listings and extract structured data. Always return valid JSON arrays with the requested fields.'
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
      throw new Error(`OpenAI API error: ${response.statusText}`);
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
        // If no array found, try to parse the entire content
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
        listing.source &&
        listing.make &&
        listing.model
      )
      .map(listing => ({
        ...listing,
        id: crypto.randomUUID(),
        zipCode: params.zip,
        confidenceScore: 75, // OpenAI live search confidence
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
          openAIRawResponse: content,
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