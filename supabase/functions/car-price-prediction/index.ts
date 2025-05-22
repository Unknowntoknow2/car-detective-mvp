
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

// Initialize Supabase client with environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function adjustPriceForCondition(basePrice: number, condition: string): number {
  const conditionMultipliers: { [key: string]: number } = {
    excellent: 1.15,
    very_good: 1.05,
    good: 1.0,
    fair: 0.85,
    poor: 0.7
  };

  const multiplier = conditionMultipliers[condition] || 1.0;
  return Math.round(basePrice * multiplier);
}

function adjustPriceForMileage(price: number, mileage: number, year: number): number {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  // Calculate expected mileage based on age (12,000 miles per year is average)
  const expectedMileage = age * 12000;
  
  // If mileage is significantly higher than expected, reduce price
  if (mileage > expectedMileage * 1.5) {
    return Math.round(price * 0.85);
  }
  
  // If mileage is significantly lower than expected, increase price
  if (mileage < expectedMileage * 0.5) {
    return Math.round(price * 1.1);
  }
  
  return price;
}

function generateAdjustments(basePrice: number, vehicleData: any): any[] {
  const adjustments = [];
  
  // Condition adjustment
  if (vehicleData.condition) {
    const conditionMap: { [key: string]: string } = {
      excellent: "Excellent condition adds premium",
      very_good: "Very good condition adds value",
      good: "Good condition maintains value",
      fair: "Fair condition reduces value",
      poor: "Poor condition significantly reduces value"
    };
    
    const conditionMultipliers: { [key: string]: number } = {
      excellent: 0.15,
      very_good: 0.05,
      good: 0,
      fair: -0.15,
      poor: -0.3
    };
    
    const impact = Math.round(basePrice * (conditionMultipliers[vehicleData.condition] || 0));
    
    adjustments.push({
      factor: "Condition",
      impact,
      description: conditionMap[vehicleData.condition] || "Condition affects value"
    });
  }
  
  // Mileage adjustment
  if (vehicleData.mileage && vehicleData.year) {
    const currentYear = new Date().getFullYear();
    const age = currentYear - vehicleData.year;
    const expectedMileage = age * 12000;
    let impact = 0;
    let description = "";
    
    if (vehicleData.mileage > expectedMileage * 1.5) {
      impact = Math.round(basePrice * -0.15);
      description = "High mileage reduces value";
    } else if (vehicleData.mileage < expectedMileage * 0.5) {
      impact = Math.round(basePrice * 0.1);
      description = "Low mileage adds value";
    } else {
      impact = 0;
      description = "Average mileage for age";
    }
    
    adjustments.push({
      factor: "Mileage",
      impact,
      description
    });
  }
  
  // Optional features adjustment
  if (vehicleData.transmission === "manual") {
    adjustments.push({
      factor: "Transmission",
      impact: Math.round(basePrice * -0.05),
      description: "Manual transmission typically less desirable"
    });
  }
  
  if (vehicleData.fuelType === "hybrid" || vehicleData.fuelType === "electric") {
    adjustments.push({
      factor: "Fuel Type",
      impact: Math.round(basePrice * 0.08),
      description: "Hybrid/Electric vehicles command premium"
    });
  }
  
  return adjustments;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const vehicleData = await req.json();
    console.log("Received valuation request:", vehicleData);

    // Validate required fields
    if (!vehicleData.make || !vehicleData.model) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Make and model are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Capitalize make and model
    const make = vehicleData.make.charAt(0).toUpperCase() + vehicleData.make.slice(1).toLowerCase();
    const model = vehicleData.model.charAt(0).toUpperCase() + vehicleData.model.slice(1).toLowerCase();
    
    // Generate a base price (in a real system, this would come from a pricing model)
    // Here we use a simple formula based on the make, model, and year
    const currentYear = new Date().getFullYear();
    const year = vehicleData.year || currentYear - 5;
    const yearFactor = 1 - ((currentYear - year) * 0.08);
    
    // Base prices by make (just for demo purposes)
    const makePrices: { [key: string]: number } = {
      toyota: 25000,
      honda: 24000,
      ford: 28000,
      chevrolet: 27000,
      bmw: 45000,
      mercedes: 50000,
      audi: 48000,
      tesla: 60000,
      hyundai: 22000,
      kia: 21000,
      nissan: 23000,
      volkswagen: 26000,
      subaru: 27000,
      mazda: 25000,
      lexus: 40000,
    };
    
    // Get the base price for the make or use a default
    const makeBasePrice = makePrices[make.toLowerCase()] || 25000;
    
    // Calculate base price using the make base price and year factor
    let basePrice = Math.round(makeBasePrice * yearFactor);
    
    // Adjust for condition if provided
    if (vehicleData.condition) {
      basePrice = adjustPriceForCondition(basePrice, vehicleData.condition);
    }
    
    // Adjust for mileage if provided
    if (vehicleData.mileage && vehicleData.year) {
      basePrice = adjustPriceForMileage(basePrice, vehicleData.mileage, vehicleData.year);
    }
    
    // Generate adjustments
    const adjustments = generateAdjustments(basePrice, vehicleData);
    
    // Calculate final value based on adjustments
    const adjustmentTotal = adjustments.reduce((sum, adj) => sum + adj.impact, 0);
    const estimatedValue = basePrice + adjustmentTotal;
    
    // Generate a random confidence score (in a real system, this would be based on data quality)
    const confidenceScore = getRandomInt(70, 95);
    
    // Calculate price range (wider range for lower confidence)
    const rangeFactor = (100 - confidenceScore) / 100;
    const minPrice = Math.round(estimatedValue * (1 - rangeFactor * 0.15));
    const maxPrice = Math.round(estimatedValue * (1 + rangeFactor * 0.15));
    
    // Generate a valuation ID
    const valuationId = crypto.randomUUID();
    
    // Prepare the valuation response
    const valuationResult = {
      id: valuationId,
      make,
      model,
      year,
      mileage: vehicleData.mileage,
      condition: vehicleData.condition,
      vin: vehicleData.vin,
      estimatedValue,
      basePrice,
      priceRange: [minPrice, maxPrice],
      confidenceScore,
      conditionScore: getRandomInt(60, 95),
      adjustments,
      features: [],
      fuelType: vehicleData.fuelType,
      transmission: vehicleData.transmission,
      bodyType: vehicleData.bodyType,
      created_at: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(valuationResult),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing valuation:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
