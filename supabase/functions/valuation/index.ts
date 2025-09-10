import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-correlation-id',
};

// AIN API configuration
const AIN_API_URL = Deno.env.get('AIN_UPSTREAM_URL') || 'https://api.ain.ai/v1';
const AIN_API_KEY = Deno.env.get('AIN_API_KEY');

interface ValuationRequest {
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  mileage: number;
  zip_code?: string;
  condition: "poor" | "fair" | "good" | "very_good" | "excellent";
  requested_by?: string;
}

interface AINResponse {
  estimated_value: number;
  confidence_score: number;
  breakdown?: any[];
  market_data?: Record<string, unknown>;
  explanation?: string;
  price_range_low?: number;
  price_range_high?: number;
  base_value?: number;
  adjustments?: any[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const correlationId = req.headers.get('x-correlation-id') || crypto.randomUUID();
  
  try {
    console.log('🚀 [AIN] Valuation request received');
    
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'x-correlation-id': correlationId,
          'x-ain-route': 'error'
        }
      });
    }

    // Validate AIN configuration
    if (!AIN_API_KEY) {
      console.error('❌ [AIN] API key not configured');
      return new Response(JSON.stringify({ error: 'AIN service not configured' }), {
        status: 501,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'x-correlation-id': correlationId,
          'x-ain-route': 'local_disabled'
        }
      });
    }

    const payload: ValuationRequest = await req.json();
    console.log('🔍 [AIN] Processing valuation for:', { 
      vin: payload.vin, 
      make: payload.make, 
      model: payload.model,
      year: payload.year,
      mileage: payload.mileage,
      condition: payload.condition 
    });

    // Call AIN API
    const ainResponse = await fetch(`${AIN_API_URL}/valuation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIN_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId
      },
      body: JSON.stringify(payload)
    });

    const responseHeaders = {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'x-correlation-id': correlationId,
      'x-ain-route': 'ain',
      'x-upstream-status': ainResponse.status.toString()
    };

    if (!ainResponse.ok) {
      const errorText = await ainResponse.text().catch(() => 'Unknown AIN error');
      console.error('❌ [AIN] API error:', {
        status: ainResponse.status,
        error: errorText,
        correlationId
      });
      
      return new Response(JSON.stringify({ 
        error: `AIN API error: ${ainResponse.status}`,
        details: errorText,
        correlation_id: correlationId
      }), {
        status: ainResponse.status,
        headers: responseHeaders
      });
    }

    const ainData: AINResponse = await ainResponse.json();
    console.log('✅ [AIN] Valuation completed:', {
      estimatedValue: ainData.estimated_value,
      confidence: ainData.confidence_score,
      correlationId
    });

    console.log('ain.ok');
    console.log('ain.route', { 
      ok: true, 
      route: 'ain', 
      corr_id: correlationId,
      upstream_status: ainResponse.status
    });

    return new Response(JSON.stringify(ainData), {
      status: 200,
      headers: responseHeaders
    });

  } catch (error) {
    console.error('❌ [AIN] Edge function error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(JSON.stringify({ 
      error: 'Valuation service error',
      details: errorMessage,
      correlation_id: correlationId
    }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'x-correlation-id': correlationId,
        'x-ain-route': 'error'
      }
    });
  }
});