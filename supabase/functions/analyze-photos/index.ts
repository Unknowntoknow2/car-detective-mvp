
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Import CORS headers from shared module
import { corsHeaders } from "../_shared/cors.ts";

// Configure OpenAI API
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
if (!OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY environment variable");
}

// Response types
interface ConditionAssessmentResult {
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  confidenceScore: number; // 0 to 100
  issuesDetected: string[]; // e.g., ['Front bumper scratches', 'Faded roof paint']
  aiSummary: string; // ~1 paragraph
}

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
    if (photos.length === 0) {
      return new Response(
        JSON.stringify({ error: "No photos uploaded" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    if (photos.length > 5) {
      return new Response(
        JSON.stringify({ error: "Maximum 5 photos allowed" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Validate file types and sizes
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const VALID_TYPES = ["image/jpeg", "image/jpg", "image/png"];
    
    for (const photo of photos) {
      if (!VALID_TYPES.includes(photo.type)) {
        return new Response(
          JSON.stringify({ 
            error: `Invalid file type: ${photo.type}. Only JPEG and PNG are accepted.`
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      if (photo.size > MAX_SIZE) {
        return new Response(
          JSON.stringify({ 
            error: `File too large: ${photo.name}. Maximum size is 10MB.`
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
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

    // Create the GPT-4o prompt with exact specification
    const systemPrompt = `You are a professional auto inspector and valuation expert.

Your task is to assess the visible condition of this car based on uploaded images. You must analyze paint quality, body panel alignment, dents, rust, scuffs, bumper condition, wheel wear, headlight clarity, and other signs of use.

Return your analysis in strict JSON using this structure:

{
  "condition": "Excellent" | "Good" | "Fair" | "Poor",
  "confidenceScore": number (0–100),
  "issuesDetected": [list of detected flaws, as short sentences],
  "aiSummary": "Short paragraph summarizing your conclusion."
}

Be objective. Do not inflate the condition. Prioritize truth and trust.`;

    const userPrompt = "Analyze these car photos and provide a condition assessment in the requested JSON format.";

    // Call OpenAI API with GPT-4o Vision
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              ...imageContents.map(image => ({
                type: "image_url",
                image_url: { url: image }
              }))
            ]
          }
        ],
        max_tokens: 1000
      })
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API error:", errorText);
      return new Response(
        JSON.stringify({ 
          error: "Failed to analyze photos. OpenAI service unavailable."
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const openaiData = await openaiResponse.json();
    console.log("OpenAI response received");

    // Parse the response content from GPT-4o
    const responseContent = openaiData.choices?.[0]?.message?.content;
    if (!responseContent) {
      console.error("Invalid OpenAI response format:", openaiData);
      return new Response(
        JSON.stringify({ 
          error: "Invalid response from AI service."
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Extract JSON from response (GPT might wrap it in markdown code blocks)
    let jsonText = responseContent;
    const jsonMatch = responseContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonText = jsonMatch[1];
    }

    // Parse JSON response
    let assessmentResult: ConditionAssessmentResult;
    try {
      assessmentResult = JSON.parse(jsonText);
      
      // Validate expected structure
      if (!assessmentResult.condition || !assessmentResult.confidenceScore || 
          !Array.isArray(assessmentResult.issuesDetected) || !assessmentResult.aiSummary) {
        throw new Error("Missing required fields in response");
      }
    } catch (error) {
      console.error("Error parsing AI response:", error, "Raw response:", responseContent);
      return new Response(
        JSON.stringify({ 
          error: "Invalid AI response. Please retry with clearer images.",
          rawResponse: responseContent
        }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Store the result in Supabase database (optional)
    try {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") || "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
      );

      const { data, error } = await supabaseClient
        .from("photo_scores")
        .insert({
          valuation_id: valuationId,
          score: assessmentResult.confidenceScore / 100, // Convert to 0-1 scale
          metadata: {
            condition: assessmentResult.condition,
            issuesDetected: assessmentResult.issuesDetected,
            aiSummary: assessmentResult.aiSummary,
            analysis_timestamp: new Date().toISOString(),
            photo_count: photos.length
          }
        })
        .select()
        .single();

      if (error) {
        console.error("Failed to store assessment result:", error);
      } else {
        console.log("Assessment stored with ID:", data.id);
        assessmentResult.id = data.id;
      }
    } catch (error) {
      console.error("Error storing assessment result:", error);
      // Continue execution even if storage fails
    }

    // Return the assessment result
    return new Response(
      JSON.stringify(assessmentResult),
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
