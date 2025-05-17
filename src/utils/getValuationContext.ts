
import { supabase } from '@/integrations/supabase/client';
import { ValuationResult } from '@/types/valuation';

/**
 * Retrieves vehicle context data from a valuation ID
 */
export async function getValuationContext(valuationId?: string): Promise<Partial<ValuationResult> | null> {
  if (!valuationId) return null;
  
  try {
    // Query the valuations table to get the details
    const { data, error } = await supabase
      .from('valuations')
      .select(`
        id,
        make,
        model,
        year,
        mileage,
        condition_score,
        confidence_score,
        state,
        color,
        body_type,
        estimated_value,
        premium_unlocked
      `)
      .eq('id', valuationId)
      .single();
    
    if (error) {
      console.error('Error fetching valuation context:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    // Map database field names to our ValuationResult type
    return {
      id: data.id,
      make: data.make,
      model: data.model,
      year: data.year,
      mileage: data.mileage,
      condition: mapConditionScore(data.condition_score),
      confidenceScore: data.confidence_score,
      zipCode: data.state,
      color: data.color,
      bodyType: data.body_type,
      estimatedValue: data.estimated_value,
      premium_unlocked: data.premium_unlocked
    };
  } catch (error) {
    console.error('Failed to get valuation context:', error);
    return null;
  }
}

/**
 * Maps a numeric condition score to a text label
 */
function mapConditionScore(score?: number | null): string {
  if (!score) return 'Unknown';
  
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}
