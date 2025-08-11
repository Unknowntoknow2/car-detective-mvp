// @ts-ignore Deno std remote import
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
// @ts-ignore Supabase ESM shim
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Types for enhanced valuation
interface EnhancedValuationRequest {
  // Base vehicle data
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage: number;
  condition: 'excellent' | 'very_good' | 'good' | 'fair' | 'poor';
  
  // Location data
  location: {
    state: string;
    metro?: string;
    zip?: string;
  };
  
  // Vehicle specifics
  options?: string[];
  color?: string;
  transmission?: string;
  fuel_type?: string;
  vin?: string;
  
  // Valuation preferences
  valuation_mode: 'buyer' | 'seller' | 'trade' | 'insurance' | 'market';
  
  // Advanced options
  include_market_intelligence?: boolean;
  market_data_sources?: string[];
  confidence_threshold?: number;
  adjuster_types?: string[];
  
  // Session tracking
  session_id?: string;
  user_id?: string;
}

interface VehicleDetails {
  year: number;
  make: string;
  model: string;
  trim?: string;
  category?: string;
  fuel_type?: string;
}

interface AdjusterDetails {
  type: string;
  name: string;
  factor: number;
  impact_amount: number;
  description: string;
  confidence: number;
  data_source?: string;
}

interface MarketIntelligence {
  market_score: number;
  market_temperature: string;
  sales_momentum: string;
  price_trend: string;
  consumer_interest: string;
  market_liquidity: string;
  regional_factors: string[];
  data_quality: number;
  last_updated: string;
}

interface EnhancedValuationResponse {
  success: boolean;
  vehicle: VehicleDetails;
  base_valuation: number;
  market_intelligence: MarketIntelligence;
  adjusters: {
    market_condition: AdjusterDetails[];
    regional_factors: AdjusterDetails[];
    consumer_behavior: AdjusterDetails[];
    seasonal_patterns: AdjusterDetails[];
    vehicle_specific: AdjusterDetails[];
  };
  final_valuation: {
    amount: number;
    confidence_score: number;
    price_range: {
      low: number;
      high: number;
    };
  };
  explanation: {
    summary: string;
    key_factors: string[];
    market_insights: string[];
    adjuster_breakdown: string[];
  };
  processing_details: {
    processing_time_ms: number;
    market_data_fetch_time_ms: number;
    adjusters_applied: number;
    data_sources_used: string[];
  };
}

// Cache for base valuations and market data
const baseValuationCache = new Map<string, { value: number; timestamp: number }>();
const activeRequests = new Map<string, Promise<any>>();

// Base valuation calculation (simplified ML model simulation)
async function calculateBaseValuation(vehicle: VehicleDetails, mileage: number, condition: string): Promise<number> {
  const { year, make, model } = vehicle;
  const cacheKey = `${year}_${make}_${model}_${mileage}_${condition}`;
  
  // Check cache first
  const cached = baseValuationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 3600000) { // 1 hour cache
    return cached.value;
  }
  
  // Simulate ML model prediction with realistic patterns
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;
  
  // Base price patterns by make/model (simplified)
  const basePrices: Record<string, number> = {
    'TOYOTA_CAMRY': 32000,
    'HONDA_CIVIC': 28000,
    'FORD_F-150': 45000,
    'CHEVROLET_SILVERADO': 42000,
    'TESLA_MODEL_3': 40000,
    'BMW_3_SERIES': 50000,
    'MERCEDES-BENZ_C-CLASS': 52000,
    'JEEP_WRANGLER': 38000,
    'SUBARU_OUTBACK': 35000,
    'NISSAN_ALTIMA': 29000
  };
  
  const vehicleKey = `${make.toUpperCase()}_${model.toUpperCase().replace(/\s+/g, '_')}`;
  let basePrice = basePrices[vehicleKey] || 30000;
  
  // Adjust for model year (new vs used)
  if (vehicleAge === 0) {
    basePrice *= 1.05; // New car premium
  } else {
    // Depreciation curve
    const depreciationRate = 0.15; // 15% first year, then decreasing
    const ageAdjustment = Math.max(0.2, 1.0 - (depreciationRate * Math.pow(vehicleAge, 0.8)));
    basePrice *= ageAdjustment;
  }
  
  // Mileage adjustment
  const expectedMileage = vehicleAge * 12000;
  const mileageDelta = mileage - expectedMileage;
  const mileageAdjustment = 1.0 - (mileageDelta * 0.00005); // $0.05 per mile difference
  basePrice *= Math.max(0.3, mileageAdjustment);
  
  // Condition adjustment
  const conditionMultipliers = {
    'excellent': 1.15,
    'very_good': 1.05,
    'good': 1.00,
    'fair': 0.85,
    'poor': 0.65
  };
  basePrice *= conditionMultipliers[condition] || 1.0;
  
  // Add some realistic variance
  const variance = 0.05; // 5% variance
  const randomFactor = 1 + (Math.random() - 0.5) * variance;
  basePrice *= randomFactor;
  
  const finalValue = Math.round(basePrice);
  
  // Cache the result
  baseValuationCache.set(cacheKey, { value: finalValue, timestamp: Date.now() });
  
  return finalValue;
}

