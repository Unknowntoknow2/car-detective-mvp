import { supabase } from '@/integrations/supabase/client';

export interface AIConditionResult {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  confidenceScore: number;
  issuesDetected: string[];
  aiSummary: string;
}

export async function getConditionAnalysis(valuationId: string): Promise<AIConditionResult | null> {
  try {
    const { data, error } = await supabase
      .from('photo_condition_scores')
      .select('*')
      .eq('valuation_id', valuationId)
      .single();

    if (error || !data) {
      console.error('Error fetching condition analysis:', error);
      return null;
    }

    // Parse the data from the database record
    return {
      condition: data.condition as 'Excellent' | 'Good' | 'Fair' | 'Poor',
      confidenceScore: data.confidence_score,
      issuesDetected: Array.isArray(data.issues) ? data.issues : [],
      aiSummary: data.summary || ''
    };
  } catch (error) {
    console.error('Unexpected error in getConditionAnalysis:', error);
    return null;
  }
}
