import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    
    console.log('📝 Service role audit logging:', {
      source: payload.source,
      confidence: payload.confidence,
      listings_count: payload.listings_count,
      baseValue: payload.baseValue
    });

    const { data, error } = await supabase
      .from('valuation_audit_logs')
      .insert({
        vin: payload.input?.vin || 'unknown',
        action: 'valuation_calculated',
        input_data: {
          vehicle: {
            vin: payload.input?.vin,
            make: payload.input?.make,
            model: payload.input?.model,
            year: payload.input?.year,
            mileage: payload.input?.mileage,
            condition: payload.input?.condition,
            zipCode: payload.input?.zipCode
          }
        },
        output_data: {
          estimated_value: payload.baseValue + (payload.adjustments?.total_adjustments || 0),
          confidence_score: payload.confidence,
          base_value: payload.baseValue,
          adjustments: payload.adjustments,
          source: payload.source
        },
        audit_data: payload,
        confidence_score: payload.confidence,
        sources_used: [payload.source],
        fallback_used: payload.source !== 'market_listings',
        quality_score: payload.confidence,
        processing_time_ms: null,
        created_at: payload.timestamp || new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error saving valuation audit:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    console.log('✅ Valuation audit logged with ID:', data.id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        id: data.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Critical error in audit logging:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});