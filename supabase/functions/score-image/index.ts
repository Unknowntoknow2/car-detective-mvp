
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0";

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
    // Parse request body
    const { file, fileName, valuationId } = await req.json();

    if (!file) {
      return new Response(
        JSON.stringify({ error: "Missing file data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!valuationId) {
      return new Response(
        JSON.stringify({ error: "Missing valuation ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Setup Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Processing image for valuation: ${valuationId}`);

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vehicle-photos')
      .uploadAndCreateSignedUrl(`${valuationId}/${fileName || `photo-${Date.now()}.jpg`}`, 
        Uint8Array.from(atob(file), c => c.charCodeAt(0)), 
        {
          contentType: 'image/jpeg',
          upsert: false,
        }
      );

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`File upload failed: ${uploadError.message}`);
    }

    // Get the URL of the uploaded image
    const imageUrl = uploadData?.signedUrl || '';
    
    // Get the public URL for storage
    const { data: publicUrlData } = supabase.storage
      .from('vehicle-photos')
      .getPublicUrl(`${valuationId}/${fileName || `photo-${Date.now()}.jpg`}`);
      
    const publicUrl = publicUrlData?.publicUrl || '';

    // Score the image - in a production environment, this would call a computer vision API
    // For now, we'll use a simulated scoring function
    const score = await simulatePhotoScoring(imageUrl);
    const isBestPhoto = score > 0.8; // If score is high, mark as best photo

    // Generate AI explanation for the photo using OpenAI
    let explanation = "Unable to generate explanation for this image.";
    try {
      if (openaiApiKey) {
        explanation = await generatePhotoExplanation(publicUrl, openaiApiKey);
      } else {
        explanation = simulatePhotoExplanation(score);
      }
    } catch (explainError) {
      console.error("Error generating explanation:", explainError);
      // Continue with default explanation rather than failing
    }

    // Store the score and explanation in the database
    const { data, error } = await adminClient
      .from('photo_scores')
      .insert({
        valuation_id: valuationId,
        score: score,
        thumbnail_url: publicUrl,
        explanation: explanation,
        metadata: {
          original_url: imageUrl,
          analysis_timestamp: new Date().toISOString(),
          analysis_method: "simulated", // In production, this would be "ai" or similar
          isPrimary: isBestPhoto
        }
      })
      .select()
      .single();

    if (error) {
      console.error("Error storing score:", error);
      throw new Error(`Failed to store photo score: ${error.message}`);
    }

    // Update the valuation with the best photo and explanation in the data JSONB field
    if (isBestPhoto) {
      // First get the current data
      const { data: valuationData, error: valuationError } = await adminClient
        .from('valuations')
        .select('data')
        .eq('id', valuationId)
        .single();
      
      if (!valuationError) {
        const currentData = valuationData?.data || {};
        
        // Update the data JSONB field
        await adminClient
          .from('valuations')
          .update({
            data: {
              ...currentData,
              best_photo_url: publicUrl,
              photo_score: score,
              photo_explanation: explanation
            }
          })
          .eq('id', valuationId);
      }
    }

    // Return the score, image URL and explanation
    return new Response(
      JSON.stringify({ 
        score, 
        url: publicUrl,
        analysisTimestamp: new Date().toISOString(),
        id: data?.id,
        bestPhoto: isBestPhoto,
        explanation
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in score-image function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process image", 
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Simulates scoring a photo for vehicle condition assessment
 * In a production environment, this would be replaced with a call to a computer vision API
 */
async function simulatePhotoScoring(imageUrl: string): Promise<number> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate a score between 0.3 and 0.95
  return 0.3 + Math.random() * 0.65;
}

/**
 * Generates an explanation of the vehicle condition based on the photo
 * using OpenAI's API
 */
async function generatePhotoExplanation(imageUrl: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional auto appraiser. Describe any visible defects, paint wear, lighting issues, or damage that might affect the car's resale value. Be concise and objective (2-3 sentences). Do not make assumptions."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Given this photo of a used car, describe any visible defects, paint wear, lighting issues, or damage that might affect resale value." },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    // Return a fallback explanation
    return simulatePhotoExplanation(0.6);
  }
}

/**
 * Simulates generating an explanation for a photo based on the score
 * Used as a fallback when OpenAI API is unavailable
 */
function simulatePhotoExplanation(score: number): string {
  const explanations = [
    // High scores (0.85+)
    "The vehicle appears to be in excellent condition with no visible defects. The paint finish is glossy and consistent throughout.",
    "This photo shows a well-maintained vehicle with clean exterior surfaces and no noticeable imperfections.",
    
    // Good scores (0.7-0.85)
    "The vehicle shows minor signs of use with some light surface scratches visible on the paint. Overall condition is good.",
    "Overall the vehicle condition looks good, though minor cosmetic wear is visible on the bumper. The lighting is sufficient to assess most surface areas.",
    
    // Fair scores (0.5-0.7)
    "The vehicle shows moderate wear with visible scratches on multiple panels and some minor dents. Paint has begun to fade in exposed areas.",
    "Several scratches and a small dent are visible on the driver's side door. The bumper shows signs of previous repairs.",
    
    // Poor scores (below 0.5)
    "The vehicle exhibits significant wear with deep scratches, dents, and visible rust spots that will negatively impact resale value.",
    "Major body damage is evident with possible structural issues. Paint is heavily faded and chipped in multiple areas."
  ];
  
  // Select appropriate explanation based on score
  if (score >= 0.85) {
    return explanations[Math.floor(Math.random() * 2)];
  } else if (score >= 0.7) {
    return explanations[2 + Math.floor(Math.random() * 2)];
  } else if (score >= 0.5) {
    return explanations[4 + Math.floor(Math.random() * 2)];
  } else {
    return explanations[6 + Math.floor(Math.random() * 2)];
  }
}
