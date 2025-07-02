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
    console.log('🚗 AIN Franchise Dealer Search starting:', params);

    const searchQuery = `${params.year} ${params.make} ${params.model} ${params.trim || ''} ${params.zip} inventory price`;
    const franchiseGroups = [
      { name: 'AutoNation', url: 'https://www.autonation.com/', searchTerm: `site:autonation.com ${searchQuery}` },
      { name: 'Lithia Motors', url: 'https://www.lithiamotors.com/', searchTerm: `site:lithiamotors.com OR site:lithia.com ${searchQuery}` },
      { name: 'Sonic Automotive', url: 'https://www.sonicautomotive.com/', searchTerm: `site:sonicautomotive.com ${searchQuery}` },
      { name: 'Group 1 Automotive', url: 'https://www.group1auto.com/', searchTerm: `site:group1auto.com ${searchQuery}` },
      { name: 'Penske Automotive', url: 'https://www.penskeautomotive.com/', searchTerm: `site:penskeautomotive.com ${searchQuery}` },
      { name: 'Asbury Automotive', url: 'https://www.asburyauto.com/', searchTerm: `site:asburyauto.com ${searchQuery}` },
      { name: 'Hendrick Automotive', url: 'https://www.hendrickcars.com/', searchTerm: `site:hendrickcars.com ${searchQuery}` }
    ];

    const dealerComps = [];
    let totalSearches = 0;

    for (const dealer of franchiseGroups) {
      try {
        console.log(`🔍 Searching ${dealer.name}:`, dealer.searchTerm);
        
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
                content: `You are an expert automotive retail data extraction specialist. Extract franchise dealer inventory pricing with precision. Focus on current asking prices, not sold prices.`
              },
              {
                role: 'user',
                content: `Search for franchise dealer retail listings for: ${params.year} ${params.make} ${params.model} ${params.trim || ''} near ZIP ${params.zip}.

EXTRACT DATA IN THIS EXACT FORMAT:
- Price: [retail asking price in USD]
- VIN: [if available]
- Mileage: [odometer reading]
- Dealer Name: [specific dealership name and location]
- Date Listed: [when posted]
- CPO Status: [certified pre-owned Y/N]
- Features: [key features/trim details]
- Incentives: [any current rebates or offers]
- Listing URL: [direct link to vehicle page]
- Notes: [relevant details]

Search query: "${dealer.searchTerm}"

Return structured JSON array of listings found. Focus on exact matches first, then similar vehicles.`
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
                dealerComps.push({
                  ...comp,
                  franchise_group: dealer.name,
                  source_url: dealer.url,
                  search_query: dealer.searchTerm,
                  fetch_timestamp: new Date().toISOString(),
                  explanation: `${dealer.name} franchise dealer retail listing for ${params.year} ${params.make} ${params.model}`
                });
              });
            }
          } catch (parseError) {
            console.error(`Parse error for ${dealer.name}:`, parseError);
            dealerComps.push({
              franchise_group: dealer.name,
              raw_response: extractedData,
              search_query: dealer.searchTerm,
              fetch_timestamp: new Date().toISOString(),
              explanation: `Raw response from ${dealer.name} - requires manual parsing`
            });
          }
        }
        
        totalSearches++;
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error searching ${dealer.name}:`, error);
        dealerComps.push({
          franchise_group: dealer.name,
          error: error.message,
          search_query: dealer.searchTerm,
          fetch_timestamp: new Date().toISOString()
        });
      }
    }

    // Store results in vehicle_comparisons table
    const validComps = dealerComps.filter(comp => comp.price && !comp.error);
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
          location: comp.dealer_name,
          dealer_name: comp.dealer_name || comp.franchise_group,
          source_name: comp.franchise_group,
          source_type: 'franchise_mega',
          listing_url: comp.listing_url || comp.source_url || '#',
          cpo_status: comp.cpo_status === 'Y' || comp.cpo_status === true,
          incentives: comp.incentives,
          listing_date: comp.date_listed,
          explanation: comp.explanation,
          confidence_score: 90 // Franchise dealers have high data quality
        })));

      if (error) {
        console.error('Error storing dealer comps:', error);
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
      protocol: 'AIN Franchise Dealer Search',
      vehicle_params: params,
      total_searches: totalSearches,
      comps_found: validComps.length,
      raw_comps: dealerComps,
      valid_comps: validComps,
      price_summary: summary,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ AIN Franchise Dealer Search error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      protocol: 'AIN Franchise Dealer Search'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});