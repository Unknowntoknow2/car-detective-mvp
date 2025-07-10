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

    // Extract key data from payload - match actual table schema
    const auditData = {
      user_id: payload.input_data?.userId || null,
      vin: payload.vin || payload.input_data?.vin || 'unknown',
      zip_code: payload.input_data?.zipCode || null,
      step: payload.action || 'valuation_calculated',
      adjustment: 0, // Default value for required field
      final_value: payload.output_data?.finalValue || 0,
      confidence_score: payload.confidence_score || 85,
      status: 'COMPLETED',
      valuation_request_id: null, // Will be set when we implement proper request tracking
      adjustment_reason: 'Market data analysis',
      base_value: payload.output_data?.baseValue || payload.output_data?.finalValue || 0,
      adjustment_percentage: 0,
      data_sources: payload.sources_used || ['market_listings'],
      metadata: {
        input_data: payload.input_data,
        output_data: payload.output_data,
        processing_time_ms: payload.processing_time_ms,
        sources: payload.output_data?.sources,
        listing_count: payload.output_data?.listingCount
      },
      timestamp: new Date(payload.created_at || new Date().toISOString()),
      created_at: new Date(payload.created_at || new Date().toISOString()),
      updated_at: new Date()
    };

    console.log('🔍 Inserting audit data:', JSON.stringify(auditData, null, 2));

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