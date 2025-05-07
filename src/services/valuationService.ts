
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
      condition: valuation.condition,
      zipCode: valuation.zip_code,
      estimatedValue: valuation.estimated_value,
      confidenceScore: valuation.confidence_score,
      fuelType: valuation.fuel_type,
      isPremium: valuation.premium_unlocked,
      bestPhotoUrl: valuation.best_photo_url
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
      condition: val.condition,
      zipCode: val.zip_code,
      estimatedValue: val.estimated_value,
      confidenceScore: val.confidence_score
    }));
  } catch (error) {
    console.error('Error in getAllUserValuations:', error);
    return [];
  }
}
