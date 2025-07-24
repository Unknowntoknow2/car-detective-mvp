import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ValuationRequestInput {
  vin?: string;
  make: string;
  model: string;
  trim?: string;
  year: number;
  mileage?: number;
  zip_code?: string;
  condition?: string;
  features?: string[];
  requested_by?: 'web' | 'api' | 'internal';
  meta?: Record<string, any>;
  user_id?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📋 FANG Valuation Request API starting...');
    
    const requestData: ValuationRequestInput = await req.json();
    
    // Get user from auth header if not provided
    const authHeader = req.headers.get('authorization');
    let userId = requestData.user_id;
    
    if (!userId && authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    console.log('🚗 Creating valuation request:', {
      make: requestData.make,
      model: requestData.model,
      year: requestData.year,
      vin: requestData.vin,
      user_id: userId
    });

    // Create valuation request record
    const { data: valuationRequest, error: createError } = await supabase
      .from('valuation_requests')
      .insert({
        user_id: userId,
        vin: requestData.vin,
        make: requestData.make,
        model: requestData.model,
        trim: requestData.trim,
        year: requestData.year,
        mileage: requestData.mileage,
        zip_code: requestData.zip_code,
        condition: requestData.condition,
        features: requestData.features || [],
        requested_by: requestData.requested_by || 'web',
        meta: requestData.meta || {},
        status: 'pending',
        request_params: requestData,
        comp_count: 0
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating valuation request:', createError);
      throw createError;
    }

    console.log('✅ Valuation request created:', valuationRequest.id);

    // Log audit event
    await supabase
      .from('valuation_audit_logs')
      .insert({
        valuation_request_id: valuationRequest.id,
        event: 'request_created',
        input_data: requestData,
        output_data: { request_id: valuationRequest.id },
        run_by: 'valuation_request_api'
      });

    // PHASE 3 FIX: Automatically trigger valuation calculation
    console.log('🧮 Triggering automatic valuation calculation...');
    
    try {
      const { data: aggregateResult, error: aggregateError } = await supabase.functions.invoke('valuation-aggregate', {
        body: {
          request_id: valuationRequest.id,
          vin: requestData.vin,
          make: requestData.make,
          model: requestData.model,
          year: requestData.year,
          mileage: requestData.mileage,
          zip_code: requestData.zip_code,
          condition: requestData.condition
        }
      });

      if (aggregateError) {
        console.error('⚠️ Auto-calculation failed:', aggregateError);
        // Don't fail the request creation, just log the error
      } else if (aggregateResult?.success) {
        console.log('✅ Auto-calculation completed:', aggregateResult.estimated_value);
      }
    } catch (calcError) {
      console.error('⚠️ Error in auto-calculation:', calcError);
      // Don't fail the request creation, just log the error
    }

    return new Response(JSON.stringify({
      success: true,
      request_id: valuationRequest.id,
      status: 'completed',
      message: 'Valuation request created and calculation initiated.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Valuation Request API error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      api: 'valuation-request'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});