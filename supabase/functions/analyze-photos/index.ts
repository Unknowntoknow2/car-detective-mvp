
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
    const { score, condition, confidenceScore, issuesDetected, aiSummary } = await simulatePhotoScoring(imageUrl);

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
          analysis_method: "simulated", // In production, this would be "ai" or similar
          condition: condition,
          confidenceScore: confidenceScore,
          issuesDetected: issuesDetected,
          aiSummary: aiSummary
        }
      })
      .select()
      .single();

    if (error) {
      console.error("Error storing score:", error);
    }

    // Return the score and analysis results
    return new Response(
      JSON.stringify({ 
        score, 
        condition,
        confidenceScore,
        issuesDetected,
        aiSummary,
        analysisTimestamp: new Date().toISOString(),
        id: data?.id
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-photos function:", error);
    
    // Provide a fallback error response with helpful user information
    return new Response(
      JSON.stringify({ 
        error: "Failed to process image",
        fallback: {
          score: 0.7, // Default fallback score
          condition: "Good",
          confidenceScore: 70,
          issuesDetected: [],
          aiSummary: "Fallback analysis due to processing error. Please try again or contact support if the issue persists."
        }
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Simulates scoring an image based on the URL
 * In a production environment, this would be replaced with a real computer vision API
 */
async function simulatePhotoScoring(imageUrl: string): Promise<{
  score: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  confidenceScore: number;
  issuesDetected: string[];
  aiSummary: string;
}> {
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
  const score = Math.round((baseScore + variableComponent) * 100) / 100;
  
  // Generate condition and confidence data based on the score
  let condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  let confidenceScore: number;
  let issuesDetected: string[] = [];
  let aiSummary: string;
  
  // Determine condition based on score
  if (score > 0.9) {
    condition = 'Excellent';
    confidenceScore = 90 + Math.floor(urlSeed % 10);
    issuesDetected = [];
    aiSummary = "Vehicle appears to be in excellent condition with no visible issues.";
  } else if (score > 0.8) {
    condition = 'Good';
    confidenceScore = 80 + Math.floor(urlSeed % 10);
    if (urlSeed % 3 === 0) {
      issuesDetected = ["Minor scratches on bumper"];
    }
    aiSummary = "Vehicle is in good condition with minimal signs of wear.";
  } else if (score > 0.7) {
    condition = 'Fair';
    confidenceScore = 70 + Math.floor(urlSeed % 10);
    issuesDetected = [
      "Visible wear on seats",
      "Minor dents on passenger door"
    ];
    aiSummary = "Vehicle shows normal wear and tear consistent with its age and mileage.";
  } else {
    condition = 'Poor';
    confidenceScore = 60 + Math.floor(urlSeed % 15);
    issuesDetected = [
      "Significant body damage",
      "Interior wear",
      "Paint fading"
    ];
    aiSummary = "Vehicle shows significant wear and would benefit from repairs and reconditioning.";
  }
  
  return {
    score,
    condition,
    confidenceScore,
    issuesDetected,
    aiSummary
  };
}
