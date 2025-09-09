import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AINValuationRequest {
  vin: string;
  year?: number;
  make?: string;
  model?: string;
  mileage: number;
  condition: string;
  zip: string;
}

interface AINValuationResponse {
  estimated_value: number;
  confidence_score: number;
  value_range?: {
    low: number;
    high: number;
  };
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  market_data?: {
    comparables_count: number;
    avg_days_on_market: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ainApiKey = Deno.env.get('AIN_API_KEY');
    const ainUrl = 'https://api.ain.ai/v1/valuation';
    const timeoutMs = 30000;

    if (!ainApiKey) {
      throw new Error('AIN_API_KEY not configured');
    }

    const requestData = await req.json() as AINValuationRequest;
    
    console.log('🚀 AIN Valuation Request:', {
      vin: requestData.vin,
      make: requestData.make,
      model: requestData.model,
      year: requestData.year,
      mileage: requestData.mileage,
      condition: requestData.condition,
      zip: requestData.zip
    });

    // Create request payload for AIN API
    const ainPayload = {
      vin: requestData.vin,
      year: requestData.year,
      make: requestData.make,
      model: requestData.model,
      mileage: requestData.mileage,
      condition: requestData.condition,
      zip: requestData.zip
    };

    const startTime = performance.now();

    // Make request to AIN API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const ainResponse = await fetch(ainUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ainApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ainPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - startTime);

    if (!ainResponse.ok) {
      const errorText = await ainResponse.text();
      console.error('❌ AIN API Error:', {
        status: ainResponse.status,
        statusText: ainResponse.statusText,
        error: errorText,
        latency: latencyMs
      });
      
      throw new Error(`AIN API error: ${ainResponse.status} ${ainResponse.statusText}`);
    }

    const ainData = await ainResponse.json() as AINValuationResponse;
    
    console.log('✅ AIN API Success:', {
      estimated_value: ainData.estimated_value,
      confidence_score: ainData.confidence_score,
      latency: latencyMs,
      comparables: ainData.market_data?.comparables_count || 0
    });

    // Return normalized response
    const response = {
      success: true,
      data: {
        estimated_value: ainData.estimated_value,
        confidence_score: ainData.confidence_score,
        value_range: ainData.value_range,
        adjustments: ainData.adjustments || [],
        market_data: ainData.market_data,
        source: 'ain',
        latency_ms: latencyMs
      }
    };

    return new Response(JSON.stringify(response), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });

  } catch (error) {
    console.error('🚨 AIN Valuation Function Error:', error);
    
    const errorResponse = {
      success: false,
      error: error.message,
      source: 'ain_edge_function'
    };

    // Return error but allow client to fallback
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
  }
});