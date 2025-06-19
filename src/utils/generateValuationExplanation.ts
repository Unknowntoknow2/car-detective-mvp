
import { supabase } from "@/integrations/supabase/client";
import { calculateFinalValuation } from "./valuation/valuationCalculator";
import { AdjustmentBreakdown } from '@/types/valuation';

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
    const valuationDetails = await calculateFinalValuation({
      make: params.make,
      model: params.model,
      year: params.year,
      mileage: params.mileage,
      condition: params.condition,
      zipCode: params.location
    });
    
    const adjustments = (valuationDetails.adjustments || []).map((adj: AdjustmentBreakdown) => ({
      factor: adj.name || adj.factor || 'Unknown',
      impact: adj.impact || adj.value || 0,
      description: adj.description || 'No description'
    }));

    const { data, error } = await supabase.functions.invoke("generate-explanation", {
      body: {
        ...params,
        baseMarketValue: valuationDetails.baseValue,
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
