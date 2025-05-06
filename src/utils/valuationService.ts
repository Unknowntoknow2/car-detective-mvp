
import { supabase } from '@/integrations/supabase/client';
import { AICondition, PhotoScore } from '@/types/photo';
import { Valuation } from '@/types/valuation-history';

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
      
      // Check if these properties exist and handle them safely
      if ('photo_url' in score && (score as any).photo_url) {
        imageUrl = (score as any).photo_url as string;
      } else if ('image_url' in score && (score as any).image_url) {
        imageUrl = (score as any).image_url as string;
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
          bestScore.issues.map((issue: any) => String(issue)) : [], // Convert to string array
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
    
    // Update the valuations table directly with the best photo URL
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
    
    // Update the valuations table directly with the AI condition assessment data
    const { error } = await supabase
      .from('valuations')
      .update({
        condition: condition.condition,
        condition_score: condition.confidenceScore,
        ai_summary: condition.aiSummary || '',
        issues_detected: condition.issuesDetected || []
      })
      .eq('id', valuationId);
      
    if (error) {
      console.error('Error saving AI condition assessment:', error);
    }
  } catch (err) {
    console.error('Error in saveAIConditionAssessment:', err);
  }
}

/**
 * Get user's regular valuations
 */
export async function getUserValuations(userId: string): Promise<Valuation[]> {
  try {
    if (!userId) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('valuations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user valuations:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getUserValuations:', err);
    return [];
  }
}

/**
 * Get user's saved valuations
 */
export async function getSavedValuations(userId: string): Promise<Valuation[]> {
  try {
    if (!userId) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('saved_valuations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching saved valuations:', error);
      return [];
    }
    
    // Transform saved_valuations to match Valuation interface
    return (data || []).map(item => ({
      id: item.id,
      created_at: item.created_at,
      make: item.make,
      model: item.model,
      year: item.year,
      vin: item.vin,
      valuation: item.valuation,
      estimated_value: item.valuation,
      is_premium: false,
      premium_unlocked: false
    }));
  } catch (err) {
    console.error('Error in getSavedValuations:', err);
    return [];
  }
}

/**
 * Get user's premium valuations
 */
export async function getPremiumValuations(userId: string): Promise<Valuation[]> {
  try {
    if (!userId) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('valuations')
      .select('*')
      .eq('user_id', userId)
      .eq('premium_unlocked', true)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching premium valuations:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getPremiumValuations:', err);
    return [];
  }
}
