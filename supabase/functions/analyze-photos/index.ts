
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, valuationId } = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "Missing image URL" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!valuationId) {
      return new Response(
        JSON.stringify({ error: "Missing valuation ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing image: ${imageUrl} for valuation: ${valuationId}`);

    // In a production environment, we would call a computer vision API here
    // For now, we'll use a simulated scoring function
    const score = await simulatePhotoScoring(imageUrl);

    // Store the score in the database
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from('photo_scores')
      .upsert({
        valuation_id: valuationId,
        score: score,
        thumbnail_url: imageUrl,
        metadata: {
          original_url: imageUrl,
          analysis_timestamp: new Date().toISOString(),
          analysis_method: "simulated" // In production, this would be "ai" or similar
        }
      })
      .select()
      .single();

    if (error) {
      console.error("Error storing score:", error);
    }

    // Return the score
    return new Response(
      JSON.stringify({ 
        score, 
        analysisTimestamp: new Date().toISOString(),
        id: data?.id
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in score-image function:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to process image" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Simulates scoring an image based on the URL
 * In a production environment, this would be replaced with a real computer vision API
 */
async function simulatePhotoScoring(imageUrl: string): Promise<number> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, we would analyze the image for:
  // - Clear visibility of the vehicle
  // - Good lighting
  // - Multiple angles
  // - Vehicle condition indicators
  
  // For now, generate a semi-random score between 0.6 and 0.95
  // Using URL as a seed for deterministic results
  const urlSeed = imageUrl.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const baseScore = 0.6;
  const variableComponent = (urlSeed % 100) / 100 * 0.35;
  
  return Math.round((baseScore + variableComponent) * 100) / 100;
}
