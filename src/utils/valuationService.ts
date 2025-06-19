
import { AICondition } from "@/types/photo";
import { supabase } from "@/integrations/supabase/client";

/**
 * Get the best photo assessment for a valuation
 */
export async function getBestPhotoAssessment(valuationId: string) {
  try {
    const { data, error } = await supabase
      .from('photo_assessments')
      .select('*')
      .eq('valuation_id', valuationId)
      .order('score', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    return {
      aiCondition: {
        condition: data.condition as 'Excellent' | 'Good' | 'Fair' | 'Poor',
        confidence: data.confidence,
        issuesDetected: data.issues_detected || [],
        summary: data.summary,
        description: data.description
      } satisfies AICondition,
      photoScores: data.photo_scores || []
    };
  } catch (error) {
    console.error('Error fetching photo assessment:', error);
    return null;
  }
}

export async function getUserValuations(userId: string) {
  try {
    const { data, error } = await supabase
      .from('valuations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user valuations:', error);
    return [];
  }
}

export async function getSavedValuations(userId: string) {
  try {
    const { data, error } = await supabase
      .from('saved_valuations')
      .select('*')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching saved valuations:', error);
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
    return data;
  } catch (error) {
    console.error('Error fetching premium valuations:', error);
    return [];
  }
}

export async function getValuationHistory(userId: string) {
  return getUserValuations(userId);
}
