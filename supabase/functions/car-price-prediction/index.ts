<<<<<<< HEAD

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
=======
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
<<<<<<< HEAD
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const requestData = await req.json()
    console.log('Received request for valuation:', {
      make: requestData.make,
      model: requestData.model,
      year: requestData.year,
      mileage: requestData.mileage,
      vin: requestData.vin
    })

    // Calculate estimated value based on basic formula
    let baseValue = 15000 // Base value
    const currentYear = new Date().getFullYear()
    const age = currentYear - requestData.year
    
    // Age depreciation: 10% per year for first 5 years, 5% after
    let ageMultiplier = 1
    if (age <= 5) {
      ageMultiplier = 1 - (age * 0.1)
    } else {
      ageMultiplier = 0.5 - ((age - 5) * 0.05)
    }
    ageMultiplier = Math.max(ageMultiplier, 0.1) // Minimum 10% of original value

    // Mileage adjustment
    const avgMileagePerYear = 12000
    const expectedMileage = age * avgMileagePerYear
    const mileageDiff = requestData.mileage - expectedMileage
    const mileageMultiplier = 1 - (mileageDiff / 100000) * 0.2 // 20% reduction per 100k excess miles
    
    // Calculate final value
    const estimatedValue = Math.round(baseValue * ageMultiplier * mileageMultiplier)
    
    const valuationResult = {
      estimatedValue,
      confidenceScore: 95,
      conditionScore: 75,
      make: requestData.make,
      model: requestData.model,
      year: requestData.year,
      mileage: requestData.mileage,
      vin: requestData.vin,
      fuelType: requestData.fuelType,
      transmission: requestData.transmission,
      bodyType: requestData.bodyType,
      color: requestData.color
    }

    console.log('Valuation result:', valuationResult)

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')
    let userId = null
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
        if (!authError && user) {
          userId = user.id
        }
      } catch (error) {
        console.log('Auth error (continuing without user):', error)
      }
    }

    try {
      // Store in database using service role to bypass RLS
      const valuationData = {
        make: requestData.make,
        model: requestData.model,
        year: requestData.year,
        mileage: requestData.mileage,
        estimated_value: estimatedValue,
        confidence_score: 95,
        vin: requestData.vin,
        fuel_type: requestData.fuelType,
        transmission: requestData.transmission,
        body_type: requestData.bodyType,
        color: requestData.color,
        user_id: userId, // This can now be null for anonymous users
        state: requestData.zipCode?.substring(0, 2) || null,
        base_price: Math.round(baseValue),
        is_vin_lookup: true
      }

      console.log('Attempting to store valuation:', valuationData)

      const { data: storedValuation, error: storeError } = await supabaseClient
        .from('valuations')
        .insert(valuationData)
        .select()
        .single()

      if (storeError) {
        console.error('Error storing valuation:', storeError)
        // Continue without storing - just return the calculated result
        return new Response(
          JSON.stringify({
            ...valuationResult,
            id: `temp-${Date.now()}`,
            valuationId: `temp-${Date.now()}`
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )
      } else {
        console.log('Valuation stored successfully:', storedValuation?.id)
        return new Response(
          JSON.stringify({
            ...valuationResult,
            id: storedValuation?.id || `temp-${Date.now()}`,
            valuationId: storedValuation?.id || `temp-${Date.now()}`
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )
      }

    } catch (dbError) {
      console.error('Database error:', dbError)
      // Return the calculation result even if storage fails
      return new Response(
        JSON.stringify({
          ...valuationResult,
          id: `temp-${Date.now()}`,
          valuationId: `temp-${Date.now()}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

  } catch (error) {
    console.error('Error in car-price-prediction:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
=======
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the valuation input
    const input: ValuationInput = await req.json();

    // Validate required fields
    if (
      !input.make || !input.model || !input.year || !input.mileage ||
      !input.condition || !input.zipCode
    ) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          details:
            "Make, model, year, mileage, condition, and zipCode are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Extract user ID from authorization header if it exists
    let userId: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const { data: { user }, error } = await supabaseClient.auth.getUser(
          token,
        );
        if (user && !error) {
          userId = user.id;
        }
      } catch (error) {
        console.warn("Failed to get user from token:", error);
      }
    }

    // First, check if we have a base price for this make/model/year in our model_trims table
    let basePrice: number | null = null;
    const { data: modelData, error: modelError } = await supabaseClient
      .from("model_trims")
      .select("msrp")
      .eq("year", input.year)
      .ilike("model_name", `%${input.model}%`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!modelError && modelData && modelData.msrp) {
      basePrice = modelData.msrp;
      console.log(`Found base price from model_trims: $${basePrice}`);
    }

    // If we don't have a base price, use a reasonable default based on the year
    if (!basePrice) {
      const currentYear = new Date().getFullYear();
      const age = currentYear - input.year;

      // Very simple estimator based on age of vehicle
      if (age <= 1) {
        basePrice = 35000; // New vehicles
      } else if (age <= 3) {
        basePrice = 28000; // Recent models
      } else if (age <= 5) {
        basePrice = 22000; // Slightly older
      } else if (age <= 10) {
        basePrice = 15000; // Older vehicles
      } else {
        basePrice = 8000; // Very old vehicles
      }

      console.log(
        `Using estimated base price based on age (${age} years): $${basePrice}`,
      );
    }

    // Initialize adjustments array
    const adjustments: ValuationAdjustment[] = [];

    // Apply mileage adjustment
    let mileageAdjustment = 0;
    // Average annual mileage is ~12,000 miles
    const expectedMileage = input.year * 12000;
    const mileageDifference = input.mileage - expectedMileage;

    if (mileageDifference > 0) {
      // Higher mileage reduces value
      mileageAdjustment = -Math.min(basePrice * 0.15, mileageDifference * 0.05);
    } else {
      // Lower mileage increases value
      mileageAdjustment = Math.min(
        basePrice * 0.08,
        Math.abs(mileageDifference) * 0.03,
      );
    }

    adjustments.push({
      factor: "Mileage",
      impact: mileageAdjustment,
      description: mileageDifference > 0
        ? `Higher than average mileage (${input.mileage.toLocaleString()} vs expected ${expectedMileage.toLocaleString()})`
        : `Lower than average mileage (${input.mileage.toLocaleString()} vs expected ${expectedMileage.toLocaleString()})`,
    });

    // Apply condition adjustment
    let conditionMultiplier = 1.0;
    let conditionDescription = "";

    switch (input.condition) {
      case "excellent":
        conditionMultiplier = 1.1;
        conditionDescription =
          "Excellent condition - Like new with no visible issues";
        break;
      case "good":
        conditionMultiplier = 1.0;
        conditionDescription = "Good condition - Minor wear, well maintained";
        break;
      case "fair":
        conditionMultiplier = 0.9;
        conditionDescription =
          "Fair condition - Some wear, may need minor repairs";
        break;
      case "poor":
        conditionMultiplier = 0.75;
        conditionDescription =
          "Poor condition - Significant wear, needs repairs";
        break;
    }

    const conditionAdjustment = basePrice * (conditionMultiplier - 1);
    adjustments.push({
      factor: "Condition",
      impact: conditionAdjustment,
      description: conditionDescription,
    });

    // Apply accident history adjustment
    if (input.accidentCount && input.accidentCount > 0) {
      let accidentImpact = -basePrice * 0.05; // Default minor reduction

      if (input.accidentSeverity === "moderate") {
        accidentImpact = -basePrice * 0.1;
      } else if (input.accidentSeverity === "major") {
        accidentImpact = -basePrice * 0.2;
      }

      // If repaired, reduce the negative impact
      if (input.accidentRepaired) {
        accidentImpact = accidentImpact * 0.7; // 30% less impact if repaired
      }

      adjustments.push({
        factor: "Accident History",
        impact: accidentImpact,
        description: `${input.accidentSeverity || "Reported"} accident${
          input.accidentRepaired ? " (repaired)" : ""
        }`,
      });
    }

    // Apply tire condition adjustment
    if (input.tireCondition) {
      let tireImpact = 0;
      let tireDescription = "";

      switch (input.tireCondition) {
        case "new":
          tireImpact = 400;
          tireDescription = "New tires - Recently replaced";
          break;
        case "good":
          tireImpact = 0;
          tireDescription = "Good tire condition";
          break;
        case "fair":
          tireImpact = -200;
          tireDescription = "Fair tire condition - Some wear";
          break;
        case "poor":
          tireImpact = -800;
          tireDescription = "Poor tire condition - Needs replacement soon";
          break;
      }

      if (tireImpact !== 0) {
        adjustments.push({
          factor: "Tire Condition",
          impact: tireImpact,
          description: tireDescription,
        });
      }
    }

    // Apply market adjustment based on ZIP code (using simple regional multipliers)
    let zipAdjustment = 0;
    let zipDescription = "Local market adjustment";

    // Check the pricing_curves or market_adjustments table first
    const { data: zipData, error: zipError } = await supabaseClient
      .from("zip_validations")
      .select("city, state")
      .eq("zip", input.zipCode)
      .maybeSingle();

    let regionMultiplier = 1.0;

    if (!zipError && zipData) {
      // We have the zip code in our database
      const { data: marketData, error: marketError } = await supabaseClient
        .from("market_adjustments")
        .select("market_multiplier")
        .eq("zip_code", input.zipCode)
        .maybeSingle();

      if (!marketError && marketData) {
        regionMultiplier = 1 + (marketData.market_multiplier / 100);
        zipDescription = `${zipData.city}, ${zipData.state} market adjustment`;
      } else {
        // If no specific multiplier, use a simplified regional approach
        const region = zipData.state;

        // Apply simple regional multipliers
        switch (region) {
          case "CA":
          case "NY":
          case "FL":
          case "WA":
            regionMultiplier = 1.05; // Higher demand areas
            break;
          case "TX":
          case "IL":
          case "GA":
            regionMultiplier = 1.02; // Medium demand
            break;
          case "MI":
          case "OH":
            regionMultiplier = 0.98; // Lower demand
            break;
          default:
            regionMultiplier = 1.0; // Average demand
        }

        zipDescription = `${zipData.city}, ${zipData.state} regional market`;
      }
    }

    zipAdjustment = basePrice * (regionMultiplier - 1);

    if (zipAdjustment !== 0) {
      adjustments.push({
        factor: "Location",
        impact: zipAdjustment,
        description: zipDescription,
      });
    }

    // Apply additional model-specific adjustments
    if (input.fuelType === "Electric") {
      const evAdjustment = basePrice * 0.05;
      adjustments.push({
        factor: "Electric Vehicle",
        impact: evAdjustment,
        description: "Premium for electric vehicle",
      });
    } else if (input.fuelType === "Hybrid") {
      const hybridAdjustment = basePrice * 0.03;
      adjustments.push({
        factor: "Hybrid Vehicle",
        impact: hybridAdjustment,
        description: "Premium for hybrid powertrain",
      });
    }

    // Calculate final value
    const totalAdjustments = adjustments.reduce(
      (sum, adj) => sum + adj.impact,
      0,
    );
    const estimatedValue = Math.round(basePrice + totalAdjustments);

    // Calculate confidence score based on data completeness
    let confidenceScore = 85; // Base confidence

    // Adjust confidence based on data quality
    if (input.vin) confidenceScore += 5;
    if (input.trim) confidenceScore += 2;
    if (input.bodyType) confidenceScore += 2;
    if (input.accidentCount !== undefined) confidenceScore += 3;

    // Cap confidence score at 95
    confidenceScore = Math.min(confidenceScore, 95);

    // Add +/- 5% price range
    const priceRange: [number, number] = [
      Math.round(estimatedValue * 0.95),
      Math.round(estimatedValue * 1.05),
    ];

    // Create the result object
    const valuationResult: ValuationResult = {
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
      zipCode: input.zipCode,
    };

    // Save to valuations table if user is authenticated
    if (userId) {
      try {
        const { data: valuationData, error: valuationError } =
          await supabaseClient
            .from("valuations")
            .insert({
              user_id: userId,
              make: input.make,
              model: input.model,
              year: input.year,
              mileage: input.mileage,
              condition_score: conditionMultiplier * 100,
              estimated_value: estimatedValue,
              confidence_score: confidenceScore,
              base_price: basePrice,
              state: input.zipCode,
              vin: input.vin,
              color: input.color,
              body_type: input.bodyType,
              accident_count: input.accidentCount || 0,
              zip_demand_factor: regionMultiplier,
            })
            .select("id")
            .single();

        if (!valuationError && valuationData) {
          valuationResult.id = valuationData.id;
          console.log(`Saved valuation with ID: ${valuationData.id}`);
        }
      } catch (err) {
        console.error("Failed to save valuation:", err);
        // Continue with the function even if saving fails
      }
    }

    // Return successful response
    return new Response(
      JSON.stringify(valuationResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Valuation error:", err);

    // Return error response
    return new Response(
      JSON.stringify({
        error: err instanceof Error
          ? err.message
          : "Unknown error during valuation",
        details: "Please try again or contact support if the problem persists",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  }
})
