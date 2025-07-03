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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const requestId = url.pathname.split('/').pop();

    if (!requestId) {
      throw new Error('Request ID is required');
    }

    console.log(`📊 Getting valuation result for: ${requestId}`);

    // Get valuation request
    const { data: valuationRequest, error: requestError } = await supabase
      .from('valuation_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (requestError || !valuationRequest) {
      throw new Error(`Valuation request not found: ${requestId}`);
    }

    // Get all market listings/comps
    const { data: marketListings, error: listingsError } = await supabase
      .from('market_listings')
      .select('*')
      .eq('valuation_request_id', requestId)
      .order('fetched_at', { ascending: false });

    if (listingsError) {
      console.error('Error fetching market listings:', listingsError);
    }

    // Get audit logs
    const { data: auditLogs, error: auditError } = await supabase
      .from('valuation_audit_logs')
      .select('*')
      .eq('valuation_request_id', requestId)
      .order('created_at', { ascending: false });

    if (auditError) {
      console.error('Error fetching audit logs:', auditError);
    }

    // Calculate valuation if we have comps
    let valuationResult = null;
    if (marketListings && marketListings.length > 0) {
      const prices = marketListings
        .map(listing => listing.price)
        .filter(price => price && price > 0)
        .sort((a, b) => a - b);

      if (prices.length > 0) {
        const median = prices[Math.floor(prices.length / 2)];
        const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const low = Math.min(...prices);
        const high = Math.max(...prices);
        
        // Group by source type for breakdown
        const sourceBreakdown = marketListings.reduce((acc, listing) => {
          const type = listing.source_type;
          if (!acc[type]) {
            acc[type] = { count: 0, prices: [], avg: 0 };
          }
          acc[type].count++;
          acc[type].prices.push(listing.price);
          acc[type].avg = acc[type].prices.reduce((sum, p) => sum + p, 0) / acc[type].prices.length;
          return acc;
        }, {} as any);

        // Calculate confidence based on comp count and spread
        const priceSpread = high - low;
        const spreadPercentage = (priceSpread / median) * 100;
        let confidence = 85; // Base confidence
        
        if (prices.length >= 10) confidence += 10;
        else if (prices.length >= 5) confidence += 5;
        
        if (spreadPercentage < 20) confidence += 5;
        else if (spreadPercentage > 50) confidence -= 10;

        confidence = Math.max(60, Math.min(95, confidence));

        valuationResult = {
          estimated_value: Math.round(median),
          price_range_low: Math.round(low),
          price_range_high: Math.round(high),
          mean_price: Math.round(mean),
          confidence_score: confidence,
          comp_count: prices.length,
          source_breakdown: sourceBreakdown,
          price_distribution: {
            q1: Math.round(prices[Math.floor(prices.length * 0.25)]),
            median: Math.round(median),
            q3: Math.round(prices[Math.floor(prices.length * 0.75)]),
            spread_percentage: Math.round(spreadPercentage)
          }
        };

        // Update valuation request with computed values
        await supabase
          .from('valuation_requests')
          .update({
            final_value: valuationResult.estimated_value,
            confidence_score: confidence,
            engine_response: valuationResult
          })
          .eq('id', requestId);

        // Log valuation computation
        await supabase
          .from('valuation_audit_logs')
          .insert({
            valuation_request_id: requestId,
            event: 'valuation_computed',
            input_data: { comp_count: prices.length },
            output_data: valuationResult,
            run_by: 'valuation_result_api'
          });
      }
    }

    console.log(`✅ Result compiled: ${marketListings?.length || 0} comps, confidence: ${valuationResult?.confidence_score || 'N/A'}`);

    return new Response(JSON.stringify({
      success: true,
      valuation_request: valuationRequest,
      valuation_result: valuationResult,
      market_listings: marketListings || [],
      audit_logs: auditLogs || [],
      summary: {
        status: valuationRequest.status,
        comp_count: marketListings?.length || 0,
        estimated_value: valuationResult?.estimated_value,
        confidence_score: valuationResult?.confidence_score,
        last_updated: valuationRequest.updated_at
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Valuation Result API error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      api: 'valuation-result'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});