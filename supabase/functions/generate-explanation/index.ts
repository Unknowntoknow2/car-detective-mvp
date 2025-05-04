
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define the request interface
interface ValuationParams {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  location: string;
  valuation: number;
}

// Setup CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define the handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the OpenAI API key from environment variables
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      throw new Error("OPENAI_API_KEY is not set in environment variables");
    }

    // Parse the request body
    const params: ValuationParams = await req.json();
    const { make, model, year, mileage, condition, location, valuation } = params;

    // Validate required fields
    if (!make || !model || !year || !mileage || !condition || !location || !valuation) {
      throw new Error("Missing required parameters");
    }

    // Call OpenAI API to generate an explanation
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert in vehicle valuation. Explain in a professional, concise manner why a vehicle has a specific value based on the provided data. Focus on make, model, year, mileage, condition, and location factors. Keep your explanation under 150 words and write in the second person. Don't use bullet points.`
          },
          {
            role: "user",
            content: `Please explain why a ${year} ${make} ${model} with ${mileage.toLocaleString()} miles in ${condition} condition located in ${location} is valued at $${valuation.toLocaleString()}.`
          }
        ],
        temperature: 0.7,
        max_tokens: 250,
      }),
    });

    const result = await response.json();
    
    // Log the response for debugging
    console.log("OpenAI response:", JSON.stringify(result));
    
    if (result.error) {
      throw new Error(`OpenAI API error: ${result.error.message}`);
    }

    const explanation = result.choices[0].message.content.trim();

    // Return the explanation
    return new Response(
      JSON.stringify({ explanation }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error generating explanation:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
