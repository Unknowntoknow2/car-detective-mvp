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
    const vehicleAge = currentYear - input.year;

    // Get MSRP from model_trims
    let basePrice: number | null = null;
    const { data: modelData } = await supabase
      .from("model_trims")
      .select("msrp")
      .eq("year", input.year)
      .ilike("model_name", `%${input.model}%`)
      .maybeSingle();

    basePrice = modelData?.msrp ?? (() => {
      if (vehicleAge <= 1) return 35000;
      if (vehicleAge <= 3) return 28000;
      if (vehicleAge <= 5) return 22000;
      if (vehicleAge <= 10) return 15000;
      return 8000;
    })();

    const adjustments = [];

    // Apply improved depreciation logic
    const reliableBrands = ['Toyota', 'Honda', 'Lexus', 'Acura'];
    const brandMultiplier = reliableBrands.includes(input.make) ? 0.8 : 1.0;
    const fuelMultiplier = input.fuelType?.toLowerCase().includes('hybrid') ? 0.9 : 1.0;
    
    // More conservative depreciation
    let depreciationRate;
    if (vehicleAge <= 1) depreciationRate = 0.15;
    else if (vehicleAge <= 3) depreciationRate = 0.08;
    else if (vehicleAge <= 7) depreciationRate = 0.06;
    else depreciationRate = 0.04;
    
    const totalDepreciation = vehicleAge <= 1 ? 0.15 : 
      0.15 + Math.min(vehicleAge - 1, 2) * 0.08 + Math.max(0, Math.min(vehicleAge - 3, 4)) * 0.06 + Math.max(0, vehicleAge - 7) * 0.04;
    
    const adjustedDepreciation = Math.min(totalDepreciation * brandMultiplier * fuelMultiplier, 0.65);
    const depreciationAdj = -basePrice * adjustedDepreciation;
    
    adjustments.push({
      factor: "Depreciation",
      impact: depreciationAdj,
      description: `${vehicleAge} years old - ${Math.round(adjustedDepreciation * 100)}% depreciation ${reliableBrands.includes(input.make) ? '(reliable brand bonus)' : ''}`
    });
    
    // Apply depreciation to base price for subsequent calculations
    basePrice = basePrice + depreciationAdj;

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

    // Package/Feature Adjustments for trim-based options
    if (input.trim) {
      const trimLower = input.trim.toLowerCase();
      
      // Toyota-specific packages
      if (input.make === 'Toyota') {
        if (trimLower.includes('audio package')) {
          adjustments.push({ factor: "Audio Package", impact: 1200, description: "Premium audio system upgrade" });
        }
        if (trimLower.includes('blind spot') || trimLower.includes('bsm')) {
          adjustments.push({ factor: "Blind Spot Monitor", impact: 800, description: "Advanced safety feature" });
        }
        if (trimLower.includes('convenience') || trimLower.includes('moonroof') || trimLower.includes('sunroof')) {
          adjustments.push({ factor: "Convenience Package", impact: 850, description: "Moonroof and convenience features" });
        }
      }
      
      // Universal high-value features
      if (trimLower.includes('leather')) {
        adjustments.push({ factor: "Leather Package", impact: 1500, description: "Leather-appointed seating" });
      }
      if (trimLower.includes('navigation') || trimLower.includes('nav')) {
        adjustments.push({ factor: "Navigation System", impact: 600, description: "Built-in GPS navigation" });
      }
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
