
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { predictValuation, ValuationFeatures } from "../lib/inferenceModel.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { valuationId } = await req.json();
    
    if (!valuationId) {
      return new Response(
        JSON.stringify({ error: "valuationId required" }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: val, error: valErr } = await supabase
      .from("valuations")
      .select(`
        base_price,
        condition_score,
        mileage,
        accident_count,
        zip_demand_factor,
        dealer_avg_price,
        auction_avg_price,
        feature_value_total
      `)
      .eq("id", valuationId)
      .single();

    if (valErr || !val) {
      return new Response(
        JSON.stringify({ error: "Valuation not found" }), 
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const features: ValuationFeatures = {
      basePrice: val.base_price,
      conditionScore: val.condition_score,
      mileage: val.mileage,
      accidentCount: val.accident_count,
      zipDemandFactor: val.zip_demand_factor,
      dealerAvgPrice: val.dealer_avg_price,
      auctionAvgPrice: val.auction_avg_price,
      featureValueTotal: val.feature_value_total,
    };

    const predictedPrice = predictValuation(features);

    return new Response(
      JSON.stringify({ predictedPrice }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
