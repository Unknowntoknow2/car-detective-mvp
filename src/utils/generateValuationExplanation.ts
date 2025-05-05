
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

export async function generateValuationExplanation(params: ValuationParams): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-explanation', {
      body: params,
    });

    if (error) {
      throw new Error(error.message || 'Failed to generate explanation');
    }

    if (!data || !data.explanation) {
      throw new Error('No explanation received from server');
    }

    return data.explanation;
  } catch (error: any) {
    console.error('Error generating valuation explanation:', error);
    throw new Error(`Failed to generate explanation: ${error.message}`);
  }
}