// Fetch market intelligence from PR D system
async function fetchMarketIntelligence(year: number, make: string, model: string, region: string): Promise<any> {
  console.log(`Fetching market intelligence for: ${year} ${make} ${model} in ${region}`);
  
  const startTime = Date.now();
  
  try {
    // First try to get from our market intelligence view
    const { data: intelligence, error: intelligenceError } = await supabase
      .from('current_market_intelligence')
      .select('*')
      .eq('year', year)
      .eq('make', make)
      .eq('model', model)
      .or(`region.eq.${region},region.eq.national`)
      .order('intelligence_quality_score', { ascending: false })
      .limit(1)
      .single();
    
    if (intelligence && !intelligenceError) {
      console.log(`Found market intelligence from view: score ${intelligence.composite_market_score}`);
      return {
        data: intelligence,
        fetch_time_ms: Date.now() - startTime,
        source: 'market_intelligence_view'
      };
    }
    
    // Fallback: try to fetch fresh market signals
    console.log('No cached intelligence found, fetching fresh market signals...');
    
    const { data: marketSignals, error: signalsError } = await supabase.functions.invoke('market-signals', {
      body: {
        year,
        make,
        model,
        region,
        sources: ['goodcarbadcar', 'isecars', 'google_trends']
      }
    });
    
    if (marketSignals && !signalsError) {
      console.log(`Fresh market signals fetched: ${marketSignals.market_signals?.total_signals || 0} signals`);
      return {
        data: marketSignals,
        fetch_time_ms: Date.now() - startTime,
        source: 'fresh_market_signals'
      };
    }
    
    console.log('Market intelligence fetch failed, using defaults');
    return {
      data: null,
      fetch_time_ms: Date.now() - startTime,
      source: 'default_fallback'
    };
    
  } catch (error) {
    console.error('Market intelligence fetch error:', error);
    return {
      data: null,
      fetch_time_ms: Date.now() - startTime,
      source: 'error_fallback',
      error: error.message
    };
  }
}

