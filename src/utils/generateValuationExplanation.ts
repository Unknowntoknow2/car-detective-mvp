
import { supabase } from '@/integrations/supabase/client';

interface ValuationParams {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  location: string;
  valuation: number;
}

/**
 * Generates a human-readable explanation for a vehicle valuation result
 * @param params The vehicle and valuation parameters
 * @returns A string explanation of the valuation
 */
export async function generateValuationExplanation(params: ValuationParams): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-explanation', {
      body: params
    });

    if (error) {
      console.error('Error calling explanation function:', error);
      throw new Error(`Failed to generate explanation: ${error.message}`);
    }

    if (!data || !data.explanation) {
      throw new Error('No explanation was generated');
    }

    return data.explanation;
  } catch (err) {
    console.error('Error generating explanation:', err);
    // Provide a fallback explanation if the API call fails
    const currentYear = new Date().getFullYear();
    const age = currentYear - params.year;
    
    // Generate a basic explanation based on the provided parameters
    return `Your ${params.year} ${params.make} ${params.model} is ${age} years old with ${params.mileage.toLocaleString()} miles, which is a key factor in its valuation. The ${params.condition.toLowerCase()} condition and market demand in ${params.location} also contribute to the estimated value of $${params.valuation.toLocaleString()}.`;
  }
}
