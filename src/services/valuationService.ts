
import { supabase } from '@/integrations/supabase/client';
import { ValuationResult } from '@/types/valuation';

/**
 * Retrieves a valuation by its public token
 * @param token The public token for the valuation
 */
export async function getValuationByToken(token: string): Promise<ValuationResult | null> {
  try {
    // First, look up the token to get the valuation ID
    const { data: tokenData, error: tokenError } = await supabase
      .from('public_tokens')
      .select('valuation_id')
      .eq('token', token)
      .single();
    
    if (tokenError || !tokenData) {
      console.error('Error retrieving token data:', tokenError);
      return null;
    }
    
    // Now fetch the valuation with that ID
    const { data: valuation, error: valuationError } = await supabase
      .from('valuations')
      .select('*')
      .eq('id', tokenData.valuation_id)
      .single();
    
    if (valuationError) {
      console.error('Error retrieving valuation:', valuationError);
      return null;
    }
    
    // Format the valuation to match our ValuationResult interface
    return {
      id: valuation.id,
      make: valuation.make,
      model: valuation.model,
      year: valuation.year,
      mileage: valuation.mileage,
      condition: valuation.condition_score ? valuation.condition_score.toString() : 'Good', // Map to string condition
      zipCode: valuation.state || '', // Map state to zipCode
      estimatedValue: valuation.estimated_value,
      confidenceScore: valuation.confidence_score,
      fuelType: valuation.fuel_type || '', // Map fuel_type
      isPremium: valuation.premium_unlocked,
      bestPhotoUrl: valuation.photo_url || '' // Map best_photo_url or photo_url
    };
  } catch (error) {
    console.error('Error in getValuationByToken:', error);
    return null;
  }
}

export async function getAllUserValuations(userId: string): Promise<ValuationResult[]> {
  try {
    const { data, error } = await supabase
      .from('valuations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching valuations:', error);
      return [];
    }
    
    return data.map(val => ({
      id: val.id,
      make: val.make,
      model: val.model,
      year: val.year,
      mileage: val.mileage,
      condition: val.condition_score ? val.condition_score.toString() : 'Good', // Map condition_score to condition string
      zipCode: val.zip || '', // Map zip to zipCode
      estimatedValue: val.estimated_value,
      confidenceScore: val.confidence_score
    }));
  } catch (error) {
    console.error('Error in getAllUserValuations:', error);
    return [];
  }
}

export async function fetchValuation(id: string): Promise<ValuationResult> {
  try {
    const { data, error } = await supabase
      .from('valuations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Valuation not found');
    
    // Transform the database record to the ValuationResult format
    return {
      id: data.id,
      make: data.make,
      model: data.model,
      year: data.year,
      mileage: data.mileage,
      condition: mapConditionScore(data.condition_score), // Map condition score to string
      zipCode: data.state || '90210', // Default to 90210 if not available
      estimatedValue: data.estimated_value,
      confidenceScore: data.confidence_score,
      fuelType: data.fuel_type || '', // Match property names
      bestPhotoUrl: data.photo_url || '', // Match property names
      adjustments: generateMockAdjustments(data),
      priceRange: calculatePriceRange(data.estimated_value, data.confidence_score),
      vin: data.vin,
      // Add more fields as needed
    };
  } catch (error) {
    console.error('Error fetching valuation:', error);
    throw error;
  }
}

// Helper function to map condition score to a string
function mapConditionScore(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Poor';
}

function generateMockAdjustments(data: any): Array<{ factor: string; impact: number; description?: string }> {
  return [
    {
      factor: 'Mileage',
      impact: calculateMileageAdjustment(data.mileage),
      description: `Based on ${data.mileage.toLocaleString()} miles`
    },
    {
      factor: 'Condition',
      impact: (data.condition_score - 70) / 10,
      description: `${mapConditionScore(data.condition_score)} condition`
    },
    {
      factor: 'Market Demand',
      impact: data.zip_demand_factor ? (data.zip_demand_factor - 1) * 5 : 1.5,
      description: `Market demand in ${data.state || 'your area'}` // Use state instead of zip
    }
  ];
}

function calculatePriceRange(estimatedValue: number, confidenceScore: number): [number, number] {
  const margin = (100 - confidenceScore) / 100 * estimatedValue;
  return [Math.floor(estimatedValue - margin), Math.ceil(estimatedValue + margin)];
}

function calculateMileageAdjustment(mileage: number): number {
  const avgMileage = 12000 * 5; // 5 years at 12k miles per year
  if (mileage <= avgMileage) {
    return (avgMileage - mileage) / 20000;
  } else {
    return (avgMileage - mileage) / 20000;
  }
}
