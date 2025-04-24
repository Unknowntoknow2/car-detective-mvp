
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

    const extract = (label: string) =>
      results.find((r) => r.Variable === label)?.Value || null;

    const vehicleInfo = {
      vin,
      make: extract("Make"),
      model: extract("Model"),
      year: parseInt(extract("Model Year")) || null,
      trim: extract("Trim"),
      engine: extract("Engine Model"),
      transmission: extract("Transmission Style") || extract("Transmission"),
      drivetrain: extract("Drive Type"),
      bodyType: extract("Body Class"),
      timestamp: new Date().toISOString(),
    };

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
