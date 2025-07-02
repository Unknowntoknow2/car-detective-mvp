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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params = await req.json();
    console.log('🌐 AIN Marketplace/Classifieds Search starting:', params);

    const searchQuery = `${params.year} ${params.make} ${params.model} ${params.trim || ''} ${params.zip} mileage:${params.mileage}`;
    const marketplaceSources = [
      { name: 'Cars.com', url: 'https://www.cars.com/', searchTerm: `site:cars.com ${searchQuery}`, type: 'marketplace_aggregator' },
      { name: 'CarGurus', url: 'https://www.cargurus.com/', searchTerm: `site:cargurus.com ${searchQuery}`, type: 'marketplace_aggregator' },
      { name: 'AutoTrader', url: 'https://www.autotrader.com/', searchTerm: `site:autotrader.com ${searchQuery}`, type: 'marketplace_aggregator' },
      { name: 'TrueCar', url: 'https://www.truecar.com/', searchTerm: `site:truecar.com ${searchQuery}`, type: 'marketplace_aggregator' },
      { name: 'Craigslist', url: 'https://craigslist.org/', searchTerm: `site:craigslist.org ${searchQuery}`, type: 'peer_to_peer' },
      { name: 'Facebook Marketplace', url: 'https://www.facebook.com/marketplace/', searchTerm: `facebook marketplace ${searchQuery}`, type: 'peer_to_peer' },
      { name: 'OfferUp', url: 'https://offerup.com/', searchTerm: `site:offerup.com ${searchQuery}`, type: 'peer_to_peer' },
      { name: 'eBay Motors', url: 'https://www.ebay.com/motors', searchTerm: `site:ebay.com ${searchQuery} motors`, type: 'peer_to_peer' }
    ];

    const marketplaceComps = [];
    let totalSearches = 0;

    for (const source of marketplaceSources) {
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
                content: `You are an expert automotive marketplace data extraction specialist. Extract vehicle listings from ${source.name} with high precision. Distinguish between dealer and private party listings.`
              },
              {
                role: 'user',
                content: `Search for vehicle listings on ${source.name} for: ${params.year} ${params.make} ${params.model} ${params.trim || ''} near ZIP ${params.zip} with approximately ${params.mileage} miles.

EXTRACT DATA IN THIS EXACT FORMAT:
- Price: [asking price in USD]
- VIN: [if available]
- Mileage: [odometer reading]
- Seller: [dealer name or "Private Party"]
- Location: [city, state or ZIP]
- Listing Date: [when posted]
- Condition: [condition description]
- Features: [key features listed]
- Listing URL: [direct link to listing]
- Seller Type: [Dealer or Private Party]
- Notes: [relevant details, title status, etc.]

Search query: "${source.searchTerm}"

Return structured JSON array of at least 5 listings if available. Prioritize exact matches, then similar vehicles. Note any outlier pricing.`
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
                marketplaceComps.push({
                  ...comp,
                  source_name: source.name,
                  source_type: source.type,
                  source_url: source.url,
                  search_query: source.searchTerm,
                  fetch_timestamp: new Date().toISOString(),
                  explanation: `${source.name} listing for ${params.year} ${params.make} ${params.model} - ${comp.seller_type || 'Unknown'} seller`
                });
              });
            }
          } catch (parseError) {
            console.error(`Parse error for ${source.name}:`, parseError);
            marketplaceComps.push({
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
        marketplaceComps.push({
          source_name: source.name,
          error: error.message,
          search_query: source.searchTerm,
          fetch_timestamp: new Date().toISOString()
        });
      }
    }

    // Store results in vehicle_comparisons table
    const validComps = marketplaceComps.filter(comp => comp.price && !comp.error);
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
          dealer_name: comp.seller,
          source_name: comp.source_name,
          source_type: comp.source_type,
          listing_url: comp.listing_url || comp.source_url || '#',
          vehicle_condition: comp.condition,
          listing_date: comp.listing_date,
          explanation: comp.explanation,
          confidence_score: comp.source_type === 'marketplace_aggregator' ? 85 : 75 // Aggregators vs P2P
        })));

      if (error) {
        console.error('Error storing marketplace comps:', error);
      }
    }

    // Analyze by source type
    const aggregatorComps = validComps.filter(comp => comp.source_type === 'marketplace_aggregator');
    const p2pComps = validComps.filter(comp => comp.source_type === 'peer_to_peer');
    
    const aggregatorPrices = aggregatorComps.map(comp => parseFloat(comp.price?.toString().replace(/[^\d.]/g, '') || '0')).filter(p => p > 0);
    const p2pPrices = p2pComps.map(comp => parseFloat(comp.price?.toString().replace(/[^\d.]/g, '') || '0')).filter(p => p > 0);
    const allPrices = [...aggregatorPrices, ...p2pPrices];

    const summary = {
      all: allPrices.length > 0 ? {
        low: Math.min(...allPrices),
        median: allPrices.sort((a, b) => a - b)[Math.floor(allPrices.length / 2)],
        high: Math.max(...allPrices),
        average: allPrices.reduce((a, b) => a + b, 0) / allPrices.length,
        count: allPrices.length
      } : null,
      aggregator: aggregatorPrices.length > 0 ? {
        low: Math.min(...aggregatorPrices),
        median: aggregatorPrices.sort((a, b) => a - b)[Math.floor(aggregatorPrices.length / 2)],
        high: Math.max(...aggregatorPrices),
        average: aggregatorPrices.reduce((a, b) => a + b, 0) / aggregatorPrices.length,
        count: aggregatorPrices.length
      } : null,
      p2p: p2pPrices.length > 0 ? {
        low: Math.min(...p2pPrices),
        median: p2pPrices.sort((a, b) => a - b)[Math.floor(p2pPrices.length / 2)],
        high: Math.max(...p2pPrices),
        average: p2pPrices.reduce((a, b) => a + b, 0) / p2pPrices.length,
        count: p2pPrices.length
      } : null
    };

    return new Response(JSON.stringify({
      success: true,
      protocol: 'AIN Marketplace/Classifieds Search',
      vehicle_params: params,
      total_searches: totalSearches,
      comps_found: validComps.length,
      aggregator_comps: aggregatorComps.length,
      p2p_comps: p2pComps.length,
      raw_comps: marketplaceComps,
      valid_comps: validComps,
      price_summary: summary,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ AIN Marketplace/Classifieds Search error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      protocol: 'AIN Marketplace/Classifieds Search'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});