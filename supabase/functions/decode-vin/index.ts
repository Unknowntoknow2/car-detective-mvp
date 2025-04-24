
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vin } = await req.json();

    if (!vin || vin.length !== 17) {
      return new Response(JSON.stringify({ error: "Invalid VIN" }), {
        headers: corsHeaders,
        status: 400,
      });
    }

    console.log("Decoding VIN:", vin);

    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
    const data = await response.json();
    const results = data.Results;

    // Enhanced extract function with fallback values
    const extract = (label: string, fallback = "Not Available") => {
      const value = results.find((r) => r.Variable === label)?.Value;
      // If value is null, empty, or just whitespace, use the fallback
      return (value && value.trim() !== "") ? value : fallback;
    };

    // For numeric values, we need a different approach
    const extractNumber = (label: string) => {
      const value = results.find((r) => r.Variable === label)?.Value;
      const parsed = value ? parseInt(value) : null;
      return !isNaN(parsed) ? parsed : null;
    };

    const vehicleInfo = {
      vin,
      make: extract("Make"),
      model: extract("Model"),
      year: extractNumber("Model Year"),
      trim: extract("Trim"),
      engine: extract("Engine Model"),
      // Try multiple fields for transmission with fallbacks
      transmission: extract("Transmission Style") !== "Not Available" 
        ? extract("Transmission Style") 
        : extract("Transmission"),
      drivetrain: extract("Drive Type"),
      bodyType: extract("Body Class"),
      timestamp: new Date().toISOString(),
    };

    console.log("Processed vehicle info with fallbacks:", vehicleInfo);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!, 
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { error: insertError } = await supabase
      .from("decoded_vehicles")
      .upsert([vehicleInfo], { onConflict: "vin" });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        headers: corsHeaders,
        status: 500,
      });
    }

    return new Response(JSON.stringify(vehicleInfo), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: "Internal error", details: err.message }), {
      headers: corsHeaders,
      status: 500,
    });
  }
});
