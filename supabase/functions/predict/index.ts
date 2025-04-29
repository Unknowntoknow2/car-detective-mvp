
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { predictValuation, ValuationFeatures } from "../lib/inferenceModel.ts";
import { corsHeaders } from "../_shared/cors.ts";

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

    // Fetch the valuation data
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
        feature_value_total,
        zip_code: state
      `)
      .eq("id", valuationId)
      .single();

    if (valErr || !val) {
      return new Response(
        JSON.stringify({ error: "Valuation not found" }), 
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get most recent photo score for this valuation
    const { data: photoScoreData, error: photoScoreErr } = await supabase
      .from("photo_scores")
      .select("score")
      .eq("valuation_id", valuationId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const photoScore = photoScoreData?.score ?? 0.5; // Default to 0.5 if no photo score
    
    // Determine condition level based on condition_score
    let condition = "good";
    if (val.condition_score >= 85) condition = "excellent";
    else if (val.condition_score >= 65) condition = "good";
    else if (val.condition_score >= 40) condition = "fair";
    else condition = "poor";

    // Get pricing curve multiplier if we have a zip code
    let multiplier = 1.0;
    if (val.zip_code) {
      try {
        const { data: pricingData, error: pricingErr } = await supabase.functions.invoke("get-pricing-curve", {
          body: { 
            zip_code: val.zip_code,
            condition: condition
          }
        });
        
        if (!pricingErr && pricingData && pricingData.multiplier) {
          multiplier = pricingData.multiplier;
          console.log(`Using pricing multiplier: ${multiplier} for zip: ${val.zip_code}, condition: ${condition}`);
        }
      } catch (err) {
        console.warn("Failed to get pricing curve:", err);
        // Continue with default multiplier
      }
    }

    // Apply base prediction model
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

    const basePredictedPrice = predictValuation(features);
    
    // Apply photo score and multiplier adjustments
    // Formula: finalValue = basePrice * multiplier * (1 + (photoScore - 0.5) * 0.2)
    const photoAdjustment = (photoScore - 0.5) * 0.2;
    const finalPrice = Math.round(basePredictedPrice * multiplier * (1 + photoAdjustment));

    // Return the final valuation with a breakdown
    return new Response(
      JSON.stringify({
        predictedPrice: finalPrice,
        breakdown: {
          basePrice: basePredictedPrice,
          multiplier: multiplier,
          photoScore: photoScore,
          photoAdjustment: `${(photoAdjustment * 100).toFixed(1)}%`,
          finalPrice: finalPrice
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Prediction error:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