// Apply market adjusters using RPC function
async function applyMarketAdjusters(
  baseValuation: number,
  year: number,
  make: string,
  model: string,
  region: string,
  valuationMode: string
): Promise<any> {
  try {
    const { data, error } = await supabase
      .rpc('apply_market_adjusters', {
        p_base_valuation: baseValuation,
        p_year: year,
        p_make: make,
        p_model: model,
        p_region: region,
        p_valuation_mode: valuationMode
      });
    
    if (error) {
      console.error('RPC apply_market_adjusters error:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Market adjusters application error:', error);
    return null;
  }
}

// Generate explanation text
function generateExplanation(
  vehicle: VehicleDetails,
  baseValuation: number,
  finalValuation: number,
  marketIntel: any,
  adjusters: any
): any {
  const adjustmentPercentage = ((finalValuation - baseValuation) / baseValuation) * 100;
  const adjustmentDirection = adjustmentPercentage >= 0 ? 'increased' : 'decreased';
  const adjustmentMagnitude = Math.abs(adjustmentPercentage);
  
  const summary = `This ${vehicle.year} ${vehicle.make} ${vehicle.model} has been valued at $${finalValuation.toLocaleString()}, ` +
    `representing a ${adjustmentMagnitude.toFixed(1)}% ${adjustmentDirection} from the base valuation of $${baseValuation.toLocaleString()} ` +
    `due to current market conditions and regional factors.`;
  
  const keyFactors = [
    `Market Temperature: ${marketIntel?.market_temperature || 'Unknown'} market conditions`,
    `Base Vehicle Value: $${baseValuation.toLocaleString()} before adjustments`,
    `Net Market Adjustment: ${adjustmentPercentage >= 0 ? '+' : ''}${adjustmentPercentage.toFixed(1)}%`,
    `Final Valuation: $${finalValuation.toLocaleString()}`
  ];
  
  const marketInsights = [];
  if (marketIntel?.market_score) {
    marketInsights.push(`Market Score: ${marketIntel.market_score}/100 indicating ${marketIntel.market_temperature} market conditions`);
  }
  if (marketIntel?.sales_momentum) {
    marketInsights.push(`Sales Momentum: ${marketIntel.sales_momentum} based on recent volume trends`);
  }
  if (marketIntel?.consumer_interest) {
    marketInsights.push(`Consumer Interest: ${marketIntel.consumer_interest} search and engagement levels`);
  }
  
  const adjusterBreakdown = [];
  if (adjusters?.market_condition) {
    adjusters.market_condition.forEach((adj: AdjusterDetails) => {
      const impact = adj.factor !== 1.0 ? `${((adj.factor - 1.0) * 100).toFixed(1)}%` : 'neutral';
      adjusterBreakdown.push(`${adj.name}: ${impact} impact (${adj.description})`);
    });
  }
  
  return {
    summary,
    key_factors: keyFactors,
    market_insights: marketInsights.length > 0 ? marketInsights : ['Market intelligence data not available'],
    adjuster_breakdown: adjusterBreakdown.length > 0 ? adjusterBreakdown : ['No specific adjusters applied']
  };
}

// Main enhanced valuation function
async function performEnhancedValuation(request: EnhancedValuationRequest): Promise<EnhancedValuationResponse> {
  const startTime = Date.now();
  const { year, make, model, mileage, condition, location, valuation_mode } = request;
  
  console.log(`Enhanced valuation request: ${year} ${make} ${model}, ${mileage} miles, ${condition} condition`);
  
  // Step 1: Calculate base valuation
  const vehicle: VehicleDetails = {
    year,
    make,
    model,
    trim: request.trim,
    fuel_type: request.fuel_type
  };
  
  const baseValuation = await calculateBaseValuation(vehicle, mileage, condition);
  console.log(`Base valuation: $${baseValuation}`);
  
  // Step 2: Fetch market intelligence (if requested)
  let marketIntelligence = null;
  let marketFetchTime = 0;
  
  if (request.include_market_intelligence !== false) {
    const marketData = await fetchMarketIntelligence(year, make, model, location.state || 'national');
    marketFetchTime = marketData.fetch_time_ms;
    
    if (marketData.data) {
      if (marketData.source === 'market_intelligence_view') {
        // Data from our materialized view
        const intel = marketData.data;
        marketIntelligence = {
          market_score: intel.composite_market_score || 50,
          market_temperature: intel.market_temperature || 'warm',
          sales_momentum: intel.avg_sales_volume > 15000 ? 'strong' : intel.avg_sales_volume < 8000 ? 'weak' : 'moderate',
          price_trend: intel.avg_price ? 'stable' : 'unknown',
          consumer_interest: intel.search_volume > 70 ? 'high' : intel.search_volume < 40 ? 'low' : 'moderate',
          market_liquidity: intel.avg_days_on_market < 30 ? 'high' : intel.avg_days_on_market > 50 ? 'low' : 'moderate',
          regional_factors: intel.market_insights || [],
          data_quality: intel.intelligence_quality_score || 0.7,
          last_updated: intel.latest_signal_date || new Date().toISOString().split('T')[0]
        };
      } else if (marketData.source === 'fresh_market_signals') {
        // Data from fresh market signals
        const signals = marketData.data;
        marketIntelligence = {
          market_score: signals.market_score || 50,
          market_temperature: signals.market_temperature || 'warm',
          sales_momentum: 'moderate',
          price_trend: 'stable',
          consumer_interest: 'moderate',
          market_liquidity: 'moderate',
          regional_factors: ['Fresh market data incorporated'],
          data_quality: 0.8,
          last_updated: new Date().toISOString().split('T')[0]
        };
      }
    }
  }
  
  // Default market intelligence if none available
  if (!marketIntelligence) {
    marketIntelligence = {
      market_score: 50,
      market_temperature: 'warm',
      sales_momentum: 'moderate',
      price_trend: 'stable',
      consumer_interest: 'moderate',
      market_liquidity: 'moderate',
      regional_factors: ['Using default market assumptions'],
      data_quality: 0.5,
      last_updated: new Date().toISOString().split('T')[0]
    };
  }
  
  // Step 3: Apply market adjusters
  const adjustersResult = await applyMarketAdjusters(
    baseValuation,
    year,
    make,
    model,
    location.state || 'national',
    valuation_mode
  );
  
  let finalValuation = baseValuation;
  let adjustersApplied = 0;
  let adjustmentBreakdown = {
    market_condition: [],
    regional_factors: [],
    consumer_behavior: [],
    seasonal_patterns: [],
    vehicle_specific: []
  };
  
  if (adjustersResult) {
    finalValuation = adjustersResult.final_valuation || baseValuation;
    adjustersApplied = Object.keys(adjustersResult.applied_adjusters || {}).length;
    
    // Parse adjuster details from RPC result
    if (adjustersResult.applied_adjusters) {
      Object.entries(adjustersResult.applied_adjusters).forEach(([type, details]: [string, any]) => {
        const adjuster: AdjusterDetails = {
          type: type,
          name: details.description || type,
          factor: details.factor || 1.0,
          impact_amount: (details.factor - 1.0) * baseValuation,
          description: details.description || 'Market-based adjustment',
          confidence: adjustersResult.confidence_level || 0.7,
          data_source: 'market_intelligence'
        };
        
        // Categorize adjusters
        if (type.includes('temperature') || type.includes('momentum')) {
          adjustmentBreakdown.market_condition.push(adjuster);
        } else if (type.includes('regional') || type.includes('location')) {
          adjustmentBreakdown.regional_factors.push(adjuster);
        } else if (type.includes('search') || type.includes('consumer')) {
          adjustmentBreakdown.consumer_behavior.push(adjuster);
        } else if (type.includes('seasonal')) {
          adjustmentBreakdown.seasonal_patterns.push(adjuster);
        } else {
          adjustmentBreakdown.vehicle_specific.push(adjuster);
        }
      });
    }
  }
  
  // Step 4: Calculate confidence and price range
  const dataQuality = marketIntelligence.data_quality;
  const adjusterConfidence = adjustersResult?.confidence_level || 0.7;
  const overallConfidence = (dataQuality + adjusterConfidence) / 2;
  
  // Price range based on confidence (lower confidence = wider range)
  const uncertaintyFactor = 1.0 - overallConfidence;
  const rangePercentage = 0.05 + (uncertaintyFactor * 0.15); // 5-20% range based on confidence
  const priceLow = Math.round(finalValuation * (1 - rangePercentage));
  const priceHigh = Math.round(finalValuation * (1 + rangePercentage));
  
  // Step 5: Generate explanation
  const explanation = generateExplanation(
    vehicle,
    baseValuation,
    finalValuation,
    marketIntelligence,
    adjustmentBreakdown
  );
  
  // Step 6: Store valuation result in database
  const valuationRecord = {
    session_id: request.session_id,
    vehicle_year: year,
    vehicle_make: make,
    vehicle_model: model,
    vehicle_trim: request.trim,
    vehicle_vin: request.vin,
    mileage: mileage,
    condition: condition,
    location_state: location.state,
    location_metro: location.metro,
    location_zip: location.zip,
    base_valuation: baseValuation,
    market_intelligence_score: marketIntelligence.market_score,
    market_temperature: marketIntelligence.market_temperature,
    market_data_timestamp: new Date().toISOString(),
    market_data_sources: request.market_data_sources || ['market_intelligence'],
    applied_adjusters: adjustersResult?.applied_adjusters || {},
    market_condition_adjustments: { adjusters: adjustmentBreakdown.market_condition },
    regional_adjustments: { adjusters: adjustmentBreakdown.regional_factors },
    consumer_behavior_adjustments: { adjusters: adjustmentBreakdown.consumer_behavior },
    seasonal_adjustments: { adjusters: adjustmentBreakdown.seasonal_patterns },
    vehicle_specific_adjustments: { adjusters: adjustmentBreakdown.vehicle_specific },
    total_adjustment_percentage: adjustersResult?.adjustment_percentage || 0,
    final_valuation: finalValuation,
    price_range_low: priceLow,
    price_range_high: priceHigh,
    confidence_score: overallConfidence,
    data_quality_score: dataQuality,
    valuation_explanation: explanation.summary,
    key_factors: explanation.key_factors,
    market_insights: explanation.market_insights,
    adjuster_reasoning: { breakdown: explanation.adjuster_breakdown },
    valuation_mode: valuation_mode,
    user_id: request.user_id,
    api_version: 'v2',
    processing_time_ms: Date.now() - startTime,
    market_data_fetch_time_ms: marketFetchTime
  };
  
  try {
    const { error: insertError } = await supabase
      .from('enhanced_valuations')
      .insert(valuationRecord);
    
    if (insertError) {
      console.error('Failed to store valuation record:', insertError);
    } else {
      console.log('Valuation record stored successfully');
    }
  } catch (error) {
    console.error('Database insert error:', error);
  }
  
  // Step 7: Build response
  const processingTime = Date.now() - startTime;
  
  return {
    success: true,
    vehicle,
    base_valuation: baseValuation,
    market_intelligence: marketIntelligence,
    adjusters: adjustmentBreakdown,
    final_valuation: {
      amount: finalValuation,
      confidence_score: overallConfidence,
      price_range: {
        low: priceLow,
        high: priceHigh
      }
    },
    explanation,
    processing_details: {
      processing_time_ms: processingTime,
      market_data_fetch_time_ms: marketFetchTime,
      adjusters_applied: adjustersApplied,
      data_sources_used: request.market_data_sources || ['market_intelligence', 'base_model']
    }
  };
}

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const request: EnhancedValuationRequest = await req.json();
    
    // Validate required fields
    if (!request.year || !request.make || !request.model || !request.mileage || !request.condition || !request.location?.state) {
      return new Response(JSON.stringify({
        error: 'Missing required fields',
        required: ['year', 'make', 'model', 'mileage', 'condition', 'location.state']
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`Enhanced valuation request: ${JSON.stringify(request)}`);
    
    // Create request coalescing key
    const coalescingKey = `${request.year}_${request.make}_${request.model}_${request.mileage}_${request.condition}_${request.location.state}`;
    
    // Check for active request
    if (activeRequests.has(coalescingKey)) {
      console.log(`Coalescing request for: ${coalescingKey}`);
      const result = await activeRequests.get(coalescingKey);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create new request promise
    const requestPromise = performEnhancedValuation(request);
    activeRequests.set(coalescingKey, requestPromise);
    
    try {
      const result = await requestPromise;
      
      return new Response(JSON.stringify({
        ...result,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } finally {
      activeRequests.delete(coalescingKey);
    }
    
  } catch (error) {
    console.error('Enhanced valuation function error:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message,
      success: false
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
