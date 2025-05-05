
import { supabase } from '@/integrations/supabase/client';
import { calculateFinalValuation } from './valuationCalculator';

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
    // Convert the valuation parameters to the format expected by our valuation calculator
    const valuationInput = {
      baseMarketValue: params.valuation * 0.85, // Estimate base value from final valuation
      vehicleYear: params.year,
      make: params.make,
      model: params.model,
      mileage: params.mileage,
      condition: params.condition as any,
      zipCode: params.location,
      features: [] // Default to empty features array
    };
    
    // Calculate valuation details to enhance the explanation
    const valuationDetails = calculateFinalValuation(valuationInput);
    
    // Extract the adjustments for the enhanced explanation
    const { mileageAdjustment, conditionAdjustment, regionalAdjustment } = valuationDetails.adjustments;
    const featureAdjTotal = Object.values(valuationDetails.adjustments.featureAdjustments).reduce((sum, val) => sum + val, 0);
    
    // Prepare the data to send to the explanation function
    const requestData = {
      ...params,
      baseMarketValue: valuationInput.baseMarketValue,
      mileageAdj: mileageAdjustment,
      conditionAdj: conditionAdjustment,
      zipAdj: regionalAdjustment,
      featureAdjTotal: featureAdjTotal,
      finalValuation: valuationDetails.finalValue || params.valuation,
      adjustments: valuationDetails.adjustments.map(adj => ({
        factor: adj.name,
        impact: adj.percentage,
        description: adj.description
      }))
    };
    
    // Call the Supabase Edge Function to generate the explanation
    const { data, error } = await supabase.functions.invoke('generate-explanation', {
      body: requestData,
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
