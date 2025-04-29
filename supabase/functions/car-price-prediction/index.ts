
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    
    // Setup Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Generate a unique ID for this valuation
    const valuationId = crypto.randomUUID();
    
    // Calculate base price
    const basePrice = calculateBasePrice(validatedData.make, validatedData.model);
    
    // Calculate adjustments
    const adjustments = calculateAdjustments(validatedData);
    
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
    const finalValue = Math.round(basePrice * (1 + manualPct) * multiplier * photoFactor);
    
    // Calculate confidence score based on data quality
    let confidenceScore = 85; // Base confidence
    if (validatedData.zipCode) confidenceScore += 3;
    if (validatedData.includeCarfax) confidenceScore += 7;
    if (validatedData.accident === "yes" && validatedData.accidentDetails) confidenceScore += 5;
    
    // Generate price range based on confidence
    const variancePercentage = (100 - confidenceScore) / 100;
    const minPrice = Math.round(finalValue * (1 - variancePercentage * 0.1));
    const maxPrice = Math.round(finalValue * (1 + variancePercentage * 0.1));
    
    // Get current user ID from the auth context
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Store the valuation in the database
    const { error: insertError } = await supabase.from('valuations').insert({
      id: valuationId,
      make: validatedData.make,
      model: validatedData.model,
      year: validatedData.year,
      mileage: validatedData.mileage,
      condition_score: validatedData.condition === "excellent" ? 90 : 
                       validatedData.condition === "good" ? 75 : 
                       validatedData.condition === "fair" ? 60 : 40,
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
      valuationFactors: adjustments,
      includesCarfax: !!validatedData.includeCarfax
    };
    
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

// Adjustment factors based on different parameters
function calculateAdjustments(data: z.infer<typeof ValuationRequestSchema>): Array<{factor: string; impact: number; description: string}> {
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
  
  // Condition adjustment
  const conditionImpacts: Record<string, number> = {
    "excellent": 5,
    "good": 0,
    "fair": -5,
    "poor": -15
  };
  const conditionImpact = conditionImpacts[data.condition] || 0;
  adjustments.push({
    factor: "Condition",
    impact: conditionImpact,
    description: `${data.condition.charAt(0).toUpperCase() + data.condition.slice(1)} condition`
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
