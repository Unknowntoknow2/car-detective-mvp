import { supabase } from "@/integrations/supabase/client";
// AIN-only implementation - no legacy dependencies

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
    // REMOVED: Hardcoded adjustments - these were misleading users
    // All adjustments should now come from the AdjustmentEngine with real sources
    const adjustments: any[] = []; // No longer using static adjustments

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