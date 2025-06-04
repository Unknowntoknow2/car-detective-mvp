<<<<<<< HEAD
import { AICondition } from '@/types/photo';

/**
 * Enhances the AI condition analysis with additional formatting and safety checks.
 * @param aiCondition The AI condition object to enhance.
 * @returns An enhanced AI condition object with formatted data.
 */
export const enhanceConditionAnalysis = (aiCondition: AICondition | null): AICondition | null => {
  if (!aiCondition) {
=======
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
    // First, check if the photo_condition_scores table exists by trying to fetch data
    const { data, error } = await supabase
      .from("photo_condition_scores")
      .select("*")
      .eq("valuation_id", valuationId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching condition analysis:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Parse the data from the database record with proper type checks
    return {
      condition: getConditionRating(data.condition_score || 0),
      confidenceScore: typeof data.confidence_score === "number"
        ? data.confidence_score
        : 0,
      issuesDetected: Array.isArray(data.issues)
        ? data.issues.map((issue) => String(issue))
        : [],
      aiSummary: typeof data.summary === "string" ? data.summary : "",
    };
  } catch (error) {
    console.error("Unexpected error in getConditionAnalysis:", error);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    return null;
  }

<<<<<<< HEAD
  const { condition, confidenceScore, issuesDetected, summary } = aiCondition;

  // Format the confidence score to a percentage
  const formattedConfidence = confidenceScore ? `${(confidenceScore * 100).toFixed(0)}%` : 'N/A';

  // Ensure issuesDetected is an array and trim each issue
  const identifiedIssues = issuesDetected?.map((issue: string) => {
    // Process each issue
    return issue.trim();
  }) || [];

  // Construct a more descriptive summary if one doesn't exist
  const enhancedSummary = summary || `The vehicle is in ${condition} condition with a confidence of ${formattedConfidence}.`;

  return {
    condition,
    confidenceScore,
    issuesDetected: identifiedIssues,
    summary: enhancedSummary,
  };
};
=======
// Helper function to convert a condition score to a rating
function getConditionRating(
  score: number,
): "Excellent" | "Good" | "Fair" | "Poor" {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Poor";
}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
