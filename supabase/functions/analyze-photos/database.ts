
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { ConditionAssessmentResult } from "./types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceRole) {
      console.error("Missing Supabase credentials");
      return false;
    }
    
    const adminClient = createClient(supabaseUrl, supabaseServiceRole);
    
    // Convert confidence score to 0-1 range for storage
    const normalizedScore = assessment.confidenceScore / 100;
    
    // Store in photo_scores table
    const { error } = await adminClient
      .from('photo_scores')
      .insert({
        valuation_id: valuationId,
        score: normalizedScore,
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
    
    // Also update the valuation with the AI condition score if confidence is high enough
    if (assessment.confidenceScore >= 70) {
      const conditionScoreMap = {
        'Excellent': 90,
        'Good': 75,
        'Fair': 60,
        'Poor': 40
      };
      
      const { error: updateError } = await adminClient
        .from('valuations')
        .update({
          condition_score: conditionScoreMap[assessment.condition] || 50
        })
        .eq('id', valuationId);
      
      if (updateError) {
        console.error('Error updating valuation condition:', updateError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Database error storing assessment:', error);
    return false;
  }
}
