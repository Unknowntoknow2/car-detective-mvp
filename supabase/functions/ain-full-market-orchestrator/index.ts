import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface OrchestrationRequest {
  request_id: string;
  vehicle_params: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    mileage?: number;
    zip_code?: string;
    condition?: string;
  };
  sources?: string[];
}

interface MarketSource {
  name: string;
  type: string;
  searchPattern: string;
  priority: number;
}

// Comprehensive source configuration
const MARKET_SOURCES: MarketSource[] = [
  // Marketplaces (Priority 1)
  { name: 'Cars.com', type: 'marketplace', searchPattern: 'site:cars.com', priority: 1 },
  { name: 'AutoTrader', type: 'marketplace', searchPattern: 'site:autotrader.com', priority: 1 },
  { name: 'CarGurus', type: 'marketplace', searchPattern: 'site:cargurus.com', priority: 1 },
  { name: 'Edmunds', type: 'marketplace', searchPattern: 'site:edmunds.com', priority: 1 },
  { name: 'TrueCar', type: 'marketplace', searchPattern: 'site:truecar.com', priority: 1 },
  
  // Big Box Retailers (Priority 2)
  { name: 'CarMax', type: 'big_box', searchPattern: 'site:carmax.com', priority: 2 },
  { name: 'Carvana', type: 'big_box', searchPattern: 'site:carvana.com', priority: 2 },
  { name: 'Vroom', type: 'big_box', searchPattern: 'site:vroom.com', priority: 2 },
  { name: 'EchoPark', type: 'big_box', searchPattern: 'site:echopark.com', priority: 2 },
  { name: 'Shift', type: 'big_box', searchPattern: 'site:shift.com', priority: 2 },
  
  // Major Dealer Groups (Priority 3)
  { name: 'AutoNation', type: 'franchise_dealer', searchPattern: 'site:autonation.com', priority: 3 },
  { name: 'Lithia Motors', type: 'franchise_dealer', searchPattern: 'site:lithiamotors.com OR site:lithia.com', priority: 3 },
  { name: 'Sonic Automotive', type: 'franchise_dealer', searchPattern: 'site:sonicautomotive.com', priority: 3 },
  { name: 'Group 1 Automotive', type: 'franchise_dealer', searchPattern: 'site:group1auto.com', priority: 3 },
  
  // Auction Data (Priority 4)
  { name: 'Manheim', type: 'auction', searchPattern: 'site:manheim.com', priority: 4 },
  { name: 'Adesa', type: 'auction', searchPattern: 'site:adesa.com', priority: 4 },
  { name: 'ACV Auctions', type: 'auction', searchPattern: 'site:acvauctions.com', priority: 4 },
  
  // Book Values (Priority 5)
  { name: 'KBB', type: 'book_value', searchPattern: 'site:kbb.com', priority: 5 },
  { name: 'Black Book', type: 'book_value', searchPattern: 'site:blackbook.com', priority: 5 },
  { name: 'NADA Guides', type: 'book_value', searchPattern: 'site:nadaguides.com', priority: 5 }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 AIN Full Market Orchestrator starting...');
    
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not configured');
      return new Response(JSON.stringify({
        success: false,
        error: 'OpenAI API key not configured'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { request_id, vehicle_params, sources }: OrchestrationRequest = await req.json();
    const startTime = Date.now();

    console.log('🎯 Processing request:', { request_id, vehicle_params });

    // Update request status
    await supabase
      .from('valuation_requests')
      .update({ status: 'in_progress' })
      .eq('id', request_id);

    // Log orchestration start
    await supabase
      .from('valuation_audit_logs')
      .insert({
        valuation_request_id: request_id,
        action: 'orchestration_start',
        message: `Starting full market orchestration for ${vehicle_params.year} ${vehicle_params.make} ${vehicle_params.model}`,
        input_data: { vehicle_params, sources }
      });

    // Filter sources if specified
    const targetSources = sources && sources.length > 0 
      ? MARKET_SOURCES.filter(s => sources.includes(s.name))
      : MARKET_SOURCES;

    console.log(`📊 Processing ${targetSources.length} sources`);

    const allComps: any[] = [];
    const sourceResults: Record<string, any> = {};

    // Process sources in parallel by priority groups
    const priorityGroups = targetSources.reduce((groups, source) => {
      if (!groups[source.priority]) groups[source.priority] = [];
      groups[source.priority].push(source);
      return groups;
    }, {} as Record<number, MarketSource[]>);

    for (const [priority, sources] of Object.entries(priorityGroups)) {
      console.log(`🔍 Processing priority ${priority} sources: ${sources.map(s => s.name).join(', ')}`);
      
      const priorityPromises = sources.map(async (source) => {
        try {
          const sourceComps = await fetchFromSource(source, vehicle_params, request_id);
          sourceResults[source.name] = {
            count: sourceComps.length,
            success: true,
            comps: sourceComps
          };
          allComps.push(...sourceComps);
          return sourceComps;
        } catch (error) {
          console.error(`❌ Error fetching from ${source.name}:`, error);
          sourceResults[source.name] = {
            count: 0,
            success: false,
            error: error.message
          };
          return [];
        }
      });

      await Promise.all(priorityPromises);
    }

    // Normalize and save all comps to BOTH tables for compatibility
    const normalizedComps = allComps.map(comp => normalizeCompData(comp, request_id));
    const marketListings = allComps.map(comp => normalizeToMarketListings(comp, request_id, vehicle_params));
    
    if (normalizedComps.length > 0) {
      // Save to market_comps (new table)
      const { error: insertError } = await supabase
        .from('market_comps')
        .insert(normalizedComps);

      if (insertError) {
        console.error('❌ Error saving comps:', insertError);
      } else {
        console.log(`✅ Saved ${normalizedComps.length} comps to market_comps`);
      }

      // Save to market_listings (legacy compatibility)
      const { error: listingsError } = await supabase
        .from('market_listings')
        .insert(marketListings);

      if (listingsError) {
        console.error('❌ Error saving to market_listings:', listingsError);
      } else {
        console.log(`✅ Saved ${marketListings.length} listings to market_listings`);
      }
    }

    // Calculate comp summary
    const compSummary = calculateCompSummary(normalizedComps);
    
    // Save valuation result
    const { error: resultError } = await supabase
      .from('valuation_results')
      .upsert({
        valuation_request_id: request_id,
        estimated_value: compSummary.median_price,
        confidence_score: compSummary.confidence_score,
        price_range_low: compSummary.price_range.min,
        price_range_high: compSummary.price_range.max,
        comp_summary: compSummary,
        source_breakdown: sourceResults,
        methodology: {
          total_sources: targetSources.length,
          total_comps: normalizedComps.length,
          aggregation_method: 'openai_web_search',
          timestamp: new Date().toISOString()
        }
      });

    if (resultError) {
      console.error('❌ Error saving result:', resultError);
    }

    // Update request with final status
    await supabase
      .from('valuation_requests')
      .update({ 
        status: 'completed',
        comp_count: normalizedComps.length
      })
      .eq('id', request_id);

    const executionTime = Date.now() - startTime;

    // Log completion
    await supabase
      .from('valuation_audit_logs')
      .insert({
        valuation_request_id: request_id,
        action: 'orchestration_complete',
        message: `Orchestration completed: ${normalizedComps.length} comps from ${Object.keys(sourceResults).length} sources`,
        output_data: {
          total_comps: normalizedComps.length,
          source_results: sourceResults,
          comp_summary: compSummary
        },
        execution_time_ms: executionTime
      });

    console.log(`✅ Orchestration completed in ${executionTime}ms`);

    return new Response(JSON.stringify({
      success: true,
      request_id,
      total_comps: normalizedComps.length,
      sources_processed: Object.keys(sourceResults).length,
      comp_summary: compSummary,
      source_results: sourceResults,
      execution_time_ms: executionTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Orchestration error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      api: 'ain-full-market-orchestrator'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchFromSource(
  source: MarketSource, 
  vehicleParams: any, 
  requestId: string
): Promise<any[]> {
  const searchQuery = buildSearchQuery(source, vehicleParams);
  
  console.log(`🔍 Searching ${source.name}: ${searchQuery}`);

  try {
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
            content: `You are a vehicle market data aggregator. Search the web for vehicle listings and return structured data in JSON format. Always return at least 5 comparable listings if available.`
          },
          {
            role: 'user',
            content: searchQuery
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    const parsedData = JSON.parse(content);
    const listings = parsedData.listings || parsedData.comps || parsedData.vehicles || [];

    console.log(`✅ ${source.name}: Found ${listings.length} listings`);

    return listings.map((listing: any) => ({
      ...listing,
      source: source.name,
      source_type: source.type,
      fetched_at: new Date().toISOString()
    }));

  } catch (error) {
    console.error(`❌ Error fetching from ${source.name}:`, error);
    
    // Log the error
    await supabase
      .from('valuation_audit_logs')
      .insert({
        valuation_request_id: requestId,
        action: 'source_fetch_error',
        message: `Failed to fetch from ${source.name}: ${error.message}`,
        input_data: { source: source.name, search_query: searchQuery },
        error_message: error.message
      });

    return [];
  }
}

function buildSearchQuery(source: MarketSource, vehicleParams: any): string {
  const { year, make, model, trim, zip_code, mileage } = vehicleParams;
  
  let query = `Search ${source.searchPattern} for listings of ${year} ${make} ${model}`;
  
  if (trim) {
    query += ` ${trim}`;
  }
  
  if (zip_code) {
    query += ` near ${zip_code}`;
  }
  
  query += `. Return JSON with "listings" array containing: {
    "vin": "string",
    "price": number,
    "mileage": number,
    "dealer_name": "string",
    "location": "string",
    "listing_url": "string",
    "condition": "string",
    "is_cpo": boolean,
    "features": ["array"],
    "incentives": "string",
    "date_listed": "string"
  }. Include at least 5 comparable vehicles if available.`;

  return query;
}

function normalizeCompData(comp: any, requestId: string): any {
  return {
    valuation_request_id: requestId,
    source: comp.source,
    source_type: comp.source_type,
    vin: comp.vin || null,
    year: comp.year || null,
    make: comp.make || null,
    model: comp.model || null,
    trim: comp.trim || null,
    price: parseFloat(comp.price) || 0,
    mileage: comp.mileage ? parseInt(comp.mileage) : null,
    condition: comp.condition || 'used',
    dealer_name: comp.dealer_name || comp.dealer || null,
    location: comp.location || null,
    listing_url: comp.listing_url || comp.url || '#',
    is_cpo: comp.is_cpo || comp.cpo || false,
    incentives: comp.incentives || null,
    features: comp.features || {},
    confidence_score: calculateConfidenceScore(comp),
    raw_data: comp
  };
}

function calculateConfidenceScore(comp: any): number {
  let score = 85; // Base score
  
  // Adjust based on data completeness
  if (comp.vin) score += 10;
  if (comp.mileage) score += 5;
  if (comp.dealer_name) score += 3;
  if (comp.features && comp.features.length > 0) score += 2;
  
  return Math.min(100, score);
}

function calculateCompSummary(comps: any[]): any {
  if (comps.length === 0) {
    return {
      total_comps: 0,
      median_price: 0,
      mean_price: 0,
      price_range: { min: 0, max: 0 },
      confidence_score: 0,
      source_distribution: {}
    };
  }

  const prices = comps.map(c => c.price).filter(p => p > 0).sort((a, b) => a - b);
  const median = prices[Math.floor(prices.length / 2)];
  const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;

  const sourceDistribution = comps.reduce((dist, comp) => {
    const source = comp.source;
    if (!dist[source]) dist[source] = { count: 0, avg_price: 0 };
    dist[source].count++;
    return dist;
  }, {});

  // Calculate average price per source
  Object.keys(sourceDistribution).forEach(source => {
    const sourceComps = comps.filter(c => c.source === source);
    const sourcePrices = sourceComps.map(c => c.price).filter(p => p > 0);
    sourceDistribution[source].avg_price = sourcePrices.length > 0 
      ? sourcePrices.reduce((sum, p) => sum + p, 0) / sourcePrices.length 
      : 0;
  });

  return {
    total_comps: comps.length,
    median_price: median,
    mean_price: mean,
    price_range: {
      min: Math.min(...prices),
      max: Math.max(...prices)
    },
    confidence_score: Math.min(100, Math.max(60, 70 + (comps.length * 2))),
    source_distribution: sourceDistribution,
    price_distribution: {
      q1: prices[Math.floor(prices.length * 0.25)],
      q3: prices[Math.floor(prices.length * 0.75)],
      stddev: calculateStandardDeviation(prices)
    }
  };
}

function calculateStandardDeviation(values: number[]): number {
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

function normalizeToMarketListings(comp: any, requestId: string, vehicleParams: any): any {
  return {
    valuation_request_id: requestId,
    vin: comp.vin || vehicleParams.vin || null,
    source: comp.source,
    source_site: comp.source.toLowerCase().replace(/\s+/g, ''),
    source_type: comp.source_type,
    year: vehicleParams.year,
    make: vehicleParams.make,
    model: vehicleParams.model,
    trim: vehicleParams.trim,
    price: parseFloat(comp.price) || 0,
    mileage: comp.mileage ? parseInt(comp.mileage) : null,
    condition: comp.condition || 'used',
    dealer_name: comp.dealer_name || comp.dealer || null,
    dealer: comp.dealer_name || comp.dealer || null,
    location: comp.location || null,
    listing_url: comp.listing_url || comp.url || '#',
    is_cpo: comp.is_cpo || comp.cpo || false,
    cpo: comp.is_cpo || comp.cpo || false,
    date_listed: comp.date_listed ? new Date(comp.date_listed).toISOString() : null,
    raw_data: comp,
    extra: { notes: comp.notes },
    notes: comp.notes
  };
}