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

interface ValuationAggregateInput {
  request_id: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  zip_code?: string;
  condition?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📊 PHASE 3 FIX: Valuation Aggregate API starting...');
    
    const requestData: ValuationAggregateInput = await req.json();
    
    console.log('🚗 Processing valuation aggregate for:', {
      request_id: requestData.request_id,
      make: requestData.make,
      model: requestData.model,
      year: requestData.year,
      vin: requestData.vin
    });

    // Get the valuation request
    const { data: valuationRequest, error: requestError } = await supabase
      .from('valuation_requests')
      .select('*')
      .eq('id', requestData.request_id)
      .single();

    if (requestError || !valuationRequest) {
      console.error('❌ Valuation request not found:', requestError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Valuation request not found',
        request_id: requestData.request_id
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PHASE 3 FIX: Generate market-based valuation with minimum threshold
    let estimatedValue = 0;
    let confidenceScore = 75;
    let marketStatus = 'fallback';

    try {
      // Try to get market data first
      console.log('🔍 Searching for market listings...');
      
      const { data: marketData, error: marketError } = await supabase.functions.invoke('enhanced-market-search', {
        body: {
          make: requestData.make,
          model: requestData.model,
          year: requestData.year,
          zipCode: requestData.zip_code || '94016',
          mileage: requestData.mileage || 60000,
          radius: 100
        }
      });

      if (!marketError && marketData?.success && marketData?.data?.length > 0) {
        console.log(`✅ Found ${marketData.data.length} market listings`);
        
        // Calculate average price from market data
        const prices = marketData.data.map((listing: any) => Number(listing.price)).filter((price: number) => price > 1000);
        if (prices.length > 0) {
          estimatedValue = Math.round(prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length);
          confidenceScore = Math.min(85, 60 + (prices.length * 5)); // Higher confidence with more listings
          marketStatus = 'success';
        }
      }

      // Fallback valuation if no market data
      if (estimatedValue === 0) {
        console.log('🔧 No market data found, using fallback calculation...');
        
        // Basic depreciation model
        const currentYear = new Date().getFullYear();
        const age = currentYear - requestData.year;
        
        // Base MSRP estimates
        const baseMSRP: { [key: string]: number } = {
          'toyota': 28000,
          'honda': 26000,
          'nissan': 25000,
          'ford': 27000,
          'chevrolet': 26000,
          'hyundai': 23000,
          'kia': 22000,
          'mazda': 25000,
          'subaru': 27000,
          'volkswagen': 28000
        };
        
        const basePrice = baseMSRP[requestData.make.toLowerCase()] || 26000;
        
        // Apply depreciation (20% first year, then 15% each subsequent year)
        let depreciatedValue = basePrice;
        if (age > 0) {
          depreciatedValue *= 0.80; // First year
          for (let i = 1; i < age; i++) {
            depreciatedValue *= 0.85; // Subsequent years
          }
        }
        
        // Mileage adjustment
        const avgMilesPerYear = 12000;
        const expectedMiles = age * avgMilesPerYear;
        const actualMiles = requestData.mileage || 60000;
        const excessMiles = Math.max(0, actualMiles - expectedMiles);
        const mileagePenalty = (excessMiles / 1000) * 50; // $50 per 1000 excess miles
        
        depreciatedValue -= mileagePenalty;
        
        // Condition adjustment
        const conditionMultipliers: { [key: string]: number } = {
          'excellent': 1.1,
          'good': 1.0,
          'fair': 0.85,
          'poor': 0.7
        };
        
        const conditionMultiplier = conditionMultipliers[requestData.condition || 'good'] || 1.0;
        depreciatedValue *= conditionMultiplier;
        
        // PHASE 3 FIX: Ensure minimum value threshold (no more $0 valuations)
        estimatedValue = Math.max(Math.round(depreciatedValue), 8000);
        confidenceScore = 70;
        marketStatus = 'fallback';
      }

    } catch (error) {
      console.error('❌ Error in valuation calculation:', error);
      
      // Emergency fallback - basic calculation to avoid $0 valuations
      const baseValue = 20000 - (new Date().getFullYear() - requestData.year) * 2000;
      estimatedValue = Math.max(baseValue, 8000);
      confidenceScore = 50;
      marketStatus = 'error';
    }

    // Update the valuation request with results
    const { error: updateError } = await supabase
      .from('valuation_requests')
      .update({
        status: 'completed',
        final_value: estimatedValue,
        confidence_score: confidenceScore,
        request_params: {
          ...valuationRequest.request_params,
          marketStatus: marketStatus,
          calculatedAt: new Date().toISOString()
        },
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', requestData.request_id);

    if (updateError) {
      console.error('❌ Failed to update valuation request:', updateError);
      throw updateError;
    }

    // Also update the valuations table if VIN exists
    if (requestData.vin) {
      const { error: valuationUpdateError } = await supabase
        .from('valuations')
        .update({
          estimated_value: estimatedValue,
          confidence_score: confidenceScore,
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('vin', requestData.vin);

      if (valuationUpdateError) {
        console.warn('⚠️ Failed to update valuations table:', valuationUpdateError);
      } else {
        console.log('✅ Updated valuations table');
      }
    }

    // Log audit event
    await supabase
      .from('valuation_audit_logs')
      .insert({
        valuation_request_id: requestData.request_id,
        event: 'valuation_calculated',
        input_data: requestData,
        output_data: { 
          estimated_value: estimatedValue,
          confidence_score: confidenceScore,
          market_status: marketStatus
        },
        run_by: 'valuation_aggregate_api'
      });

    console.log('✅ Valuation aggregate completed:', {
      request_id: requestData.request_id,
      estimated_value: estimatedValue,
      confidence_score: confidenceScore,
      market_status: marketStatus
    });

    return new Response(JSON.stringify({
      success: true,
      request_id: requestData.request_id,
      estimated_value: estimatedValue,
      confidence_score: confidenceScore,
      market_status: marketStatus,
      message: 'Valuation completed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Valuation Aggregate API error:', error);
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