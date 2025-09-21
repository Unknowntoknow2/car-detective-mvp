
import { supabase } from "@/integrations/supabase/client";

export interface AIConditionResult {
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  confidenceScore: number;
  issuesDetected: string[];
  aiSummary: string;
}

export async function getConditionAnalysis(
  valuationId: string,
): Promise<AIConditionResult | null> {
  try {
    const { data, error } = await supabase
      .from("photo_condition_scores")
      .select("*")
      .eq("valuation_id", valuationId)
      .maybeSingle();

    if (error) {
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      condition: getConditionRating(data.condition_score || 0),
      confidenceScore: typeof data.confidence_score === "number"
        ? data.confidence_score
        : 0,
      issuesDetected: Array.isArray(data.issues)
        ? data.issues.map((issue: any) => String(issue))
        : [],
      aiSummary: typeof data.summary === "string" ? data.summary : "",
    };
  } catch (error) {
    return null;
  }
}

function getConditionRating(
  score: number,
): "Excellent" | "Good" | "Fair" | "Poor" {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Poor";
}
