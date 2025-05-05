
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { ConditionAssessmentResult } from "./types.ts";

// Store the assessment result in Supabase
export async function storeAssessmentResult(
  valuationId: string, 
  assessmentResult: ConditionAssessmentResult,
  photoCount: number
): Promise<ConditionAssessmentResult> {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    const { data, error } = await supabaseClient
      .from("photo_scores")
      .insert({
        valuation_id: valuationId,
        score: assessmentResult.confidenceScore / 100, // Convert to 0-1 scale
        metadata: {
          condition: assessmentResult.condition,
          issuesDetected: assessmentResult.issuesDetected,
          aiSummary: assessmentResult.aiSummary,
          analysis_timestamp: new Date().toISOString(),
          photo_count: photoCount
        }
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to store assessment result:", error);
    } else {
      console.log("Assessment stored with ID:", data.id);
      assessmentResult.id = data.id;
    }
    
    return assessmentResult;
  } catch (error) {
    console.error("Error storing assessment result:", error);
    // Return the original assessment result even if storage fails
    return assessmentResult;
  }
}
