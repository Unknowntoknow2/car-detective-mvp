
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize Supabase client with environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Parse the request body
    const {
      make,
      model,
      year,
      mileage,
      condition,
      zipCode,
      fuelType,
      transmission,
      color,
      bodyType,
      vin
    } = await req.json();

    console.log("Received request for valuation:", { make, model, year, mileage, condition });

    // Validate required fields
    if (!make || !model || !year) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Make, model, and year are required for valuation",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // For demo purposes, we'll use a simple algorithm to calculate the value
    // In a real application, this would be a more complex model
    let baseValue = 0;
    
    // Base price by make/model/year
    switch (make.toLowerCase()) {
      case 'toyota':
        baseValue = 15000;
        if (model.toLowerCase() === 'camry') baseValue = 20000;
        if (model.toLowerCase() === 'corolla') baseValue = 17000;
        break;
      case 'honda':
        baseValue = 14000;
        if (model.toLowerCase() === 'accord') baseValue = 19000;
        if (model.toLowerCase() === 'civic') baseValue = 16000;
        break;
      case 'ford':
        baseValue = 12000;
        if (model.toLowerCase() === 'f-150') baseValue = 25000;
        break;
      default:
        baseValue = 10000;
        break;
    }
    
    // Year adjustment
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    const yearAdjustment = age * 500; // $500 per year of age
    
    // Mileage adjustment
    const mileageAdjustment = mileage ? (mileage / 10000) * 500 : 0; // $500 per 10k miles
    
    // Condition adjustment
    let conditionMultiplier = 1.0;
    if (condition) {
      switch (condition.toLowerCase()) {
        case 'excellent':
          conditionMultiplier = 1.1;
          break;
        case 'very_good':
          conditionMultiplier = 1.05;
          break;
        case 'good':
          conditionMultiplier = 1.0;
          break;
        case 'fair':
          conditionMultiplier = 0.9;
          break;
        case 'poor':
          conditionMultiplier = 0.8;
          break;
        default:
          conditionMultiplier = 1.0;
      }
    }
    
    // Calculate the final value
    let estimatedValue = (baseValue - yearAdjustment - mileageAdjustment) * conditionMultiplier;
    
    // Ensure the value is positive
    estimatedValue = Math.max(estimatedValue, 500);
    
    // Calculate confidence and condition scores
    const confidenceScore = Math.min(95, 70 + (vin ? 15 : 0) + (mileage ? 5 : 0) + (condition ? 5 : 0));
    const conditionScore = condition ? 
      {
        'excellent': 95,
        'very_good': 85,
        'good': 75,
        'fair': 60,
        'poor': 40
      }[condition.toLowerCase()] || 75 : 75;
    
    // Prepare the response
    const valuationResult = {
      estimatedValue: Math.round(estimatedValue),
      confidenceScore,
      conditionScore,
      make,
      model,
      year,
      mileage,
      condition,
      vin,
      fuelType,
      transmission,
      bodyType,
      color
    };

    console.log("Valuation result:", valuationResult);
    
    // Return the valuation result
    return new Response(
      JSON.stringify(valuationResult),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing valuation request:", error);
    
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
