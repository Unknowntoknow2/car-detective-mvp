import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Validation schema for incoming valuation requests
const ValuationRequestSchema = z.object({
  make: z.string(),
  model: z.string(),
  year: z.number().int().positive(),
  mileage: z.number().nonnegative(),
  condition: z.string(),
  fuelType: z.string(),
  zipCode: z.string().optional(),
  accident: z.string().optional(),
  accidentDetails: z.object({
    count: z.string(),
    severity: z.string(),
    area: z.string(),
  }).optional(),
  includeCarfax: z.boolean().optional(),
  conditionFactors: z.record(z.string(), z.number()).optional(),
  titleStatus: z.string().optional(), // Add title status to the schema
});

// Response type for the API
interface ValuationResponse {
  id: string;
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  comparables: number;
  valuationFactors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  includesCarfax: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const data = await req.json();
    
    // Validate the input data
    const parsedData = ValuationRequestSchema.safeParse(data);
    if (!parsedData.success) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid input data", 
          details: parsedData.error.format() 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const validatedData = parsedData.data;
    
    // Get additional valuation factors
    const accidentStep = validatedData.accidentDetails?.count ? 
      Math.min(4, parseInt(validatedData.accidentDetails.count)) : 0;
    
    // Determine mileage step based on mileage range
    let mileageStep = 0;
    if (validatedData.mileage > 80000) mileageStep = 4;
    else if (validatedData.mileage > 60000) mileageStep = 3;
    else if (validatedData.mileage > 40000) mileageStep = 2;
    else if (validatedData.mileage > 20000) mileageStep = 1;
    
    // Determine age step based on vehicle year
    const currentYear = new Date().getFullYear();
    const age = currentYear - validatedData.year;
    let ageStep = 0;
    if (age > 10) ageStep = 4;
    else if (age > 7) ageStep = 3;
    else if (age > 4) ageStep = 2;
    else if (age > 2) ageStep = 1;
    
    // Setup Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Fetch title status multiplier if provided
    let titleStatusMultiplier = 1.0; // Default to no adjustment
    
    if (validatedData.titleStatus) {
      try {
        const { data: titleStatusData, error: titleStatusError } = await supabase
          .from('title_status')
          .select('multiplier')
          .eq('status', validatedData.titleStatus)
          .single();
          
        if (titleStatusError) {
          console.error(`Error fetching title status multiplier:`, titleStatusError);
        } else if (titleStatusData) {
          titleStatusMultiplier = titleStatusData.multiplier;
          
          // Add to adjustments array for display
          allAdjustments.push({
            factor: "Title Status",
            impact: ((titleStatusMultiplier - 1.0) * 100),
            description: `${validatedData.titleStatus} title`
          });
        }
      } catch (titleStatusErr) {
        console.error("Error processing title status:", titleStatusErr);
      }
    }
    
    // Fetch multipliers in parallel
    const [accidentMultiplier, mileageMultiplier, ageMultiplier] = await Promise.all([
      fetchMultiplier('accidents', accidentStep),
      fetchMultiplier('mileage', mileageStep),
      fetchMultiplier('age', ageStep)
    ]);
    
    // Generate a unique ID for this valuation
    const valuationId = crypto.randomUUID();
    
    // Calculate base price
    const basePrice = calculateBasePrice(validatedData.make, validatedData.model);
    
    // ENHANCEMENT: Use the detailed condition factors if provided
    let conditionMultiplier = 1.0;
    let conditionAdjustments: Array<{factor: string; impact: number; description: string}> = [];
    
