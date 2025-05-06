
import { supabase } from '@/integrations/supabase/client';
import { AICondition, PhotoScore } from '@/types/photo';

/**
 * Gets the best photo assessment for a valuation
 * Returns the highest confidence score assessment
 */
export async function getBestPhotoAssessment(valuationId: string): Promise<{
  aiCondition: AICondition | null;
  photoScores: PhotoScore[];
}> {
  try {
    if (!valuationId) {
      return { aiCondition: null, photoScores: [] };
    }
    
    // Get photo scores from the database
    const { data: scoreData, error: scoreError } = await supabase
      .from('photo_condition_scores')
      .select('*')
      .eq('valuation_id', valuationId)
      .order('confidence_score', { ascending: false });
      
    if (scoreError || !scoreData || scoreData.length === 0) {
      if (scoreError) {
        console.error('Error loading photo scores:', scoreError);
      }
      return { aiCondition: null, photoScores: [] };
    }
    
    // Get highest confidence score that meets minimum threshold (70%)
    const bestScore = scoreData.find(score => score.confidence_score >= 0.7);
    
    // Convert scores to PhotoScore format
    const photoScores: PhotoScore[] = scoreData.map(score => {
      // Safely handle image URL which could be in different fields
      let imageUrl = '';
      
      if ('photo_url' in score) {
        imageUrl = score.photo_url as string;
      } else if ('image_url' in score) {
        const typedScore = score as unknown as { image_url: string };
        imageUrl = typedScore.image_url;
      }
      
      return {
        url: imageUrl || '',
        score: score.condition_score || 0
      };
    }).filter(s => s.url); // Filter out any items with empty URLs
    
    let aiCondition: AICondition | null = null;
    
    // If we have a best score, create the AI condition
    if (bestScore) {
      aiCondition = {
        condition: bestScore.condition_score >= 0.8 ? 'Excellent' : 
                  bestScore.condition_score >= 0.6 ? 'Good' : 
                  bestScore.condition_score >= 0.4 ? 'Fair' : 'Poor',
        confidenceScore: Math.round(bestScore.confidence_score * 100),
        issuesDetected: Array.isArray(bestScore.issues) ? 
          bestScore.issues.map(issue => String(issue)) : [], // Convert to string array
        aiSummary: bestScore.summary || undefined
      };
    }
    
    return { 
      aiCondition, 
      photoScores 
    };
  } catch (err) {
    console.error('Error loading photo assessment:', err);
    return { aiCondition: null, photoScores: [] };
  }
}

/**
 * Updates the best photo URL for a valuation
 */
export async function updateBestPhotoUrl(valuationId: string, photoUrl: string): Promise<void> {
  try {
    if (!valuationId || !photoUrl) {
      console.error('Missing valuationId or photoUrl for updateBestPhotoUrl');
      return;
    }
    
    // Update the valuation record with the best photo URL
    const { error } = await supabase
      .from('valuations')
      .update({ best_photo_url: photoUrl })
      .eq('id', valuationId);
      
    if (error) {
      console.error('Error updating best photo URL:', error);
    }
  } catch (err) {
    console.error('Error in updateBestPhotoUrl:', err);
  }
}

/**
 * Saves AI condition assessment to a valuation
 */
export async function saveAIConditionAssessment(
  valuationId: string,
  condition: AICondition
): Promise<void> {
  try {
    if (!valuationId || !condition) {
      console.error('Missing valuationId or condition for saveAIConditionAssessment');
      return;
    }
    
    // Update the valuation record with AI condition data
    const { error } = await supabase
      .from('valuations')
      .update({
        ai_condition: {
          condition: condition.condition,
          confidenceScore: condition.confidenceScore,
          issuesDetected: condition.issuesDetected || [],
          aiSummary: condition.aiSummary || ''
        }
      })
      .eq('id', valuationId);
      
    if (error) {
      console.error('Error saving AI condition assessment:', error);
    }
  } catch (err) {
    console.error('Error in saveAIConditionAssessment:', err);
  }
}
