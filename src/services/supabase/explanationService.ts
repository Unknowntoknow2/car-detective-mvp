import { supabase } from "@/integrations/supabase/client";

export interface ValuationExplanationData {
  valuationRequestId: string;
  explanationMarkdown: string;
  adjustmentFactors: {
    depreciation: number;
    mileage: number;
    condition: number;
    fuel: number;
    market: number;
  };
  confidenceBreakdown: {
    vinData: number;
    marketData: number;
    fuelData: number;
    overall: number;
  };
  sourceWeights: {
    [source: string]: number;
  };
  influentialComps?: any[];
  priceRangeExplanation?: string;
}

/**
 * Save AI explanation to the valuation_explanations table
 */
export async function saveValuationExplanation(data: ValuationExplanationData) {
  try {
    const { data: result, error } = await supabase
      .from('valuation_explanations')
      .insert({
        valuation_request_id: data.valuationRequestId,
        explanation_markdown: data.explanationMarkdown,
        adjustment_factors: data.adjustmentFactors,
        confidence_breakdown: data.confidenceBreakdown,
        source_weights: data.sourceWeights,
        influential_comps: data.influentialComps || [],
        price_range_explanation: data.priceRangeExplanation
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving valuation explanation:', error);
      throw error;
    }

    return result;
  } catch (error) {
    console.error('Failed to save valuation explanation:', error);
    throw error;
  }
}