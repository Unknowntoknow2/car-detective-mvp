
import { supabase } from "@/integrations/supabase/client";
import { LegacyValuationResult } from "@/types/valuation";

export async function getValuationContext(
  valuationId?: string,
): Promise<Partial<LegacyValuationResult> | null> {
  if (!valuationId) return null;

  try {
    const { data, error } = await supabase
      .from("valuations")
      .select(`
        id,
        make,
        model,
        year,
        mileage,
        condition_score,
        confidence_score,
        state,
        color,
        body_type,
        estimated_value,
        premium_unlocked
      `)
      .eq("id", valuationId)
      .single();

    if (error) {
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      make: data.make,
      model: data.model,
      year: data.year,
      mileage: data.mileage,
      condition: mapConditionScore(data.condition_score),
      confidenceScore: data.confidence_score,
      color: data.color,
      bodyType: data.body_type,
      estimatedValue: data.estimated_value,
      isPremium: data.premium_unlocked,
    };
  } catch (error) {
    return null;
  }
}

function mapConditionScore(score?: number | null): string {
  if (!score) return "Unknown";

  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Poor";
}
