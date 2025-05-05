
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
  valuation: number;
  adjustments?: AdjustmentFactor[];
}

// Define response type
interface ExplanationResponse {
  explanation: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const requestData: ExplanationRequest = await req.json();
    const { make, model, year, mileage, condition, location, valuation, adjustments } = requestData;

    // Validate required fields
    if (!make || !model || !year || !valuation) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate meaningful explanation based on the vehicle data
    const explanation = generateDetailedExplanation(requestData);

    // Return the explanation
    const response: ExplanationResponse = { explanation };
    
    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating explanation:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to generate explanation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Generates a detailed explanation of the vehicle valuation
 * @param data The valuation data
 * @returns A detailed explanation string
 */
function generateDetailedExplanation(data: ExplanationRequest): string {
  const { make, model, year, mileage, condition, location, valuation, adjustments } = data;
  
  // Calculate vehicle age
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;

  // Start with a general introduction
  let explanation = `# Valuation Analysis: ${year} ${make} ${model}\n\n`;
  
  explanation += `Your ${year} ${make} ${model} has been valued at $${valuation.toLocaleString()} based on a comprehensive analysis of multiple factors including its age, mileage, condition, and location.\n\n`;
  
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
  explanation += `Your location (ZIP: ${location}) is in `;
  
  // Simplified location assessment - would be replaced with actual regional data
  const highDemandZips = ['90210', '10001', '94102', '98101', '33139'];
  if (highDemandZips.includes(location)) {
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
  explanation += `The valuation of $${valuation.toLocaleString()} represents a fair market value for your ${year} ${make} ${model} based on its specific configuration, condition, and market factors. This valuation reflects what you could reasonably expect to receive in a private party sale to an informed buyer in your market.`;
  
  return explanation;
}
