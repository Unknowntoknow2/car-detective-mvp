
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// System prompt for GPT-4o Vision
const SYSTEM_PROMPT = `You are a professional auto inspector and valuation expert.

Your task is to assess the visible condition of this car based on uploaded images. You must analyze paint quality, body panel alignment, dents, rust, scuffs, bumper condition, wheel wear, headlight clarity, and other signs of use.

Return your analysis in strict JSON using this structure:

{
  "condition": "Excellent" | "Good" | "Fair" | "Poor",
  "confidenceScore": number (0–100),
  "issuesDetected": [list of detected flaws, as short sentences],
  "aiSummary": "Short paragraph summarizing your conclusion."
}

Be objective. Do not inflate the condition. Prioritize truth and trust.`;

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

    // Check for API key
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key is not configured" }),
        {
          status: 500,
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

    // Get photos from form data
    const photos: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("photos[") && value instanceof File) {
        photos.push(value);
      }
    }

    if (photos.length === 0) {
      return new Response(
        JSON.stringify({ error: "No photos provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log(`Received ${photos.length} photos for valuation ID: ${valuationId}`);

    // Prepare images for OpenAI API
    const imageContents = await Promise.all(
      photos.map(async (photo) => {
        const arrayBuffer = await photo.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        return `data:${photo.type};base64,${base64}`;
      })
    );

    // Call OpenAI API
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
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze these car photos and provide a condition assessment." },
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
        JSON.stringify({ error: "Failed to analyze photos with AI" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const data = await openaiResponse.json();
    const content = data.choices[0].message.content;

    // Parse the JSON response
    let assessment;
    try {
      // Extract JSON from content (in case it's wrapped in markdown)
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, content];
      const jsonContent = jsonMatch[1];
      assessment = JSON.parse(jsonContent);
      
      if (!assessment.condition || !assessment.confidenceScore || 
          !Array.isArray(assessment.issuesDetected) || !assessment.aiSummary) {
        throw new Error("Invalid response format from OpenAI");
      }
    } catch (error) {
      console.error("Failed to parse OpenAI response:", error, content);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response", content }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Save the assessment to Supabase
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      try {
        // Store assessment in photo_scores table
        const { error } = await supabase
          .from('photo_scores')
          .insert({
            valuation_id: valuationId,
            score: assessment.confidenceScore / 100, // Store as decimal between 0-1
            metadata: {
              condition: assessment.condition,
              confidenceScore: assessment.confidenceScore,
              issuesDetected: assessment.issuesDetected,
              aiSummary: assessment.aiSummary,
              photo_count: photos.length,
              analysis_timestamp: new Date().toISOString()
            }
          });
          
        if (error) {
          console.error("Supabase insert error:", error);
        }
      } catch (dbError) {
        console.error("Database operation failed:", dbError);
      }
    }

    return new Response(
      JSON.stringify(assessment),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
