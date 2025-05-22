
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

// Helper to extract value from NHTSA results array
function getField(results: any[], fieldName: string): string | undefined {
  const entry = results.find((item: any) => item.Variable === fieldName);
  return entry && entry.Value !== null && entry.Value !== "Not Applicable" ? entry.Value : undefined;
}

// Initialize Supabase client with environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { vin, plate, state } = await req.json();

    // Validate request parameters
    if ((!vin && (!plate || !state)) || (vin && (plate || state))) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "You must provide either a VIN or both a plate and state",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle VIN decode
    if (vin) {
      // Check VIN cache first
      const { data: cachedData, error: cacheError } = await supabase
        .from("vpic_cache")
        .select("vpic_data")
        .eq("vin", vin)
        .single();

      if (cachedData) {
        console.log("Found VIN in cache", vin);
        return new Response(
          JSON.stringify(cachedData.vpic_data),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Fetch decoded vehicle data from NHTSA
      const nhtsaRes = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${encodeURIComponent(vin)}?format=json`
      );
      const nhtsaData = await nhtsaRes.json();

      if (!nhtsaData || !nhtsaData.Results) {
        return new Response(
          JSON.stringify({ success: false, error: "No data from NHTSA" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Extract and normalize key fields
      const results = nhtsaData.Results;
      const vehicle = {
        vin,
        make: getField(results, "Make"),
        model: getField(results, "Model"),
        year: parseInt(getField(results, "Model Year") || "0"),
        trim: getField(results, "Trim"),
        bodyType: getField(results, "Body Class"),
        engine: getField(results, "Engine Model") || getField(results, "Engine Manufacturer"),
        fuelType: getField(results, "Fuel Type - Primary"),
        transmission: getField(results, "Transmission Style"),
        drivetrain: getField(results, "Drive Type"),
        doors: getField(results, "Doors"),
        engineCylinders: getField(results, "Engine Number of Cylinders"),
        displacementL: getField(results, "Displacement (L)"),
      };

      // Store in cache
      await supabase
        .from("vpic_cache")
        .upsert({
          vin,
          vpic_data: vehicle,
          fetched_at: new Date().toISOString(),
        })
        .select();

      // Save to decoded_vehicles table
      await supabase
        .from("decoded_vehicles")
        .upsert({
          vin,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          trim: vehicle.trim,
          bodyType: vehicle.bodyType,
          engine: vehicle.engine,
          transmission: vehicle.transmission,
          drivetrain: vehicle.drivetrain,
          doors: vehicle.doors,
          fueltype: vehicle.fuelType,
          enginecylinders: vehicle.engineCylinders,
          displacementl: vehicle.displacementL,
          created_at: new Date().toISOString(),
        })
        .select();

      return new Response(
        JSON.stringify(vehicle),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Handle plate lookup
    if (plate && state) {
      console.log("Looking up plate", plate, "in state", state);
      
      // Check if we have the plate cached
      const { data: cachedPlateData, error: cacheError } = await supabase
        .from("plate_lookups")
        .select("*")
        .eq("plate", plate)
        .eq("state", state)
        .single();

      // Return cached data if we have it
      if (cachedPlateData) {
        console.log("Found plate in cache", plate);
        return new Response(
          JSON.stringify({
            make: cachedPlateData.make,
            model: cachedPlateData.model,
            year: cachedPlateData.year,
            color: cachedPlateData.color,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // For demo purposes, generate mock data
      // In a real implementation, you would call a plate lookup API
      const mockVehicle = {
        make: "Honda",
        model: "Accord",
        year: 2019,
        color: "Silver",
        bodyType: "Sedan",
        fuelType: "Gasoline",
        transmission: "Automatic",
      };

      // Store mock data in cache
      await supabase
        .from("plate_lookups")
        .upsert({
          plate,
          state,
          make: mockVehicle.make,
          model: mockVehicle.model,
          year: mockVehicle.year,
          color: mockVehicle.color,
          created_at: new Date().toISOString(),
        })
        .select();

      return new Response(
        JSON.stringify(mockVehicle),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // This should never happen due to the validation above
    return new Response(
      JSON.stringify({ success: false, error: "Invalid request parameters" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
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
