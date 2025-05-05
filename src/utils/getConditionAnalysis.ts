
import { supabase } from '@/integrations/supabase/client';

export interface AIConditionResult {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  confidenceScore: number;
  issuesDetected: string[];
  aiSummary: string;
}

export async function getConditionAnalysis(valuationId: string): Promise<AIConditionResult | null> {
  try {
    // First, check if the photo_condition_scores table exists by trying to fetch data
    const { data, error } = await supabase
      .from('photo_condition_scores')
      .select('*')
      .eq('valuation_id', valuationId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching condition analysis:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Parse the data from the database record with proper type checks
    return {
      condition: getConditionRating(data.condition_score || 0),
      confidenceScore: typeof data.confidence_score === 'number' ? data.confidence_score : 0,
      issuesDetected: Array.isArray(data.issues) ? data.issues.map(issue => String(issue)) : [],
      aiSummary: typeof data.summary === 'string' ? data.summary : ''
    };
  } catch (error) {
    console.error('Unexpected error in getConditionAnalysis:', error);
    return null;
  }
}

// Helper function to convert a condition score to a rating
function getConditionRating(score: number): 'Excellent' | 'Good' | 'Fair' | 'Poor' {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}
