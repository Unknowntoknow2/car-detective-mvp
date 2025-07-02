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

interface AggregateRequest {
  request_id: string;
}

interface MarketSource {
  name: string;
  url: string;
  type: string;
  searchPattern: string;
}

const MARKET_SOURCES: MarketSource[] = [
  // Franchise Dealers
  { name: 'AutoNation', url: 'https://www.autonation.com/inventory', type: 'franchise_dealer', searchPattern: 'site:autonation.com' },
  { name: 'Lithia Motors', url: 'https://www.lithiamotors.com/', type: 'franchise_dealer', searchPattern: 'site:lithiamotors.com OR site:lithia.com' },
  { name: 'Sonic Automotive', url: 'https://www.sonicautomotive.com/', type: 'franchise_dealer', searchPattern: 'site:sonicautomotive.com' },
  { name: 'Group 1 Automotive', url: 'https://www.group1auto.com/', type: 'franchise_dealer', searchPattern: 'site:group1auto.com' },
  
  // Big Box Retailers
  { name: 'CarMax', url: 'https://www.carmax.com/cars', type: 'big_box', searchPattern: 'site:carmax.com' },
  { name: 'Carvana', url: 'https://www.carvana.com/cars', type: 'big_box', searchPattern: 'site:carvana.com' },
  { name: 'Vroom', url: 'https://www.vroom.com/', type: 'big_box', searchPattern: 'site:vroom.com' },
  { name: 'EchoPark', url: 'https://www.echopark.com/', type: 'big_box', searchPattern: 'site:echopark.com' },
  
  // Marketplaces
  { name: 'Cars.com', url: 'https://www.cars.com/', type: 'marketplace', searchPattern: 'site:cars.com' },
  { name: 'AutoTrader', url: 'https://www.autotrader.com/', type: 'marketplace', searchPattern: 'site:autotrader.com' },
  { name: 'CarGurus', url: 'https://www.cargurus.com/', type: 'marketplace', searchPattern: 'site:cargurus.com' },
  
  // Auctions
  { name: 'Manheim', url: 'https://www.manheim.com/', type: 'auction', searchPattern: 'site:manheim.com' },
  { name: 'Copart', url: 'https://www.copart.com/', type: 'auction', searchPattern: 'site:copart.com' },
  
  // Book Values
  { name: 'KBB', url: 'https://www.kbb.com/', type: 'book_value', searchPattern: 'site:kbb.com' },
  { name: 'Edmunds', url: 'https://www.edmunds.com/', type: 'book_value', searchPattern: 'site:edmunds.com' }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 FANG Market Aggregation starting...');
    
    const { request_id }: AggregateRequest = await req.json();
    const startTime = Date.now();

    // Get valuation request details
    const { data: valuationRequest, error: requestError } = await supabase
      .from('valuation_requests')
      .select('*')
      .eq('id', request_id)
      .single();

    if (requestError || !valuationRequest) {
      throw new Error(`Valuation request not found: ${request_id}`);
    }

    console.log(`🎯 Aggregating for: ${valuationRequest.year} ${valuationRequest.make} ${valuationRequest.model}`);

    // Update status to running
    await supabase
      .from('valuation_requests')
      .update({ status: 'running' })
      .eq('id', request_id);

    // Log start of aggregation
    await supabase
      .from('valuation_audit_logs')
      .insert({
        valuation_request_id: request_id,
        event: 'fetch_started',
        input_data: { sources_count: MARKET_SOURCES.length },
        run_by: 'valuation_aggregate_api'
      });

    let totalComps = 0;
    const errors: any[] = [];

    // Process each market source
    for (const source of MARKET_SOURCES) {
      try {
        console.log(`🔍 Searching ${source.name}...`);
        
        const searchQuery = `${valuationRequest.year} ${valuationRequest.make} ${valuationRequest.model} ${valuationRequest.trim || ''} ${valuationRequest.zip_code || ''}`.trim();

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
                content: `You are a precision automotive data extraction specialist. Extract vehicle listings from ${source.name} with complete accuracy. Focus on exact matches for the requested vehicle.`
              },
              {
                role: 'user',
                content: `Search ${source.name} for: ${searchQuery}

Extract vehicle listings in this EXACT JSON format:
[{
  "price": "price in USD (number only)",
  "vin": "VIN if available",
  "mileage": "odometer reading (number only)",
  "condition": "condition description",
  "dealer_name": "dealer/seller name",
  "location": "city, state or ZIP",
  "listing_url": "direct URL to listing",
  "is_cpo": "true/false for certified pre-owned",
  "date_listed": "date when posted",
  "notes": "any relevant details"
}]

Search pattern: "${source.searchPattern} ${searchQuery}"

Return only valid JSON array. Find at least 3-5 listings if available.`
              }
            ],
            temperature: 0.1,
            max_tokens: 2000
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const extractedData = data.choices[0]?.message?.content;
          
          // Store AI snapshot
          await supabase
            .from('ai_market_snapshots')
            .insert({
              valuation_request_id: request_id,
              snapshot_type: 'source_response',
              source: source.name,
              raw_payload: { response: extractedData, query: searchQuery },
              processed_payload: {},
              token_count: data.usage?.total_tokens || 0,
              processing_time_ms: Date.now() - startTime
            });

          try {
            const parsedComps = JSON.parse(extractedData);
            if (Array.isArray(parsedComps)) {
              // Insert each comp into market_listings
              for (const comp of parsedComps) {
                if (comp.price && parseFloat(comp.price.toString().replace(/[^\d.]/g, '')) > 0) {
                  await supabase
                    .from('market_listings')
                    .insert({
                      valuation_request_id: request_id,
                      vin: comp.vin || valuationRequest.vin,
                      source: source.name,
                      source_type: source.type,
                      price: parseFloat(comp.price.toString().replace(/[^\d.]/g, '')),
                      mileage: comp.mileage ? parseInt(comp.mileage.toString().replace(/[^\d]/g, '')) : null,
                      condition: comp.condition,
                      dealer_name: comp.dealer_name,
                      location: comp.location,
                      listing_url: comp.listing_url || source.url,
                      is_cpo: comp.is_cpo === true || comp.is_cpo === 'true',
                      date_listed: comp.date_listed ? new Date(comp.date_listed).toISOString() : null,
                      raw_data: comp,
                      notes: comp.notes
                    });
                  totalComps++;
                }
              }
              console.log(`✅ ${source.name}: Found ${parsedComps.length} comps`);
            }
          } catch (parseError) {
            console.error(`Parse error for ${source.name}:`, parseError);
            errors.push({ source: source.name, error: parseError.message });
          }
        } else {
          console.error(`API error for ${source.name}:`, response.status);
          errors.push({ source: source.name, error: `API error: ${response.status}` });
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing ${source.name}:`, error);
        errors.push({ source: source.name, error: error.message });
      }
    }

    const executionTime = Date.now() - startTime;

    // Update request with results
    await supabase
      .from('valuation_requests')
      .update({ 
        status: 'completed',
        comp_count: totalComps,
        updated_at: new Date().toISOString()
      })
      .eq('id', request_id);

    // Log completion
    await supabase
      .from('valuation_audit_logs')
      .insert({
        valuation_request_id: request_id,
        event: 'fetch_completed',
        output_data: { 
          total_comps: totalComps, 
          sources_processed: MARKET_SOURCES.length,
          errors: errors.length,
          execution_time_ms: executionTime
        },
        execution_time_ms: executionTime,
        run_by: 'valuation_aggregate_api'
      });

    console.log(`✅ Aggregation completed: ${totalComps} comps from ${MARKET_SOURCES.length} sources`);

    return new Response(JSON.stringify({
      success: true,
      request_id,
      comps_found: totalComps,
      sources_processed: MARKET_SOURCES.length,
      errors: errors.length,
      execution_time_ms: executionTime,
      status: 'completed'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Market Aggregation error:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      api: 'valuation-aggregate'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});