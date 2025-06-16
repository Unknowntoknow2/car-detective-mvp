import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const input = await req.json();

    if (
      !input.make || !input.model || !input.year || !input.mileage ||
      !input.condition || !input.zipCode
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let userId: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) userId = user.id;
    }

    const currentYear = new Date().getFullYear();
    const age = currentYear - input.year;

    // Get MSRP from model_trims
    let basePrice: number | null = null;
    const { data: modelData } = await supabase
      .from("model_trims")
      .select("msrp")
      .eq("year", input.year)
      .ilike("model_name", `%${input.model}%`)
      .maybeSingle();

    basePrice = modelData?.msrp ?? (() => {
      if (age <= 1) return 35000;
      if (age <= 3) return 28000;
      if (age <= 5) return 22000;
      if (age <= 10) return 15000;
      return 8000;
    })();

    const adjustments = [];

    // Mileage Adjustment
    const expectedMileage = input.year * 12000;
    const mileageDiff = input.mileage - expectedMileage;
    const mileageAdj = mileageDiff > 0
      ? -Math.min(basePrice * 0.15, mileageDiff * 0.05)
      : Math.min(basePrice * 0.08, Math.abs(mileageDiff) * 0.03);
    adjustments.push({
      factor: "Mileage",
      impact: mileageAdj,
      description: mileageDiff > 0
        ? `Higher than average mileage`
        : `Lower than average mileage`
    });

    // Condition Adjustment
    let conditionMultiplier = 1.0;
    switch (input.condition) {
      case "excellent": conditionMultiplier = 1.1; break;
      case "good": conditionMultiplier = 1.0; break;
      case "fair": conditionMultiplier = 0.9; break;
      case "poor": conditionMultiplier = 0.75; break;
    }
    const conditionAdj = basePrice * (conditionMultiplier - 1);
    adjustments.push({ factor: "Condition", impact: conditionAdj });

    // Accident Adjustment
    if (input.accidentCount && input.accidentCount > 0) {
      let accAdj = -basePrice * 0.05;
      if (input.accidentSeverity === "moderate") accAdj = -basePrice * 0.1;
      if (input.accidentSeverity === "major") accAdj = -basePrice * 0.2;
      if (input.accidentRepaired) accAdj *= 0.7;
      adjustments.push({
        factor: "Accident History",
        impact: accAdj,
        description: input.accidentSeverity || "Reported accident"
      });
    }

    // Tire Condition
    const tireMap = {
      new: 400,
      good: 0,
      fair: -200,
      poor: -800
    };
    if (input.tireCondition && tireMap[input.tireCondition]) {
      adjustments.push({
        factor: "Tire Condition",
        impact: tireMap[input.tireCondition],
        description: `${input.tireCondition} tires`
      });
    }

    // ZIP Market Adjustment
    let zipMult = 1.0;
    const { data: zipData } = await supabase
      .from("zip_validations")
      .select("city, state")
      .eq("zip", input.zipCode)
      .maybeSingle();
    const { data: marketData } = await supabase
      .from("market_adjustments")
      .select("market_multiplier")
      .eq("zip_code", input.zipCode)
      .maybeSingle();
    if (marketData?.market_multiplier) {
      zipMult = 1 + (marketData.market_multiplier / 100);
    }

    const zipAdj = basePrice * (zipMult - 1);
    if (zipAdj !== 0) {
      adjustments.push({
        factor: "Location",
        impact: zipAdj,
        description: `${zipData?.city || "ZIP"} market`
      });
    }

    // Fuel Type Bonus
    if (input.fuelType === "Electric") {
      adjustments.push({ factor: "EV", impact: basePrice * 0.05 });
    } else if (input.fuelType === "Hybrid") {
      adjustments.push({ factor: "Hybrid", impact: basePrice * 0.03 });
    }

    // Final calculation
    const totalAdjustments = adjustments.reduce((sum, a) => sum + a.impact, 0);
    const estimatedValue = Math.round(basePrice + totalAdjustments);
    const confidenceScore = Math.min(95, 85 +
      (input.vin ? 5 : 0) +
      (input.trim ? 2 : 0) +
      (input.bodyType ? 2 : 0) +
      (input.accidentCount ? 3 : 0));
    const priceRange: [number, number] = [
      Math.round(estimatedValue * 0.95),
      Math.round(estimatedValue * 1.05)
    ];

    const result = {
      id: crypto.randomUUID(),
      estimatedValue,
      confidenceScore,
      priceRange,
      adjustments,
      make: input.make,
      model: input.model,
      year: input.year,
      mileage: input.mileage,
      condition: input.condition,
      zipCode: input.zipCode
    };

    // Save if authenticated
    if (userId) {
      const { data: inserted } = await supabase.from("valuations").insert({
        user_id: userId,
        make: input.make,
        model: input.model,
        year: input.year,
        mileage: input.mileage,
        estimated_value: estimatedValue,
        confidence_score: confidenceScore,
        base_price: basePrice,
        zip_demand_factor: zipMult,
        vin: input.vin,
        condition_score: conditionMultiplier * 100
      }).select("id").single();
      if (inserted?.id) result.id = inserted.id;
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Valuation error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
