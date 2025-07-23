
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

    // Lovable-style automotive market intelligence prompt
    const searchPrompt = `You are an automotive market intelligence agent working inside a vehicle valuation system (AIN). Your job is to search the internet like Google does when a user searches: "${params.year} ${params.make} ${params.model} near ${params.zip} under ${params.mileage || 125000} miles."

🎯 GOAL:
Return **at least 20 real, live listings** for the vehicle described, **just like Google or Cars.com would**, with:
- Direct **listing links**
- Title, mileage, price, image, and dealer/location
- Clean formatting and JSON structure

📌 VEHICLE SEARCH INPUT:
Make: ${params.make}
Model: ${params.model}${params.trim ? `\nTrim: ${params.trim}` : ''}
Year: ${params.year}
ZIP Code: ${params.zip}
Max Mileage: ${params.mileage ? params.mileage.toLocaleString() : '125,000'} miles
Search Radius: ${params.radius || 100} miles

🌐 TARGET SOURCES:
Search these sites (you can use web tools, site search, or scrape listings):
- cars.com
- autotrader.com
- cargurus.com
- craigslist.org
- facebook marketplace
- ebay.com
- carfax.com
- carvana.com

✅ OUTPUT FORMAT (REQUIRED):
Return a **JSON array** of listings with this exact structure:

[
  {
    "id": "unique-listing-id",
    "title": "${params.year} ${params.make} ${params.model}${params.trim ? ` ${params.trim}` : ''}",
    "price": 7998,
    "mileage": 104000,
    "year": ${params.year},
    "make": "${params.make}",
    "model": "${params.model}",
    "trim": "${params.trim || ''}",
    "location": "Sacramento, CA",
    "dealerName": "Premier ${params.make}",
    "link": "https://www.autotrader.com/cars-for-sale/vehicledetail...",
    "listingUrl": "https://www.autotrader.com/cars-for-sale/vehicledetail...",
    "imageUrl": "https://cdn.cars.com/vehicle-image.jpg",
    "source": "autotrader.com",
    "condition": "used",
    "vin": "1N4AL2AP0BN123456",
    "isCpo": false,
    "confidenceScore": 95,
    "zipCode": "${params.zip}",
    "fetchedAt": "${new Date().toISOString()}"
  }
]

Each listing must:
- Be real
- Be from a legitimate site
- Match the year/make/model/mileage/ZIP filter
- Include a real image and clickable link

⚠️ DON'T:
- Don't fabricate listings
- Don't give explanations or HTML
- Don't return anything that's not a real listing with a real link

🎯 YOUR OBJECTIVE:
Mimic the Google "car for sale" result panel — full of real cars, clickable links, photos, and details — all structured in JSON.

Return only the JSON array, no explanations.`;

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
