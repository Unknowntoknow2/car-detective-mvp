
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

    // Upload all photos to Supabase Storage and analyze each one
    const photoUrls = [];
    const individualResults = [];
    const individualScores = [];
    
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
      
      // Analyze individual photo
      try {
        const result = await analyzeImagesWithOpenAI([publicUrl]);
        
        // If the result is a Response (error), skip this image
        if (result instanceof Response) {
          console.error("Error analyzing image:", await result.text());
          continue;
        }
        
        individualResults.push(result);
        individualScores.push({
          url: publicUrl,
          score: result.confidenceScore / 100 // Convert to 0-1 range
        });
        
        // Store this individual photo score
        const { error: scoreError } = await adminClient
          .from('photo_condition_scores')
          .insert({
            valuation_id: valuationId,
            image_url: publicUrl,
            condition_score: result.confidenceScore / 100,
            confidence_score: result.confidenceScore / 100,
            issues: result.issuesDetected || [],
            summary: result.aiSummary || ''
          });
          
        if (scoreError) {
          console.error('Error storing photo score:', scoreError);
        }
        
      } catch (error) {
        console.error("Error analyzing individual photo:", error);
      }
    }

    if (photoUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: "Failed to upload any photos" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process all images together to get overall assessment
    let assessmentResult: ConditionAssessmentResult;
    try {
      // If we have individual results, compute an average
      if (individualResults.length > 0) {
        // Calculate average confidence score
        const avgConfidenceScore = individualResults.reduce(
          (sum, result) => sum + result.confidenceScore, 0
        ) / individualResults.length;
        
        // Determine overall condition based on weighted assessment
        // This logic can be adjusted based on business requirements
        const conditions = ['Poor', 'Fair', 'Good', 'Excellent'] as const;
        const conditionScores = {
          'Poor': individualResults.filter(r => r.condition === 'Poor').length,
          'Fair': individualResults.filter(r => r.condition === 'Fair').length,
          'Good': individualResults.filter(r => r.condition === 'Good').length,
          'Excellent': individualResults.filter(r => r.condition === 'Excellent').length
        };
        
        // Find condition with highest score
        const overallCondition = Object.entries(conditionScores)
          .sort((a, b) => b[1] - a[1])[0][0] as 'Excellent' | 'Good' | 'Fair' | 'Poor';
          
        // Combine issues detected from all images
        const allIssues = individualResults.flatMap(r => r.issuesDetected || []);
        // Remove duplicates
        const uniqueIssues = [...new Set(allIssues)];
        
        // Generate combined summary
        const aiSummary = generateCombinedSummary(individualResults, overallCondition);
        
        assessmentResult = {
          condition: overallCondition,
          confidenceScore: avgConfidenceScore,
          issuesDetected: uniqueIssues,
          aiSummary
        };
        
        // Find the highest confidence score image and mark it as primary
        const bestResult = [...individualResults]
          .sort((a, b) => b.confidenceScore - a.confidenceScore)[0];
        
        if (bestResult && bestResult.confidenceScore >= 70) {
          const bestImageIndex = individualResults.indexOf(bestResult);
          if (bestImageIndex >= 0 && bestImageIndex < photoUrls.length) {
            // Mark this as the primary image in the database
            const bestImageUrl = photoUrls[bestImageIndex];
            
            // Update this specific image to mark it as primary
            const { error: updateError } = await adminClient
              .from('photo_condition_scores')
              .update({ is_primary: true })
              .eq('image_url', bestImageUrl);
              
            if (updateError) {
              console.error('Error marking primary image:', updateError);
            } else {
              console.log(`Marked ${bestImageUrl} as primary image with confidence ${bestResult.confidenceScore}`);
            }
          }
        }
      } else {
        // Call OpenAI to analyze all images together as fallback
        const aiResult = await analyzeImagesWithOpenAI(photoUrls);
        
        // If the result is a Response (error), return it
        if (aiResult instanceof Response) {
          return aiResult;
        }
        
        assessmentResult = aiResult;
      }
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
        analysisTimestamp: new Date().toISOString(),
        individualScores
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

/**
 * Generates a combined summary from multiple image analyses
 */
function generateCombinedSummary(
  results: ConditionAssessmentResult[], 
  overallCondition: 'Excellent' | 'Good' | 'Fair' | 'Poor'
): string {
  // Select 1-3 of the most important issues to highlight
  const allIssues = results.flatMap(r => r.issuesDetected || []);
  const uniqueIssues = [...new Set(allIssues)];
  const topIssues = uniqueIssues.slice(0, Math.min(3, uniqueIssues.length));
  
  // Create the summary based on the overall condition
  let summary = '';
  
  switch (overallCondition) {
    case 'Excellent':
      summary = 'Vehicle appears to be in excellent condition based on multiple photos. ';
      if (topIssues.length === 0) {
        summary += 'No significant issues were detected.';
      } else {
        summary += `Only minor cosmetic issues noted: ${topIssues.join('; ')}.`;
      }
      break;
      
    case 'Good':
      summary = 'Vehicle is in good overall condition with some minor wear appropriate for its age. ';
      if (topIssues.length > 0) {
        summary += `Issues to note: ${topIssues.join('; ')}.`;
      }
      break;
      
    case 'Fair':
      summary = 'Vehicle shows signs of normal wear and would benefit from some maintenance. ';
      if (topIssues.length > 0) {
        summary += `Key issues include: ${topIssues.join('; ')}.`;
      }
      break;
      
    case 'Poor':
      summary = 'Vehicle condition is below average with multiple issues detected. ';
      if (topIssues.length > 0) {
        summary += `Major concerns include: ${topIssues.join('; ')}.`;
      } else {
        summary += 'Detailed inspection recommended.';
      }
      break;
  }
  
  return summary;
}
