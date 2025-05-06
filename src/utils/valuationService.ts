
import { supabase } from "@/integrations/supabase/client";
import { AICondition, PhotoScore } from "@/types/photo";

/**
 * Get the best photo assessment for a valuation including AI condition data and photo scores
 * 
 * @param valuationId The valuation ID to get photo assessment for
 * @returns Object containing AI condition assessment and photo scores
 */
export async function getBestPhotoAssessment(valuationId: string): Promise<{
  aiCondition: AICondition | null,
  photoScores: PhotoScore[]
}> {
  try {
    // Check for condition data in photo_condition_scores table
    const { data: conditionData, error: conditionError } = await supabase
      .from('photo_condition_scores')
      .select('*')
      .eq('valuation_id', valuationId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (conditionError) {
      console.error('Error fetching photo condition scores:', conditionError);
    }
    
    // Get photo scores
    const { data: photoData, error: photoError } = await supabase
      .from('photo_scores')
      .select('*')
      .eq('valuation_id', valuationId)
      .order('score', { ascending: false });
      
    if (photoError) {
      console.error('Error fetching photo scores:', photoError);
    }
    
    // Process condition data
    let aiCondition: AICondition | null = null;
    if (conditionData) {
      aiCondition = {
        condition: getConditionRating(conditionData.condition_score),
        confidenceScore: conditionData.confidence_score || 0,
        issuesDetected: Array.isArray(conditionData.issues) ? conditionData.issues : [],
        aiSummary: conditionData.summary || ''
      };
    } else {
      // Check in photo_scores.metadata as fallback
      const primaryPhoto = photoData?.find(p => p.metadata?.isPrimary) || photoData?.[0];
      if (primaryPhoto?.metadata?.condition) {
        const metadata = primaryPhoto.metadata;
        aiCondition = {
          condition: metadata.condition,
          confidenceScore: metadata.confidenceScore || 0,
          issuesDetected: metadata.issuesDetected || [],
          aiSummary: metadata.aiSummary || ''
        };
      }
    }
    
    // Process photo scores
    const photoScores: PhotoScore[] = (photoData || []).map(photo => ({
      url: photo.thumbnail_url || '',
      score: photo.score || 0,
      isPrimary: photo.metadata?.isPrimary || false
    }));
    
    return {
      aiCondition,
      photoScores
    };
  } catch (err) {
    console.error('Error in getBestPhotoAssessment:', err);
    return {
      aiCondition: null,
      photoScores: []
    };
  }
}

/**
 * Convert a numeric condition score to a text rating
 */
function getConditionRating(score: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}
