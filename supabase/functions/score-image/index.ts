
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, valuationId } = await req.json();
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "Image URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Scoring image for valuation ID: ${valuationId}`);
    console.log(`Image URL: ${imageUrl}`);
    
    // In a production environment, we would call a computer vision API here
    // For now, we'll implement a realistic mock scoring system
    
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a deterministic but realistic score
    // In production, this would be based on actual image analysis
    let score = 0.75; // Default "good" score
    
    // Add some variation based on the valuation ID and URL to make it deterministic
    const seed = (valuationId?.length || 0) + (imageUrl?.length || 0);
    const variation = (seed % 40) / 100; // -0.2 to +0.2 variation
    score = Math.max(0.3, Math.min(0.95, score + variation - 0.2));
    
    console.log(`Generated photo score: ${score}`);
    
    return new Response(
      JSON.stringify({ 
        score, 
        metadata: {
          analysisDate: new Date().toISOString(),
          confidence: 0.85,
          features: {
            exteriorCondition: score * 0.9 + 0.1,
            paintQuality: score * 0.8 + 0.1,
            detailedElements: score * 0.7 + 0.2
          }
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing image:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to process image" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
