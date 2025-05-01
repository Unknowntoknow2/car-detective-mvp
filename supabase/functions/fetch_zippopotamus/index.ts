
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
    const { zip } = await req.json();
    
    // Validate zip parameter
    if (!zip || !/^\d{5}$/.test(zip)) {
      return new Response(
        JSON.stringify({ error: "Invalid ZIP code format. Please provide a 5-digit ZIP code." }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Check if we have a recent cache entry
    const { data: cachedData, error: cacheError } = await supabase
      .from("zip_cache")
      .select("location_data, fetched_at")
      .eq("zip", zip)
      .single();

    // If we have a relatively fresh cache (< 30 days), return it immediately
    if (cachedData && !cacheError) {
      const fetchedAt = new Date(cachedData.fetched_at);
      const now = new Date();
      const cacheAgeDays = (now.getTime() - fetchedAt.getTime()) / (1000 * 60 * 60 * 24);
      
      if (cacheAgeDays < 30) {
        console.log("Returning cached ZIP data");
        return new Response(
          JSON.stringify(cachedData.location_data),
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    }

    // Fetch fresh data from Zippopotam.us API
    const apiUrl = `http://api.zippopotam.us/us/${zip}`;
    
    console.log(`Fetching ZIP data from: ${apiUrl}`);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`Zippopotam.us API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: "Invalid ZIP code" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const locationData = await response.json();

    // If we got valid data, update the cache
    if (locationData && locationData.places) {
      // Upsert into zip_cache
      const { error: upsertError } = await supabase
        .from("zip_cache")
        .upsert({
          zip,
          location_data: locationData,
          fetched_at: new Date().toISOString(),
        });

      if (upsertError) {
        console.error("Error upserting ZIP data:", upsertError);
      }
    }

    return new Response(
      JSON.stringify(locationData),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in fetch_zippopotamus function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
