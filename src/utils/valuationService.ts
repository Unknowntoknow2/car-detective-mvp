
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
      // Type-safe handling of issues array
      const issuesArray: string[] = Array.isArray(conditionData.issues) 
        ? (conditionData.issues as any[]).map(issue => String(issue))
        : [];
        
      aiCondition = {
        condition: getConditionRating(conditionData.condition_score),
        confidenceScore: conditionData.confidence_score || 0,
        issuesDetected: issuesArray,
        aiSummary: conditionData.summary || ''
      };
    } else {
      // Check in photo_scores.metadata as fallback
      const primaryPhoto = photoData?.find(p => {
        if (!p.metadata) return false;
        const meta = p.metadata as Record<string, any>;
        return meta.isPrimary === true;
      }) || photoData?.[0];
      
      if (primaryPhoto?.metadata) {
        const metadata = primaryPhoto.metadata as Record<string, any>;
        if (metadata.condition) {
          const detectedIssues = Array.isArray(metadata.issuesDetected) 
            ? metadata.issuesDetected.map((issue: any) => String(issue))
            : [];
            
          aiCondition = {
            condition: metadata.condition as AICondition['condition'],
            confidenceScore: Number(metadata.confidenceScore) || 0,
            issuesDetected: detectedIssues,
            aiSummary: metadata.aiSummary ? String(metadata.aiSummary) : ''
          };
        }
      }
    }
    
    // Process photo scores
    const photoScores: PhotoScore[] = (photoData || []).map(photo => {
      const metadata = photo.metadata as Record<string, any> || {};
      return {
        url: photo.thumbnail_url || '',
        score: photo.score || 0,
        isPrimary: metadata.isPrimary === true
      };
    });
    
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

// Add the missing exported functions that are imported in useValuationHistory.ts
export async function getUserValuations(userId: string) {
  try {
    const { data, error } = await supabase
      .from('valuations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching user valuations:', err);
    return [];
  }
}

export async function getSavedValuations(userId: string) {
  try {
    const { data, error } = await supabase
      .from('saved_valuations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching saved valuations:', err);
    return [];
  }
}

export async function getPremiumValuations(userId: string) {
  try {
    const { data, error } = await supabase
      .from('valuations')
      .select('*')
      .eq('user_id', userId)
      .eq('premium_unlocked', true)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching premium valuations:', err);
    return [];
  }
}