    if (validatedData.conditionFactors && Object.keys(validatedData.conditionFactors).length > 0) {
      // Fetch all the valuation factors from database
      const { data: factorsData, error: factorsError } = await supabase
        .from('valuation_factors')
        .select('*');
      
      if (factorsError) {
        console.error("Error fetching valuation factors:", factorsError);
      } else if (factorsData && factorsData.length > 0) {
        // Process each condition factor provided in the request
        let totalMultiplier = 1.0;
        
        // Add adjustments from the condition factors
        for (const [factorId, value] of Object.entries(validatedData.conditionFactors)) {
          // Convert the 0-100 value to a 0-4 step
          const step = Math.round((value / 100) * 4);
          
          // Find the matching factor in the database
          const factorRecord = factorsData.find(f => 
            f.factor_name === factorId.replace('_', '_') && f.step === step
          );
          
          if (factorRecord) {
            // Calculate the impact as a percentage of base price
            const factorMultiplier = factorRecord.multiplier;
            totalMultiplier *= factorMultiplier;
            
            // Format the factor name for display
            const [category, factor] = factorId.split('_');
            const displayName = factor
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
            
            // Calculate percentage impact
            const percentageImpact = ((factorMultiplier - 1.0) * 100);
            
            conditionAdjustments.push({
              factor: `${displayName} Condition`,
              impact: percentageImpact,
              description: factorRecord.label
            });
          }
        }
        
        // Apply a weighted average to avoid extreme multipliers
        conditionMultiplier = (totalMultiplier + 3) / 4; // Weight the formula to avoid extreme values
      }
    } else {
      // Fall back to the simplified condition adjustment if detailed factors weren't provided
      const conditionImpacts: Record<string, number> = {
        "excellent": 5,
        "good": 0,
        "fair": -5,
        "poor": -15
      };
      const conditionImpact = conditionImpacts[validatedData.condition] || 0;
      conditionAdjustments.push({
        factor: "Condition",
        impact: conditionImpact,
        description: `${validatedData.condition.charAt(0).toUpperCase() + validatedData.condition.slice(1)} condition`
      });
      
      // Convert the percentage to a multiplier
      conditionMultiplier = 1 + (conditionImpact / 100);
    }
    
    // Calculate other adjustments
    const adjustments = calculateAdjustmentsWithoutCondition(validatedData);
    
    // Add condition adjustments
    const allAdjustments = [...adjustments, ...conditionAdjustments];
    
    // Apply adjustments to get manual percentage change
    const manualPct = adjustments.reduce((sum, adj) => sum + adj.impact, 0) / 100;
    
    // Fetch the most recent photo score, if any
    let photoFactor = 1.0; // Default if no photo was provided
    
