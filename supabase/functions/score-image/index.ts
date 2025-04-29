
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const ImageScoringRequestSchema = z.object({
  valuation_id: z.string().uuid(),
  image_url: z.string().url()
});

// Function to call the Vision API with retry logic
async function callVisionAPI(imageUrl: string, retries = 2): Promise<{ score: number; thumbnailUrl: string; metadata: any }> {
  const visionApiUrl = Deno.env.get("VISION_API_URL");
  const visionApiKey = Deno.env.get("VISION_API_KEY");
  
  if (!visionApiUrl || !visionApiKey) {
    throw new Error("Vision API configuration is missing");
  }
  
  let attempt = 0;
  let lastError: Error | null = null;
  
  while (attempt <= retries) {
    try {
      console.log(`Vision API attempt ${attempt + 1}/${retries + 1} for image: ${imageUrl}`);
      
      // Call the Vision API
      const response = await fetch(visionApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${visionApiKey}`
        },
        body: JSON.stringify({
          image_url: imageUrl,
          analysis_type: "vehicle_condition"
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Vision API returned ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      // Validate the response structure
      if (typeof result.score !== 'number' || typeof result.thumbnail_url !== 'string') {
        throw new Error("Invalid response format from Vision API");
      }
      
      // Extract and return the score and thumbnail
      return {
        score: result.score,
        thumbnailUrl: result.thumbnail_url,
        metadata: {
          original_url: imageUrl,
          analysis_timestamp: new Date().toISOString(),
          analysis_details: result.analysis_details || {}
        }
      };
    } catch (error) {
      console.error(`Vision API error (attempt ${attempt + 1}):`, error);
      lastError = error;
      
      if (attempt < retries) {
        // Exponential backoff: 500ms, 1500ms, ...
        const backoffTime = Math.pow(3, attempt) * 500;
        console.log(`Retrying in ${backoffTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
      
      attempt++;
    }
  }
  
  // If we've exhausted all retries, throw the last error
  throw lastError || new Error("Failed to analyze image after multiple attempts");
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Parse and validate the request body
    const body = await req.json();
    const validationResult = ImageScoringRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid request data", 
          details: validationResult.error.format() 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const validatedData = validationResult.data;

    try {
      // Call the Vision API with retry logic
      const { score, thumbnailUrl, metadata } = await callVisionAPI(validatedData.image_url);
      
      console.log(`Successfully analyzed image with score: ${score}`);
      
      // Store results in photo_scores table
      const { data, error } = await supabase
        .from('photo_scores')
        .insert({
          valuation_id: validatedData.valuation_id,
          score,
          thumbnail_url: thumbnailUrl,
          metadata
        })
        .select()
        .single();

      if (error) {
        console.error('Error storing photo score:', error);
        throw error;
      }

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      // Specifically handle Vision API failures with a 502 Bad Gateway
      console.error('Vision API processing error:', error);
      return new Response(
        JSON.stringify({ error: "Failed to process image with Vision API", details: error.message }), 
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    // Handle all other errors
    console.error('Error in score-image function:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
