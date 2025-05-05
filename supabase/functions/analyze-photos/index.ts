
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { validatePhotos } from "./validation.ts";
import { analyzeImagesWithOpenAI } from "./openai-service.ts";
import { storeAssessmentResult } from "./database.ts";
import { ConditionAssessmentResult } from "./types.ts";

serve(async (req) => {
  // CORS preflight handler
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    console.log(`Processing request to ${url.pathname}`);

    // Only accept POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Check content type for multipart/form-data
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(
        JSON.stringify({ error: "Content type must be multipart/form-data" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const valuationId = formData.get("valuationId");
    
    if (!valuationId) {
      return new Response(
        JSON.stringify({ error: "Missing valuationId parameter" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Process uploaded photos
    const photos: File[] = [];
    formData.forEach((value, key) => {
      if (key.startsWith("photos") && value instanceof File) {
        photos.push(value);
      }
    });

    console.log(`Received ${photos.length} photos for valuation ID: ${valuationId}`);

    // Validate photos
    const { isValid, errorResponse } = validatePhotos(photos);
    if (!isValid && errorResponse) {
      return errorResponse;
    }

    // Prepare images for OpenAI API
    const imageContents = await Promise.all(
      photos.map(async (photo) => {
        const arrayBuffer = await photo.arrayBuffer();
        const base64 = btoa(
          String.fromCharCode(...new Uint8Array(arrayBuffer))
        );
        return `data:${photo.type};base64,${base64}`;
      })
    );

    // Call OpenAI API to analyze the images
    const analysisResult = await analyzeImagesWithOpenAI(imageContents);
    
    // If the result is a Response (error case), return it directly
    if (analysisResult instanceof Response) {
      return analysisResult;
    }

    // Store the result in Supabase database
    const finalResult = await storeAssessmentResult(
      valuationId.toString(), 
      analysisResult, 
      photos.length
    );

    // Return the assessment result
    return new Response(
      JSON.stringify(finalResult),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred analyzing the vehicle photos.",
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});

/* 
 * FINAL & COMPLETE
 * 
 * This is a production-ready Edge Function that:
 * 1. Accepts multiple car photos (1-5) via multipart/form-data
 * 2. Validates file types and sizes
 * 3. Sends images to GPT-4o with a structured prompt
 * 4. Returns a parsed JSON condition assessment
 * 5. Stores results in the photo_scores table for future reference
 * 6. Includes comprehensive error handling and validation
 */
