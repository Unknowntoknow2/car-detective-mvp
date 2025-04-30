
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse the request body
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Analyze the telematics data
    // In a real implementation, this would parse CSV/JSON data and run analysis algorithms
    // For this example, we'll simulate the analysis
    const fileContent = await file.text();
    
    // Simple heuristic - look for keywords that might indicate driving behavior
    const text = fileContent.toLowerCase();
    
    let profile = 'Normal';
    let multiplier = 1.0;
    
    // Very simplistic analysis for demonstration
    const hardBrakingCount = (text.match(/hard braking|sudden stop|emergency brake/g) || []).length;
    const rapidAccelerationCount = (text.match(/rapid acceleration|hard acceleration|quick start/g) || []).length;
    const steadyDrivingCount = (text.match(/steady|constant speed|cruise control/g) || []).length;
    
    const aggressiveScore = hardBrakingCount + rapidAccelerationCount - steadyDrivingCount;
    
    if (aggressiveScore > 5) {
      profile = 'Aggressive';
      
      // Fetch the appropriate multiplier from the database
      const { data, error } = await supabase
        .from('driving_profile')
        .select('multiplier')
        .eq('profile', 'Aggressive')
        .single();
        
      if (!error && data) {
        multiplier = data.multiplier;
      } else {
        multiplier = 0.98; // Default if not found
      }
    } else if (aggressiveScore < -5) {
      profile = 'Conservative';
      
      // Fetch the appropriate multiplier from the database
      const { data, error } = await supabase
        .from('driving_profile')
        .select('multiplier')
        .eq('profile', 'Conservative')
        .single();
        
      if (!error && data) {
        multiplier = data.multiplier;
      } else {
        multiplier = 1.02; // Default if not found
      }
    }

    return new Response(
      JSON.stringify({
        profile,
        multiplier,
        confidence: 0.85, // Simulated confidence level
        metrics: {
          hardBraking: hardBrakingCount,
          rapidAcceleration: rapidAccelerationCount,
          steadyDriving: steadyDrivingCount
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error analyzing driving data:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
