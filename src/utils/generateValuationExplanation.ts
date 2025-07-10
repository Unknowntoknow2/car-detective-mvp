
import { supabase } from "@/integrations/supabase/client";
// Note: This file needs refactoring to use unifiedValuationEngine.ts
// Temporarily removed calculateFinalValuation dependency

interface ExplanationParams {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  location: string;
  valuation: number;
}

export async function generateValuationExplanation(params: ExplanationParams): Promise<string> {
  try {
    // TODO: Refactor to use unified valuation engine
    // For now, use basic structure for explanation generation
    const adjustments = [
      { factor: 'Depreciation', impact: -2000, description: 'Age-based depreciation' },
      { factor: 'Mileage', impact: -1000, description: 'Mileage adjustment' },
      { factor: 'Condition', impact: 500, description: 'Condition adjustment' }
    ];

    const { data, error } = await supabase.functions.invoke("generate-explanation", {
      body: {
        ...params,
        baseMarketValue: params.valuation,
        mileageAdj: 0,
        conditionAdj: 0,
        adjustments
      }
    });

    if (error) {
      throw new Error(`Failed to generate explanation: ${error.message}`);
    }

    if (!data?.explanation) {
      throw new Error("No explanation received from server");
    }

    return data.explanation;
  } catch (error: any) {
    throw new Error(`Failed to generate explanation: ${error.message}`);
  }
}
