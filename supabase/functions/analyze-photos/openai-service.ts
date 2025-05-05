
import { corsHeaders } from "../_shared/cors.ts";
import { ConditionAssessmentResult } from "./types.ts";

// Configure OpenAI API
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

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

const USER_PROMPT = "Analyze these car photos and provide a condition assessment in the requested JSON format.";

// Call OpenAI API to analyze images
export async function analyzeImagesWithOpenAI(imageContents: string[]): Promise<ConditionAssessmentResult | Response> {
  if (!OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY environment variable");
    return new Response(
      JSON.stringify({ 
        error: "OpenAI API key is not configured on the server."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  try {
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
              { type: "text", text: USER_PROMPT },
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

    return assessmentResult;
  } catch (error) {
    console.error("OpenAI service error:", error);
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
}
