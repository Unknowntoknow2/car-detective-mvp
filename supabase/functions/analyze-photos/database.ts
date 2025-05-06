
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { ConditionAssessmentResult } from "./types.ts";

/**
 * Stores the assessment result in the database
 */
export async function storeAssessmentResult(
  valuationId: string,
  assessment: ConditionAssessmentResult,
  photoCount: number
): Promise<boolean> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    // Use the service role key for admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Store the assessment in photo_condition_scores table
    const { error } = await supabase
      .from('photo_condition_scores')
      .insert({
        valuation_id: valuationId,
        condition_score: assessment.confidenceScore / 100, // Convert percentage to 0-1 value
        confidence_score: assessment.confidenceScore / 100,
        issues: assessment.issuesDetected || [],
        summary: assessment.aiSummary || ''
      });
    
    if (error) {
      console.error('Error storing assessment result:', error);
      return false;
    }
    
    // Optionally update the main valuation record
    const { error: updateError } = await supabase
      .from('valuations')
      .update({
        condition_score: Math.round(assessment.confidenceScore),
        // Only update confidence score if it's below 90
        confidence_score: (val: any) => 
          val < 90 ? Math.min(val + 7, 95) : val
      })
      .eq('id', valuationId);
    
    if (updateError) {
      console.error('Error updating valuation:', updateError);
      // Not critical, so we'll still return true
    }
    
    return true;
  } catch (error) {
    console.error('Exception storing assessment result:', error);
    return false;
  }
}