    const { data: photoScoreData, error: photoScoreError } = await supabase
      .from('photo_scores')
      .select('score')
      .eq('valuation_id', valuationId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (photoScoreData && !photoScoreError) {
      // Convert photo score (0.0-1.0) to a factor (0.9-1.1)
      // Better photos increase value, worse photos decrease value
      photoFactor = 0.9 + (photoScoreData.score * 0.2);
    }
    
    // Get zip code pricing curve multiplier
    let multiplier = 1.0; // Default if no multiplier found
    
    if (validatedData.zipCode && validatedData.condition) {
      try {
        // Fetch pricing curve multiplier from the get-pricing-curve function
        const functionUrl = `${supabaseUrl}/functions/v1/get-pricing-curve`;
        const pricingResponse = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            zip_code: validatedData.zipCode,
            condition: validatedData.condition
          }),
        });
        
        if (pricingResponse.ok) {
          const pricingData = await pricingResponse.json();
          if (pricingData.multiplier) {
            multiplier = pricingData.multiplier;
          }
        }
      } catch (error) {
        console.error("Error fetching pricing curve:", error);
        // Continue with default multiplier on error
      }
    }
    
    // Calculate final value by applying all factors
    const finalValue = Math.round(
      basePrice * 
      conditionMultiplier * 
      accidentMultiplier * 
      mileageMultiplier * 
      ageMultiplier * 
      multiplier * 
      photoFactor * 
      titleStatusMultiplier * // Include title status multiplier
      (1 + manualPct)
    );
    
    // Get current user ID from the auth context
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Calculate overall condition score if detailed factors provided
    let conditionScore = 60; // Default to "Good"
    if (validatedData.conditionFactors && Object.keys(validatedData.conditionFactors).length > 0) {
      const values = Object.values(validatedData.conditionFactors);
      conditionScore = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
    } else if (validatedData.condition) {
      conditionScore = validatedData.condition === "excellent" ? 90 : 
                      validatedData.condition === "good" ? 75 : 
                      validatedData.condition === "fair" ? 60 : 40;
    }
    
    // Store the valuation in the database
    const { error: insertError } = await supabase.from('valuations').insert({
      id: valuationId,
      make: validatedData.make,
      model: validatedData.model,
      year: validatedData.year,
      mileage: validatedData.mileage,
      condition_score: conditionScore,
      estimated_value: finalValue,
      confidence_score: confidenceScore,
      base_price: basePrice,
      zip_demand_factor: multiplier,
      user_id: userId,
      // Include all breakdown fields for persistence
      feature_value_total: 0, // This would be calculated separately
      accident_count: validatedData.accident === "yes" && validatedData.accidentDetails 
        ? parseInt(validatedData.accidentDetails.count) 
        : 0
    });
    
    if (insertError) {
      console.error("Error storing valuation:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to store valuation data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Prepare and return the response
    const response: ValuationResponse = {
      id: valuationId,
      estimatedValue: finalValue,
      confidenceScore: confidenceScore,
      priceRange: [minPrice, maxPrice],
      comparables: Math.floor(Math.random() * 50) + 70, // Random number between 70-120
      valuationFactors: allAdjustments,
      includesCarfax: !!validatedData.includeCarfax
    };
    
    // Add the new factors to the valuation breakdown
    allAdjustments.push({
      factor: "Accident History",
      impact: ((accidentMultiplier - 1.0) * 100),
      description: `${accidentStep} accident${accidentStep !== 1 ? 's' : ''}`
    });
    
    allAdjustments.push({
      factor: "Mileage",
      impact: ((mileageMultiplier - 1.0) * 100),
      description: getMileageDescription(validatedData.mileage)
    });
    
    allAdjustments.push({
      factor: "Vehicle Age",
      impact: ((ageMultiplier - 1.0) * 100),
      description: `${age} year${age !== 1 ? 's' : ''} old`
    });
    
    // Return detailed breakdown for debugging and transparency
    return new Response(
      JSON.stringify({
        ...response,
        // Include all calculation factors for transparency
        basePrice,
        manualPct,
        photoScore: photoScoreData?.score,
        multiplier,
        photoFactor,
        conditionMultiplier,
        accidentMultiplier,
        mileageMultiplier,
        ageMultiplier,
        finalValue
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in car-price-prediction:", error);
    
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Base values for different car makes
const makeBaseValues: Record<string, number> = {
  "Toyota": 25000,
  "Honda": 23000,
  "Ford": 22000,
  "Chevrolet": 21000,
  "BMW": 40000,
  "Mercedes-Benz": 45000,
  "Audi": 38000,
  "Lexus": 35000,
  "Tesla": 50000,
  "default": 20000
};

// Calculate base price based on make and model
function calculateBasePrice(make: string, model: string): number {
  const baseValue = makeBaseValues[make] || makeBaseValues.default;
  
  // Adjust for premium models
  if (["SUV", "Truck", "Crossover"].some(type => model.includes(type))) {
    return baseValue * 1.2;
  }
  
  return baseValue;
}

// Adjustment factors based on different parameters (excluding condition which is handled separately)
function calculateAdjustmentsWithoutCondition(data: z.infer<typeof ValuationRequestSchema>): Array<{factor: string; impact: number; description: string}> {
  const adjustments = [];
  
  // Year adjustment
  const currentYear = new Date().getFullYear();
  const yearDiff = currentYear - data.year;
  const yearImpact = -yearDiff * 2.5; // 2.5% depreciation per year
  adjustments.push({
    factor: "Year",
    impact: yearImpact,
    description: `${data.year} model (${yearDiff} years old)`
  });
  
  // Mileage adjustment
  const mileageImpact = -(data.mileage / 10000) * 3; // 3% depreciation per 10k miles
  adjustments.push({
    factor: "Mileage",
    impact: mileageImpact,
    description: `${data.mileage.toLocaleString()} miles`
  });
  
  // Fuel type adjustment
  const fuelTypeImpacts: Record<string, number> = {
    "Electric": 8,
    "Hybrid": 5,
    "Gasoline": 0,
    "Diesel": -2
  };
  const fuelImpact = fuelTypeImpacts[data.fuelType] || 0;
  adjustments.push({
    factor: "Fuel Type",
    impact: fuelImpact,
    description: `${data.fuelType} powertrain`
  });
  
  // Accident adjustment (for premium only)
  if (data.accident === "yes" && data.accidentDetails) {
    const accidentCount = parseInt(data.accidentDetails.count) || 1;
    const severityMultiplier = data.accidentDetails.severity === "major" ? 2 : 1;
    const accidentImpact = -5 * accidentCount * severityMultiplier;
    
    adjustments.push({
      factor: "Accident History",
      impact: accidentImpact,
      description: `${accidentCount} ${data.accidentDetails.severity} accident(s)`
    });
  }
  
  return adjustments;
}

// Helper function to get a descriptive string for mileage
function getMileageDescription(mileage: number): string {
  if (mileage < 20000) return "Less than 20,000 miles";
  if (mileage < 40000) return "20,000 - 40,000 miles";
  if (mileage < 60000) return "40,000 - 60,000 miles";
  if (mileage < 80000) return "60,000 - 80,000 miles";
  return "Over 80,000 miles";
}
