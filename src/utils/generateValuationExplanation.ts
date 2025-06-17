
import { supabase } from "@/integrations/supabase/client";
import { calculateFinalValuation } from "./valuationCalculator";

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
    const valuationDetails = calculateFinalValuation(params);
    
    const { data, error } = await supabase.functions.invoke("generate-explanation", {
      body: {
        ...params,
        baseMarketValue: valuationDetails.baseValue,
        mileageAdj: 0,
        conditionAdj: 0,
        adjustments: valuationDetails.adjustments.map(adj => ({
          factor: adj.name || 'Unknown',
          impact: adj.impact || 0,
          description: adj.description || 'No description'
        }))
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
