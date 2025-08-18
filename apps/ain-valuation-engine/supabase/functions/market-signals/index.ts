// @ts-ignore Deno std remote import
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
// @ts-ignore Supabase ESM shim
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Types for market data
interface MarketSignalRequest {
  year?: number;
  make?: string;
  model?: string;
  region?: string;
  sources?: string[]; // ['goodcarbadcar', 'isecars', 'google_trends']
  refresh?: boolean;
}

interface MarketSignalData {
  signal_type: string;
  source: string;
  year?: number;
  make?: string;
  model?: string;
  region: string;
  signal_value: number;
  signal_unit: string;
  signal_description: string;
  trend_direction: string;
  trend_strength: number;
  confidence_score: number;
  data_quality_score: number;
  signal_date: string;
  raw_data: any;
}

// Cache for requests
const activeRequests = new Map<string, Promise<MarketSignalData[]>>();

// Simulate GoodCarBadCar sales data API
async function fetchGoodCarBadCarData(params: MarketSignalRequest): Promise<MarketSignalData[]> {
  const { year, make, model, region = 'national' } = params;
  
  console.log(`Fetching GoodCarBadCar sales data for: ${year} ${make} ${model}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 500));
  
  const signals: MarketSignalData[] = [];
  const vehicleKey = `${year}_${make}_${model}`.toUpperCase();
  
  // Realistic sales data patterns
  const salesPatterns: Record<string, any> = {
    '2023_TOYOTA_CAMRY': {
      monthly_sales: 25430,
      yoy_change: 8.5,
      market_share: 2.1,
      segment_rank: 2,
      trend: 'up'
    },
    '2023_HONDA_CIVIC': {
      monthly_sales: 18200,
      yoy_change: -3.2,
      market_share: 1.5,
      segment_rank: 4,
      trend: 'down'
    },
    '2023_FORD_F-150': {
      monthly_sales: 45600,
      yoy_change: 12.3,
      market_share: 3.8,
      segment_rank: 1,
      trend: 'up'
    },
    '2023_CHEVROLET_SILVERADO': {
      monthly_sales: 38900,
      yoy_change: 6.7,
      market_share: 3.2,
      segment_rank: 2,
      trend: 'up'
    },
    '2023_TESLA_MODEL_3': {
      monthly_sales: 22100,
      yoy_change: 25.8,
      market_share: 1.8,
      segment_rank: 1,
      trend: 'up'
    }
  };
  
  const pattern = salesPatterns[vehicleKey] || {
    monthly_sales: Math.floor(Math.random() * 30000) + 5000,
    yoy_change: (Math.random() - 0.5) * 40,
    market_share: Math.random() * 5,
    segment_rank: Math.floor(Math.random() * 10) + 1,
    trend: Math.random() > 0.5 ? 'up' : 'down'
  };
  
  // Sales volume signal
  signals.push({
    signal_type: 'sales_volume',
    source: 'goodcarbadcar',
    year,
    make,
    model,
    region,
    signal_value: pattern.monthly_sales,
    signal_unit: 'units',
    signal_description: 'Monthly vehicle sales volume',
    trend_direction: pattern.trend,
    trend_strength: Math.abs(pattern.yoy_change) / 100,
    confidence_score: 0.90,
    data_quality_score: 0.95,
    signal_date: new Date().toISOString().split('T')[0],
    raw_data: {
      monthly_sales: pattern.monthly_sales,
      yoy_change: pattern.yoy_change,
      market_share: pattern.market_share,
      segment_rank: pattern.segment_rank,
      data_source: 'GoodCarBadCar API',
      collection_timestamp: new Date().toISOString()
    }
  });
  
  // Market share signal
  signals.push({
    signal_type: 'market_share',
    source: 'goodcarbadcar', 
    year,
    make,
    model,
    region,
    signal_value: pattern.market_share,
    signal_unit: 'percent',
    signal_description: 'Vehicle segment market share',
    trend_direction: pattern.yoy_change > 0 ? 'up' : 'down',
    trend_strength: Math.abs(pattern.yoy_change) / 50,
    confidence_score: 0.85,
    data_quality_score: 0.90,
    signal_date: new Date().toISOString().split('T')[0],
    raw_data: {
      market_share_percent: pattern.market_share,
      segment_rank: pattern.segment_rank,
      total_segment_sales: pattern.monthly_sales * (100 / pattern.market_share),
      yoy_change: pattern.yoy_change
    }
  });
  
  return signals;
}

// Simulate iSeeCars pricing data API
async function fetchISeeCarsData(params: MarketSignalRequest): Promise<MarketSignalData[]> {
  const { year, make, model, region = 'national' } = params;
  
  console.log(`Fetching iSeeCars pricing data for: ${year} ${make} ${model}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1200 + 400));
  
  const signals: MarketSignalData[] = [];
  const vehicleKey = `${year}_${make}_${model}`.toUpperCase();
  
  // Realistic pricing patterns
  const pricingPatterns: Record<string, any> = {
    '2023_TOYOTA_CAMRY': {
      avg_price: 28500,
      days_on_market: 35,
      price_trend: 'stable',
      inventory_level: 850,
      price_change_30d: 1.2
    },
    '2023_HONDA_CIVIC': {
      avg_price: 26800,
      days_on_market: 42,
      price_trend: 'increasing',
      inventory_level: 650,
      price_change_30d: 3.8
    },
    '2023_FORD_F-150': {
      avg_price: 42500,
      days_on_market: 28,
      price_trend: 'increasing',
      inventory_level: 320,
      price_change_30d: 5.2
    },
    '2023_CHEVROLET_SILVERADO': {
      avg_price: 41200,
      days_on_market: 32,
      price_trend: 'stable',
      inventory_level: 410,
      price_change_30d: 0.8
    },
    '2023_TESLA_MODEL_3': {
      avg_price: 35900,
      days_on_market: 25,
      price_trend: 'decreasing',
      inventory_level: 180,
      price_change_30d: -2.3
    }
  };
  
  const pattern = pricingPatterns[vehicleKey] || {
    avg_price: Math.floor(Math.random() * 40000) + 20000,
    days_on_market: Math.floor(Math.random() * 60) + 20,
    price_trend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)],
    inventory_level: Math.floor(Math.random() * 1000) + 100,
    price_change_30d: (Math.random() - 0.5) * 10
  };
  
  // Average listing price signal
  signals.push({
    signal_type: 'price_trend',
    source: 'isecars',
    year,
    make,
    model,
    region,
    signal_value: pattern.avg_price,
    signal_unit: 'usd',
    signal_description: 'Average market listing price',
    trend_direction: pattern.price_trend === 'stable' ? 'stable' : 
                    pattern.price_change_30d > 0 ? 'up' : 'down',
    trend_strength: Math.abs(pattern.price_change_30d) / 10,
    confidence_score: 0.85,
    data_quality_score: 0.90,
    signal_date: new Date().toISOString().split('T')[0],
    raw_data: {
      average_listing_price: pattern.avg_price,
      price_change_30d_percent: pattern.price_change_30d,
      days_on_market_avg: pattern.days_on_market,
      inventory_level: pattern.inventory_level,
      price_trend_direction: pattern.price_trend
    }
  });
  
  // Market liquidity signal (based on days on market)
  signals.push({
    signal_type: 'market_liquidity',
    source: 'isecars',
    year,
    make,
    model,
    region,
    signal_value: pattern.days_on_market,
    signal_unit: 'days',
    signal_description: 'Average days on market',
    trend_direction: pattern.days_on_market < 30 ? 'up' : 
                    pattern.days_on_market > 50 ? 'down' : 'stable',
    trend_strength: Math.abs(45 - pattern.days_on_market) / 45,
    confidence_score: 0.80,
    data_quality_score: 0.85,
    signal_date: new Date().toISOString().split('T')[0],
    raw_data: {
      days_on_market: pattern.days_on_market,
      inventory_level: pattern.inventory_level,
      liquidity_score: Math.max(0, 100 - pattern.days_on_market * 2)
    }
  });
  
  return signals;
}

