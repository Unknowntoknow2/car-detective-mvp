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
    
    console.log('📝 Enhanced service role audit logging:', {
      vin: payload.vin,
      action: payload.action,
      finalValue: payload.output_data?.finalValue,
      confidence: payload.confidence_score
    });

    // Extract key data from payload
    const auditData = {
      vin: payload.vin || payload.input_data?.vin || 'unknown',
      action: payload.action || 'valuation_calculated',
      input_data: {
        vehicle: {
          vin: payload.input_data?.vin,
          make: payload.input_data?.make,
          model: payload.input_data?.model,
          year: payload.input_data?.year,
          mileage: payload.input_data?.mileage,
          condition: payload.input_data?.condition,
          zipCode: payload.input_data?.zipCode,
          userId: payload.input_data?.userId
        },
        timestamp: payload.input_data?.timestamp || new Date().toISOString()
      },
      output_data: {
        estimated_value: payload.output_data?.finalValue,
        confidence_score: payload.confidence_score,
        base_value: payload.output_data?.baseValue,
        adjustments: payload.output_data?.adjustments,
        sources: payload.output_data?.sources,
        listing_count: payload.output_data?.listingCount,
        market_search_status: payload.output_data?.marketSearchStatus,
        status: payload.output_data?.status
      },
      audit_data: payload.audit_data || payload,
      confidence_score: payload.confidence_score,
      sources_used: payload.sources_used || [],
      fallback_used: !payload.sources_used?.includes('market_listings'),
      quality_score: payload.confidence_score,
      processing_time_ms: payload.processing_time_ms,
      created_at: payload.created_at || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('valuation_audit_logs')
      .insert(auditData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error saving valuation audit:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          details: error
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    console.log('✅ Enhanced valuation audit logged with ID:', data.id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        id: data.id,
        vin: auditData.vin,
        timestamp: auditData.created_at
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Critical error in enhanced audit logging:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});