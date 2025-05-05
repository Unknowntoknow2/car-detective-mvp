
import { supabase } from '@/integrations/supabase/client';
import { Valuation } from '@/types/dealer';

export type ConditionFilterOption = 'excellent' | 'good-or-better' | 'manual-only' | 'all';

export interface ValuationWithCondition extends Valuation {
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
}

export async function getListingsWithCondition(
  filter: ConditionFilterOption = 'all',
  limit: number = 10,
  page: number = 1
): Promise<ValuationWithCondition[]> {
  // Calculate offset for pagination
  const offset = (page - 1) * limit;
  
  // Build the base query
  let query = supabase
    .from('valuations')
    .select(`
      *,
      photo_condition_scores:photo_condition_scores(
        condition,
        confidence_score,
        issues,
        summary
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1);
  
  // Apply condition filters
  if (filter === 'excellent') {
    query = query.or(
      `and(photo_condition_scores.condition.eq.Excellent,photo_condition_scores.confidence_score.gte.70)`
    );
  } else if (filter === 'good-or-better') {
    query = query.or(
      `and(photo_condition_scores.condition.in.(Excellent,Good),photo_condition_scores.confidence_score.gte.70)`
    );
  } else if (filter === 'manual-only') {
    query = query.is('photo_condition_scores', null);
  }
  
  // Execute the query
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching listings with condition:', error);
    return [];
  }
  
  // Transform the data to match our expected format
  const transformedData: ValuationWithCondition[] = data.map((item: any) => {
    const photoConditionScores = item.photo_condition_scores?.[0];
    
    return {
      ...item,
      aiCondition: photoConditionScores ? {
        condition: photoConditionScores.condition,
        confidenceScore: photoConditionScores.confidence_score,
        issuesDetected: photoConditionScores.issues || [],
        aiSummary: photoConditionScores.summary
      } : null
    };
  });
  
  return transformedData;
}

// Function to get total count of listings based on filter
export async function getListingsCount(filter: ConditionFilterOption = 'all'): Promise<number> {
  let query = supabase
    .from('valuations')
    .select(`
      id,
      photo_condition_scores:photo_condition_scores(
        condition,
        confidence_score
      )
    `, { count: 'exact' });
  
  // Apply condition filters
  if (filter === 'excellent') {
    query = query.or(
      `and(photo_condition_scores.condition.eq.Excellent,photo_condition_scores.confidence_score.gte.70)`
    );
  } else if (filter === 'good-or-better') {
    query = query.or(
      `and(photo_condition_scores.condition.in.(Excellent,Good),photo_condition_scores.confidence_score.gte.70)`
    );
  } else if (filter === 'manual-only') {
    query = query.is('photo_condition_scores', null);
  }
  
  const { count, error } = await query;
  
  if (error) {
    console.error('Error getting listings count:', error);
    return 0;
  }
  
  return count || 0;
}