// Simulate Google Trends search data API  
async function fetchGoogleTrendsData(params: MarketSignalRequest): Promise<MarketSignalData[]> {
  const { year, make, model, region = 'US' } = params;
  
  console.log(`Fetching Google Trends data for: ${year} ${make} ${model}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 300));
  
  const signals: MarketSignalData[] = [];
  const vehicleKey = `${year}_${make}_${model}`.toUpperCase();
  
  // Realistic search trends
  const searchPatterns: Record<string, any> = {
    '2023_TOYOTA_CAMRY': {
      search_volume: 72,
      trend_direction: 'rising',
      relative_popularity: 0.75,
      seasonal_factor: 1.1
    },
    '2023_HONDA_CIVIC': {
      search_volume: 68,
      trend_direction: 'stable',
      relative_popularity: 0.68,
      seasonal_factor: 1.0
    },
    '2023_FORD_F-150': {
      search_volume: 85,
      trend_direction: 'rising',
      relative_popularity: 0.88,
      seasonal_factor: 1.2
    },
    '2023_CHEVROLET_SILVERADO': {
      search_volume: 78,
      trend_direction: 'stable',
      relative_popularity: 0.81,
      seasonal_factor: 1.15
    },
    '2023_TESLA_MODEL_3': {
      search_volume: 92,
      trend_direction: 'rising',
      relative_popularity: 0.95,
      seasonal_factor: 0.9
    }
  };
  
  const pattern = searchPatterns[vehicleKey] || {
    search_volume: Math.floor(Math.random() * 70) + 30,
    trend_direction: ['rising', 'falling', 'stable'][Math.floor(Math.random() * 3)],
    relative_popularity: Math.random() * 0.8 + 0.2,
    seasonal_factor: Math.random() * 0.4 + 0.8
  };
  
  // Search volume signal
  signals.push({
    signal_type: 'search_trend',
    source: 'google_trends',
    year,
    make,
    model,
    region,
    signal_value: pattern.search_volume,
    signal_unit: 'score',
    signal_description: 'Google search volume index (0-100)',
    trend_direction: pattern.trend_direction,
    trend_strength: pattern.search_volume / 100,
    confidence_score: 0.80,
    data_quality_score: 0.85,
    signal_date: new Date().toISOString().split('T')[0],
    raw_data: {
      search_volume_index: pattern.search_volume,
      relative_popularity: pattern.relative_popularity,
      trend_direction: pattern.trend_direction,
      seasonal_adjustment_factor: pattern.seasonal_factor,
      related_queries: [
        `${make} ${model} review`,
        `${make} ${model} price`,
        `${make} ${model} specs`,
        `${make} ${model} vs`
      ]
    }
  });
  
  // Consumer interest signal
  signals.push({
    signal_type: 'consumer_interest',
    source: 'google_trends',
    year,
    make,
    model,
    region,
    signal_value: pattern.relative_popularity * 100,
    signal_unit: 'score',
    signal_description: 'Relative consumer interest level',
    trend_direction: pattern.trend_direction,
    trend_strength: Math.abs(pattern.relative_popularity - 0.5) * 2,
    confidence_score: 0.75,
    data_quality_score: 0.80,
    signal_date: new Date().toISOString().split('T')[0],
    raw_data: {
      popularity_score: pattern.relative_popularity,
      search_momentum: pattern.trend_direction === 'rising' ? 1.2 : 
                      pattern.trend_direction === 'falling' ? 0.8 : 1.0,
      seasonal_adjusted: pattern.search_volume * pattern.seasonal_factor
    }
  });
  
  return signals;
}

// Main function to aggregate market signals
async function fetchMarketSignals(params: MarketSignalRequest): Promise<MarketSignalData[]> {
  const { year, make, model, sources = ['goodcarbadcar', 'isecars', 'google_trends'] } = params;
  
  // Validate required parameters
  if (!year || !make || !model) {
    throw new Error('Year, make, and model are required parameters');
  }
  
  // Create cache key
  const cacheKey = `${year}_${make}_${model}_${sources.join('_')}`;
  
  // Check for active request (coalescing)
  if (activeRequests.has(cacheKey)) {
    console.log(`Coalescing market signals request for: ${cacheKey}`);
    return await activeRequests.get(cacheKey)!;
  }
  
  // Check cache first
  const cacheTimeout = parseInt(Deno.env.get('MARKET_SIGNALS_CACHE_HOURS') || '6') * 60 * 60 * 1000;
  
  try {
    const { data: cachedData } = await supabase
      .from('api_cache')
      .select('response_data, created_at')
      .eq('cache_key', `market_signals_${cacheKey}`)
      .eq('cache_type', 'market_signals')
      .single();
    
    if (cachedData && new Date(cachedData.created_at).getTime() + cacheTimeout > Date.now()) {
      console.log(`Cache hit for market signals: ${cacheKey}`);
      return cachedData.response_data as MarketSignalData[];
    }
  } catch (error) {
    console.log(`Cache miss for market signals: ${cacheKey}`);
  }
  
  // Create the request promise
  const requestPromise = aggregateMarketData(params, sources);
  activeRequests.set(cacheKey, requestPromise);
  
  try {
    const signals = await requestPromise;
    
    // Cache the results
    await supabase
      .from('api_cache')
      .upsert({
        cache_key: `market_signals_${cacheKey}`,
        cache_type: 'market_signals',
        response_data: signals,
        expires_at: new Date(Date.now() + cacheTimeout).toISOString(),
        source: 'MARKET_SIGNALS_API'
      });
    
    return signals;
  } finally {
    activeRequests.delete(cacheKey);
  }
}

// Aggregate data from multiple sources
async function aggregateMarketData(params: MarketSignalRequest, sources: string[]): Promise<MarketSignalData[]> {
  const allSignals: MarketSignalData[] = [];
  
  // Fetch data from all requested sources in parallel
  const fetchPromises: Promise<MarketSignalData[]>[] = [];
  
  if (sources.includes('goodcarbadcar')) {
    fetchPromises.push(fetchGoodCarBadCarData(params));
  }
  
  if (sources.includes('isecars')) {
    fetchPromises.push(fetchISeeCarsData(params));
  }
  
  if (sources.includes('google_trends')) {
    fetchPromises.push(fetchGoogleTrendsData(params));
  }
  
  // Wait for all data sources to complete
  const results = await Promise.allSettled(fetchPromises);
  
  // Aggregate successful results
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allSignals.push(...result.value);
    } else {
      console.error(`Failed to fetch from source ${sources[index]}:`, result.reason);
    }
  });
  
  return allSignals;
}

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const params: MarketSignalRequest = await req.json();
    const { year, make, model, region = 'national', sources, refresh = false } = params;
    
    console.log(`Market signals request: ${JSON.stringify(params)}`);
    
    // If refresh is requested, clear cache
    if (refresh) {
      const cacheKey = `${year}_${make}_${model}_${(sources || ['goodcarbadcar', 'isecars', 'google_trends']).join('_')}`;
      await supabase
        .from('api_cache')
        .delete()
        .eq('cache_key', `market_signals_${cacheKey}`);
    }
    
    // Fetch market signals
    const signals = await fetchMarketSignals(params);
    console.log(`Found ${signals.length} market signals`);
    
    // Store signals in database if any found
    if (signals.length > 0) {
      const { data: upsertResult, error } = await supabase
        .rpc('rpc_upsert_market_signals', { p_signals: signals });
      
      if (error) {
        console.error('Database upsert error:', error);
        return new Response(JSON.stringify({
          error: 'Failed to store market signals data',
          details: error.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      console.log(`Stored ${upsertResult?.processed_count || 0} market signals`);
    }
    
    // Get market intelligence summary
    const { data: intelligence, error: intelligenceError } = await supabase
      .rpc('get_market_intelligence', {
        p_year: year,
        p_make: make,
        p_model: model,
        p_region: region
      });
    
    if (intelligenceError) {
      console.error('Intelligence summary error:', intelligenceError);
    }
    
    // Calculate composite market score
    const salesSignals = signals.filter(s => s.signal_type === 'sales_volume');
    const priceSignals = signals.filter(s => s.signal_type === 'price_trend');
    const searchSignals = signals.filter(s => s.signal_type === 'search_trend');
    
    const marketScore = Math.round(
      (searchSignals[0]?.signal_value || 50) * 0.3 +
      (salesSignals[0]?.trend_direction === 'up' ? 75 : 
       salesSignals[0]?.trend_direction === 'down' ? 25 : 50) * 0.4 +
      (priceSignals[0]?.trend_direction === 'up' ? 70 : 
       priceSignals[0]?.trend_direction === 'down' ? 30 : 50) * 0.3
    );
    
    return new Response(JSON.stringify({
      success: true,
      vehicle: { year, make, model, region },
      market_signals: {
        total_signals: signals.length,
        sources: [...new Set(signals.map(s => s.source))],
        signal_types: [...new Set(signals.map(s => s.signal_type))],
        signals: signals
      },
      market_intelligence: intelligence || [],
      market_score: marketScore,
      market_temperature: marketScore > 70 ? 'hot' : marketScore > 50 ? 'warm' : marketScore > 30 ? 'cool' : 'cold',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Market signals function error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
