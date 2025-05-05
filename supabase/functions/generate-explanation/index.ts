
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

type AdjustmentFactor = {
  factor: string;
  impact: number;
  description: string;
};

interface ExplanationRequest {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  location: string;
  zipCode?: string; // For compatibility
  baseMarketValue: number;
  mileageAdj?: number;
  conditionAdj?: number;
  zipAdj?: number;
  featureAdjTotal?: number;
  finalValuation: number;
  adjustments?: AdjustmentFactor[];
}

// Define response type
interface ExplanationResponse {
  explanation: string;
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

/**
 * Generates an explanation using OpenAI's GPT-4o model
 * @param data The valuation data
 * @returns A professional explanation string from GPT-4o
 */
async function generateGPT4Explanation(data: ExplanationRequest): Promise<string> {
  try {
    const { 
      make, model, year, mileage, condition, zipCode = data.location, 
      baseMarketValue, finalValuation, adjustments,
      mileageAdj = 0, conditionAdj = 0, zipAdj = 0, featureAdjTotal = 0
    } = data;
    
    // Create system prompt for professional tone
    const systemPrompt = `
You are a world-class vehicle pricing analyst. Your job is to explain clearly, honestly, and concisely why a car received the valuation it did. You must sound neutral, professional, and trustworthy.

Avoid hype or fluff — this is for a user who may sell a $20,000+ asset. Show them that the pricing is thoughtful, not random.

Return the explanation in 3 paragraphs:

1. Base market price and overview.
2. Key adjustments (mileage, condition, ZIP, features).
3. Final recommendation or insight.

End the explanation with a confident tone that this valuation is fair and market-based.
`;

    // Create user prompt with structured data
    const userPrompt = `
Vehicle: ${year} ${make} ${model}
Mileage: ${mileage.toLocaleString()} miles
Condition: ${condition}
ZIP Code: ${zipCode}
Base Market Price: $${baseMarketValue.toLocaleString()}

Adjustments:
* Mileage Adjustment: $${mileageAdj.toLocaleString()}
* Condition Adjustment: $${conditionAdj.toLocaleString()}
* ZIP Regional Adjustment: $${zipAdj.toLocaleString()}
* Feature Adjustments: $${featureAdjTotal.toLocaleString()}

Final Valuation: $${finalValuation.toLocaleString()}

Explain this to a car owner with transparency, so they understand how the price was formed.
`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return result.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating GPT-4o explanation:', error);
    return "We're unable to generate the explanation right now. Please try again later.";
  }
}

/**
 * Generates a detailed explanation of the vehicle valuation (fallback method)
 * @param data The valuation data
 * @returns A detailed explanation string
 */
function generateDetailedExplanation(data: ExplanationRequest): string {
  const { make, model, year, mileage, condition, zipCode, finalValuation, adjustments } = data;
  
  // Calculate vehicle age
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;

  // Start with a general introduction
  let explanation = `# Valuation Analysis: ${year} ${make} ${model}\n\n`;
  
  explanation += `Your ${year} ${make} ${model} has been valued at $${finalValuation.toLocaleString()} based on a comprehensive analysis of multiple factors including its age, mileage, condition, and location.\n\n`;
  
  // Add sections for each major factor
  explanation += `## Vehicle Overview\n`;
  explanation += `This ${year} ${make} ${model} is ${vehicleAge} years old with ${mileage.toLocaleString()} miles, which is `;
  
  // Comment on mileage relative to age
  const averageMileagePerYear = 12000;
  const expectedMileage = vehicleAge * averageMileagePerYear;
  if (mileage < expectedMileage * 0.8) {
    explanation += `significantly below average for its age (${expectedMileage.toLocaleString()} miles would be typical). This positively impacts its value.\n\n`;
  } else if (mileage < expectedMileage * 1.1) {
    explanation += `close to the average for its age (${expectedMileage.toLocaleString()} miles would be typical).\n\n`;
  } else {
    explanation += `above average for its age (${expectedMileage.toLocaleString()} miles would be typical). This somewhat reduces its value.\n\n`;
  }
  
  // Condition assessment
  explanation += `## Condition Assessment\n`;
  explanation += `The vehicle is reported to be in ${condition} condition. `;
  
  switch (condition.toLowerCase()) {
    case 'excellent':
      explanation += `Excellent condition means the vehicle shows minimal wear and tear, has been meticulously maintained, and requires no reconditioning. This significantly enhances its market value compared to similar vehicles in average condition.\n\n`;
      break;
    case 'good':
      explanation += `Good condition indicates the vehicle has been well-maintained with only minor cosmetic flaws and no significant mechanical issues. This is the baseline condition expected for a vehicle of this age.\n\n`;
      break;
    case 'fair':
      explanation += `Fair condition suggests the vehicle has noticeable wear and tear, may have some cosmetic defects, and might require minor mechanical repairs. This condition reduces its value compared to similar vehicles in good condition.\n\n`;
      break;
    case 'poor':
      explanation += `Poor condition indicates significant cosmetic and/or mechanical issues that require substantial repair. This condition significantly reduces its market value compared to similar vehicles in better condition.\n\n`;
      break;
    default:
      explanation += `This is considered the standard benchmark for valuation purposes.\n\n`;
  }
  
  // Market factors
  explanation += `## Market Factors\n`;
  explanation += `The ${make} ${model} has `;
  
  // Make/model specific comments (simplified)
  if (['Toyota', 'Honda', 'Lexus'].includes(make)) {
    explanation += `a reputation for reliability and strong resale value. `;
  } else if (['BMW', 'Mercedes-Benz', 'Audi'].includes(make)) {
    explanation += `a premium brand value but typically experiences steeper depreciation in the first few years. `;
  } else if (make === 'Tesla') {
    explanation += `strong demand in the electric vehicle market with generally good value retention. `;
  }
  
  // Location impact
  explanation += `Your location (ZIP: ${zipCode}) is in `;
  
  // Simplified location assessment - would be replaced with actual regional data
  const highDemandZips = ['90210', '10001', '94102', '98101', '33139'];
  if (highDemandZips.includes(zipCode)) {
    explanation += `an area with high vehicle demand, positively affecting the valuation.\n\n`;
  } else {
    explanation += `a market with typical demand patterns for this vehicle.\n\n`;
  }
  
  // Detailed adjustment breakdown
  if (adjustments && adjustments.length > 0) {
    explanation += `## Value Adjustment Factors\n`;
    explanation += `The following specific factors were considered in this valuation:\n\n`;
    
    adjustments.forEach(adj => {
      const impact = adj.impact.toFixed(1);
      const direction = adj.impact >= 0 ? 'Increases' : 'Decreases';
      explanation += `- **${adj.factor}**: ${direction} value by ${Math.abs(Number(impact))}%. ${adj.description}\n`;
    });
    
    explanation += `\n`;
  }
  
  // Future value projection
  explanation += `## Market Outlook\n`;
  explanation += `Based on current market trends, `;
  
  if (vehicleAge < 3) {
    explanation += `this vehicle is still in its steeper depreciation phase and will likely continue to depreciate at a rate of approximately 15-20% per year for the next two years.\n\n`;
  } else if (vehicleAge < 7) {
    explanation += `this vehicle has passed its steepest depreciation phase and will likely depreciate at a more moderate rate of 8-12% per year for the next few years.\n\n`;
  } else {
    explanation += `this vehicle has already experienced most of its depreciation and will likely depreciate at a slower rate of 5-8% per year going forward.\n\n`;
  }
  
  // Conclusion
  explanation += `## Summary\n`;
  explanation += `The valuation of $${finalValuation.toLocaleString()} represents a fair market value for your ${year} ${make} ${model} based on its specific configuration, condition, and market factors. This valuation reflects what you could reasonably expect to receive in a private party sale to an informed buyer in your market.`;
  
  return explanation;
}
