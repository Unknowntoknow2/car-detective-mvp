
// This edge function handles car price prediction and returns valuation data

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";

interface ValuationRequest {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  fuelType: string;
  zipCode?: string;
  accident?: string;
  accidentDetails?: {
    count: string;
    severity: string;
    area: string;
  };
  includeCarfax?: boolean;
}

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

// Base values for different car makes (simplified example)
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
function calculateAdjustments(data: ValuationRequest): Array<{factor: string; impact: number; description: string}> {
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
  const conditionImpacts = {
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
  const fuelTypeImpacts = {
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

serve(async (req) => {
  try {
    const data: ValuationRequest = await req.json();
    
    // Basic validation
    if (!data.make || !data.model || !data.year || !data.mileage || data.mileage <= 0 || !data.condition) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate a unique ID for this valuation
    const valuationId = crypto.randomUUID();
    
    // Calculate base price
    const basePrice = calculateBasePrice(data.make, data.model);
    
    // Calculate adjustments
    const adjustments = calculateAdjustments(data);
    
    // Apply adjustments to get final value
    const adjustmentPercentage = adjustments.reduce((sum, adj) => sum + adj.impact, 0) / 100;
    const estimatedValue = Math.round(basePrice * (1 + adjustmentPercentage));
    
    // Calculate confidence score based on data quality
    let confidenceScore = 85; // Base confidence
    if (data.zipCode) confidenceScore += 3;
    if (data.includeCarfax) confidenceScore += 7;
    if (data.accident === "yes" && data.accidentDetails) confidenceScore += 5;
    
    // Generate price range (wider for lower confidence)
    const variancePercentage = (100 - confidenceScore) / 100;
    const minPrice = Math.round(estimatedValue * (1 - variancePercentage * 0.1));
    const maxPrice = Math.round(estimatedValue * (1 + variancePercentage * 0.1));
    
    // Store the valuation in the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    await supabase.from('valuations').insert({
      id: valuationId,
      make: data.make,
      model: data.model,
      year: data.year,
      estimated_value: estimatedValue,
      confidence_score: confidenceScore,
      condition_score: data.condition === "excellent" ? 90 : 
                       data.condition === "good" ? 75 : 
                       data.condition === "fair" ? 60 : 40,
      user_id: (await supabase.auth.getUser()).data.user?.id
    });
    
    const response: ValuationResponse = {
      id: valuationId,
      estimatedValue: estimatedValue,
      confidenceScore: confidenceScore,
      priceRange: [minPrice, maxPrice],
      comparables: Math.floor(Math.random() * 50) + 70, // Random number between 70-120
      valuationFactors: adjustments,
      includesCarfax: !!data.includeCarfax
    };
    
    return new Response(
      JSON.stringify(response),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in car-price-prediction:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
