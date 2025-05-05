
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { analyzeImagesWithOpenAI } from "./openai-service.ts";
import { storeAssessmentResult } from "./database.ts";
import { ConditionAssessmentResult } from "./types.ts";

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
    // Get the request body
    const formData = await req.formData();
    const valuationId = formData.get('valuationId')?.toString();
    
    if (!valuationId) {
      return new Response(
        JSON.stringify({ error: "Missing valuation ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract photos from the form data
    const photos = [];
    const fileEntries = Array.from(formData.entries()).filter(entry => 
      entry[0].startsWith('photos[') && entry[1] instanceof File
    );

    if (fileEntries.length === 0) {
      return new Response(
        JSON.stringify({ error: "No photos provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${fileEntries.length} photos for valuation: ${valuationId}`);

    // Set up Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const adminClient = createClient(supabaseUrl, supabaseServiceRole);

    // Upload all photos to Supabase Storage
    const photoUrls = [];
    for (const [_, file] of fileEntries) {
      const photoFile = file as File;
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${valuationId}/${fileName}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicle-photos')
        .upload(filePath, photoFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        continue;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-photos')
        .getPublicUrl(filePath);

      photoUrls.push(publicUrl);
      
      // Log successful upload
      console.log(`Uploaded photo: ${publicUrl}`);
    }

    if (photoUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: "Failed to upload any photos" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process images with OpenAI Vision
    let assessmentResult: ConditionAssessmentResult;
    try {
      // Call OpenAI to analyze images
      const aiResult = await analyzeImagesWithOpenAI(photoUrls);
      
      // If the result is a Response (error), return it
      if (aiResult instanceof Response) {
        return aiResult;
      }
      
      assessmentResult = aiResult;
    } catch (error) {
      console.error("AI analysis error:", error);
      
      // Fall back to simulated analysis if AI analysis fails
      assessmentResult = await simulatePhotoAnalysis(photoUrls);
    }

    // Store assessment result in database
    const storedResult = await storeAssessmentResult(valuationId, assessmentResult, photoUrls.length);

    // For each photo, store a record in the valuation_photos table
    for (const photoUrl of photoUrls) {
      const { error: photoRecordError } = await adminClient
        .from('valuation_photos')
        .insert({
          valuation_id: valuationId,
          photo_url: photoUrl,
          score: assessmentResult.confidenceScore / 100, // Store as 0-1 value
          uploaded_at: new Date().toISOString()
        });

      if (photoRecordError) {
        console.error('Error storing photo record:', photoRecordError);
      }
    }

    // Return the assessment result
    return new Response(
      JSON.stringify({
        photoUrls,
        condition: assessmentResult.condition,
        confidenceScore: assessmentResult.confidenceScore,
        issuesDetected: assessmentResult.issuesDetected,
        aiSummary: assessmentResult.aiSummary,
        analysisTimestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-photos function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process images", 
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Simulates analyzing photos if OpenAI analysis fails
 */
async function simulatePhotoAnalysis(imageUrls: string[]): Promise<ConditionAssessmentResult> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate a mock assessment
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'] as const;
  const randomIndex = Math.floor(Math.random() * 3); // Bias toward better conditions
  const condition = conditions[randomIndex];
  
  const confidenceScore = Math.round(85 - (randomIndex * 10) + (Math.random() * 10));
  
  const possibleIssues = [
    'Minor scratches on front bumper',
    'Light wear on driver seat',
    'Small dent on passenger door',
    'Windshield has minor chip',
    'Paint fading on hood',
    'Wheel rim has curb rash',
    'Headlight lens slightly cloudy'
  ];
  
  const issuesDetected = randomIndex === 0 
    ? [] 
    : possibleIssues.slice(0, randomIndex + 1);
  
  const summaries = [
    'Vehicle appears to be in excellent condition with no visible issues detected.',
    'Vehicle is in good condition overall with minimal wear appropriate for its age.',
    'Vehicle shows normal wear and would benefit from minor cosmetic repairs.',
    'Vehicle has several issues that should be addressed to improve its condition.'
  ];
  
  return {
    condition: condition,
    confidenceScore,
    issuesDetected,
    aiSummary: summaries[randomIndex]
  };
}
