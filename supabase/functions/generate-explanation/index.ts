
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from './cors.ts';
import { ExplanationRequest, ExplanationResponse } from './types.ts';
import { generateGPT4Explanation } from './gptGenerator.ts';
import { generateDetailedExplanation } from './fallbackGenerator.ts';

/**
 * Main handler for the generate-explanation edge function
 */
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const requestData: ExplanationRequest = await req.json();
    const { 
      make, model, year, mileage, condition, location, zipCode = location, 
      baseMarketValue, finalValuation, adjustments,
      mileageAdj = 0, conditionAdj = 0, zipAdj = 0, featureAdjTotal = 0
    } = requestData;

    // Validate required fields
    if (!make || !model || !year || !finalValuation) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let explanation: string;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    // Use OpenAI's GPT-4o model if API key is available
    if (openAIApiKey) {
      explanation = await generateGPT4Explanation(requestData);
    } else {
      // Fallback to the deterministic explanation generator if no API key is available
      explanation = generateDetailedExplanation(requestData);
      console.warn('Using fallback explanation generator because OPENAI_API_KEY is not set');
    }

    // Return the explanation
    const response: ExplanationResponse = { explanation };
    
    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating explanation:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to generate explanation', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
