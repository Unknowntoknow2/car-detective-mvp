
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
      
      // Manual fallback logic when no valid photos or condition data are present
      if (!aiCondition && !photoData?.length) {
        console.log('No photo data found, using manual fallback condition');
        aiCondition = {
          condition: 'Good', // Default to "Good" condition
          confidenceScore: 25, // Low confidence score to indicate manual fallback
          issuesDetected: ['No photo analysis available'],
          aiSummary: 'Vehicle condition was estimated without photo analysis. For better accuracy, please upload vehicle photos.'
        };
        
        // Store this fallback assessment in the database for future reference
        try {
          const { error: storeError } = await supabase
            .from('photo_condition_scores')
            .insert({
              valuation_id: valuationId,
              condition_score: 70, // "Good" numeric value
              confidence_score: 25, // Low confidence
              issues: ['No photo analysis available'],
              summary: 'Vehicle condition was estimated without photo analysis. For better accuracy, please upload vehicle photos.'
            });
            
          if (storeError) {
            console.error('Error storing fallback condition data:', storeError);
          }
        } catch (err) {
          console.error('Error in fallback condition storage:', err);
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

/**
 * Get valuation result data for a specific valuation
 * 
 * @param valuationId The valuation ID to fetch
 * @returns The valuation data including vehicle and pricing information
 */
export async function getValuationResult(valuationId: string) {
  try {
    // Fetch valuation data from database
    const { data: valuationData, error } = await supabase
      .from('valuations')
      .select('*')
      .eq('id', valuationId)
      .single();
      
    if (error) throw error;
    
    // Get photo assessment data including AI condition
    const photoAssessment = await getBestPhotoAssessment(valuationId);
    
    // Map the condition_score to a text condition
    const conditionText = getConditionRating(valuationData.condition_score || 60);
    
    // Transform valuation data to expected format
    return {
      id: valuationData.id,
      make: valuationData.make,
      model: valuationData.model,
      year: valuationData.year,
      mileage: valuationData.mileage || 0,
      condition: conditionText,
      zipCode: valuationData.state || '',
      estimatedValue: valuationData.estimated_value,
      confidenceScore: valuationData.confidence_score,
      priceRange: [
        Math.round(valuationData.estimated_value * 0.95),
        Math.round(valuationData.estimated_value * 1.05)
      ] as [number, number],
      adjustments: [
        { 
          factor: 'Base Value', 
          impact: 0, 
          description: 'Starting valuation'
        },
        { 
          factor: 'Mileage', 
          impact: valuationData.zip_demand_factor ? ((valuationData.zip_demand_factor - 1) * 100) : 0, 
          description: 'Based on current mileage'
        },
        { 
          factor: 'Condition', 
          impact: conditionText === 'Excellent' ? 5 : 
                 conditionText === 'Good' ? 0 : 
                 conditionText === 'Fair' ? -5 : -10, 
          description: `Based on ${conditionText.toLowerCase()} condition`
        },
        { 
          factor: 'Market Demand', 
          impact: valuationData.zip_demand_factor ? 
                 ((valuationData.zip_demand_factor - 1) * 100) : 0, 
          description: 'Based on current market conditions'
        }
      ],
      aiCondition: photoAssessment.aiCondition,
      bestPhotoUrl: photoAssessment.photoScores.length > 0 ? 
        photoAssessment.photoScores[0].url : undefined,
      isPremium: valuationData.premium_unlocked
    };
  } catch (err) {
    console.error('Error fetching valuation result:', err);
    throw err;
  }
}

/**
 * Check if a user has premium access to a specific valuation
 * 
 * @param valuationId The valuation ID to check
 * @returns Boolean indicating if premium access is available
 */
export async function checkPremiumAccess(valuationId: string): Promise<boolean> {
  try {
    // Check if the valuation has premium_unlocked flag
    const { data, error } = await supabase
      .from('valuations')
      .select('premium_unlocked')
      .eq('id', valuationId)
      .maybeSingle();
      
    if (error) throw error;
    
    return data?.premium_unlocked === true;
  } catch (err) {
    console.error('Error checking premium access:', err);
    return false;
  }
}
