
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { ConditionAssessmentResult } from "./types.ts";

/**
 * Stores photo assessment result in the database
 */
export async function storeAssessmentResult(
  valuationId: string, 
  assessment: ConditionAssessmentResult,
  photoCount: number
): Promise<boolean> {
  try {
    // Set up Supabase admin client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const adminClient = createClient(supabaseUrl, supabaseServiceRole);
    
    // Store the overall assessment in photo_scores table
    const { error } = await adminClient
      .from('photo_scores')
      .insert({
        valuation_id: valuationId,
        score: assessment.confidenceScore / 100, // Convert to 0-1 scale
        metadata: {
          condition: assessment.condition,
          confidenceScore: assessment.confidenceScore,
          issuesDetected: assessment.issuesDetected,
          aiSummary: assessment.aiSummary,
          photoCount
        }
      });
    
    if (error) {
      console.error('Error storing assessment result:', error);
      return false;
    }
    
    // Update the valuation with condition score if confidence is high enough
    if (assessment.confidenceScore >= 70) {
      const conditionScoreValue = 
        assessment.condition === 'Excellent' ? 90 :
        assessment.condition === 'Good' ? 75 :
        assessment.condition === 'Fair' ? 60 : 40;
        
      const { error: updateError } = await adminClient
        .from('valuations')
        .update({ 
          condition_score: conditionScoreValue
        })
        .eq('id', valuationId);
      
      if (updateError) {
        console.error('Error updating valuation condition score:', updateError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in storeAssessmentResult:', error);
    return false;
  }
}
