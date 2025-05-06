
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

    // Store the score in the database
    const { data, error } = await adminClient
      .from('photo_scores')
      .insert({
        valuation_id: valuationId,
        score: score,
        thumbnail_url: publicUrl,
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

    // Return the score and image URL
    return new Response(
      JSON.stringify({ 
        score, 
        url: publicUrl,
        analysisTimestamp: new Date().toISOString(),
        id: data?.id,
        bestPhoto: isBestPhoto
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

// Helper function to convert base64 to Uint8Array
function base64ToUint8Array(base64String: string): Uint8Array {
  const binary = atob(base64String);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
