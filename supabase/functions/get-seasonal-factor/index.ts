
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Define CORS headers for browser access
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get query parameters
    const url = new URL(req.url);
    const month = parseInt(url.searchParams.get('month') || '0');
    const vehicleType = url.searchParams.get('vehicleType') || 'generic';
    
    if (!month || month < 1 || month > 12) {
      return new Response(
        JSON.stringify({ error: "Valid month required (1-12)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!['generic', 'suv', 'sport', 'convertible', 'truck'].includes(vehicleType)) {
      return new Response(
        JSON.stringify({ error: "Valid vehicleType required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Query the seasonal_index table
    const { data, error } = await supabase
      .from('seasonal_index')
      .select(`${vehicleType}, description`)
      .eq('month', month)
      .single();
    
    if (error) {
      console.error("Error fetching seasonal factor:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch seasonal factor" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Return the data
    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
