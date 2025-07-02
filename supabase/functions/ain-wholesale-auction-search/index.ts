import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface VehicleParams {
  year: number;
  make: string;
  model: string;
  trim?: string;
  zip: string;
  mileage: number;
  vin: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: VehicleParams = await req.json();
    console.log('🏛️ AIN Wholesale/Auction Search starting:', params);

    const searchQuery = `${params.year} ${params.make} ${params.model} ${params.trim || ''} auction sale price wholesale`;
    const auctionSources = [
      { name: 'Manheim', url: 'https://www.manheim.com/', searchTerm: `site:manheim.com ${searchQuery}` },
      { name: 'ADESA', url: 'https://www.adesa.com/', searchTerm: `site:adesa.com ${searchQuery}` },
      { name: 'Copart', url: 'https://www.copart.com/', searchTerm: `site:copart.com ${searchQuery}` },
      { name: 'IAAI', url: 'https://www.iaai.com/', searchTerm: `site:iaai.com ${searchQuery}` },
      { name: 'BacklotCars', url: 'https://www.backlotcars.com/', searchTerm: `site:backlotcars.com ${searchQuery}` },
      { name: 'ACV Auctions', url: 'https://www.acvauctions.com/', searchTerm: `site:acvauctions.com ${searchQuery}` }
    ];

    const auctionComps = [];
    let totalSearches = 0;

    for (const source of auctionSources) {
      try {
        console.log(`🔍 Searching ${source.name}:`, source.searchTerm);
        
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
                content: `You are an expert automotive data extraction specialist. Extract auction and wholesale vehicle pricing data from search results with extreme precision. Focus on actual sale prices, not asking prices.`
              },
              {
                role: 'user',
                content: `Search for auction and wholesale sale data for: ${params.year} ${params.make} ${params.model} ${params.trim || ''} with VIN ${params.vin} or similar vehicles.

EXTRACT DATA IN THIS EXACT FORMAT:
- Price: [actual sale price in USD]
- VIN: [if available]
- Mileage: [odometer reading]
- Sale Date: [when sold]
- Auction/Lot: [auction house name]
- Condition: [vehicle condition grade]
- Location: [sale location]
- Source URL: [direct link to listing]
- Notes: [relevant details]

Search query: "${source.searchTerm}"

Return structured JSON with array of comps found. If no specific matches, return related vehicles of same year/make/model.`
              }
            ],
            temperature: 0.1,
            max_tokens: 2000
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const extractedData = data.choices[0]?.message?.content;
          
          try {
            const parsedComps = JSON.parse(extractedData);
            if (Array.isArray(parsedComps)) {
              parsedComps.forEach(comp => {
                auctionComps.push({
                  ...comp,
                  source_name: source.name,
                  source_url: source.url,
                  search_query: source.searchTerm,
                  fetch_timestamp: new Date().toISOString(),
                  explanation: `${source.name} wholesale/auction comp for ${params.year} ${params.make} ${params.model}`
                });
              });
            }
          } catch (parseError) {
            console.error(`Parse error for ${source.name}:`, parseError);
            // Store raw response for manual review
            auctionComps.push({
              source_name: source.name,
              raw_response: extractedData,
              search_query: source.searchTerm,
              fetch_timestamp: new Date().toISOString(),
              explanation: `Raw response from ${source.name} - requires manual parsing`
            });
          }
        }
        
        totalSearches++;
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error searching ${source.name}:`, error);
        auctionComps.push({
          source_name: source.name,
          error: error.message,
          search_query: source.searchTerm,
          fetch_timestamp: new Date().toISOString()
        });
      }
    }

    // Store results in vehicle_comparisons table
    const validComps = auctionComps.filter(comp => comp.price && !comp.error);
    if (validComps.length > 0) {
      const { error } = await supabase
        .from('vehicle_comparisons')
        .insert(validComps.map(comp => ({
          vin: params.vin,
          year: params.year,
          make: params.make,
          model: params.model,
          trim: params.trim,
          price: parseFloat(comp.price?.toString().replace(/[^\d.]/g, '') || '0'),
          mileage: parseInt(comp.mileage?.toString().replace(/[^\d]/g, '') || '0'),
          location: comp.location,
          dealer_name: comp.auction_lot || comp.source_name,
          source_name: comp.source_name,
          source_type: 'auction_wholesale',
          listing_url: comp.source_url || '#',
          vehicle_condition: comp.condition,
          listing_date: comp.sale_date,
          explanation: comp.explanation,
          confidence_score: 85
        })));

      if (error) {
        console.error('Error storing auction comps:', error);
      }
    }

    // Calculate summary statistics
    const prices = validComps.map(comp => parseFloat(comp.price?.toString().replace(/[^\d.]/g, '') || '0')).filter(p => p > 0);
    const summary = prices.length > 0 ? {
      low: Math.min(...prices),
      median: prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)],
      high: Math.max(...prices),
      average: prices.reduce((a, b) => a + b, 0) / prices.length,
      count: prices.length
    } : null;

    return new Response(JSON.stringify({
      success: true,
      protocol: 'AIN Wholesale/Auction Search',
      vehicle_params: params,
      total_searches: totalSearches,
      comps_found: validComps.length,
      raw_comps: auctionComps,
      valid_comps: validComps,
      price_summary: summary,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ AIN Wholesale/Auction Search error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      protocol: 'AIN Wholesale/Auction Search'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});