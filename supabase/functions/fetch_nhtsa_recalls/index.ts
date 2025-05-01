
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request parameters
    const { make, model, year } = await req.json();
    
    // Validate required parameters
    if (!make || !model || !year) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: make, model, and year" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Check if we have a recent cache entry (less than 30 days old)
    const { data: cachedData, error: cacheError } = await supabase
      .from("recalls_cache")
      .select("recalls_data, fetched_at")
      .eq("make", make)
      .eq("model", model)
      .eq("year", year)
      .single();

    // If we have a relatively fresh cache (< 30 days), return it immediately
    if (cachedData && !cacheError) {
      const fetchedAt = new Date(cachedData.fetched_at);
      const now = new Date();
      const cacheAgeDays = (now.getTime() - fetchedAt.getTime()) / (1000 * 60 * 60 * 24);
      
      if (cacheAgeDays < 30) {
        console.log("Returning cached NHTSA recall data");
        return new Response(
          JSON.stringify(cachedData.recalls_data),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    }

    // Fetch fresh data from NHTSA API
    const apiUrl = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${year}`;
    
    console.log(`Fetching NHTSA recall data from: ${apiUrl}`);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`NHTSA API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: "Failed to fetch recall data" }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const recallsData = await response.json();

    // If we got valid data, update the cache
    if (recallsData) {
      // Upsert into recalls_cache
      const { error: upsertError } = await supabase
        .from("recalls_cache")
        .upsert({
          make,
          model,
          year,
          recalls_data: recallsData,
          fetched_at: new Date().toISOString(),
        });

      if (upsertError) {
        console.error("Error upserting NHTSA recall data:", upsertError);
      }
    }

    return new Response(
      JSON.stringify(recallsData),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in fetch_nhtsa_recalls function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
