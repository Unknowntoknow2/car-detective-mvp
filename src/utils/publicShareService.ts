
import { supabase } from '@/integrations/supabase/client';

export interface SharedValuation {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition_score: number;
  estimated_value: number;
  created_at: string;
}

/**
 * Fetches a valuation by public token
 */
export async function getValuationByToken(token: string) {
  try {
    const { data, error } = await supabase
      .from('public_tokens')
      .select(`
        token,
        valuation_id,
        created_at,
        expires_at,
        valuations (
          id,
          make,
          model,
          year,
          mileage,
          condition_score,
          estimated_value,
          created_at
        )
      `)
      .eq('token', token)
      .single();

    if (error) {
      console.error('Error fetching valuation by token:', error);
      return null;
    }

    if (!data || !data.valuations) {
      return null;
    }

    const now = new Date();
    const expiresAt = new Date(data.expires_at);

    // Check if token has expired
    if (expiresAt < now) {
      return { expired: true };
    }

    // Fix the type issue by transforming the array to a single object if needed
    const valuation = Array.isArray(data.valuations) 
      ? {
          id: data.valuations[0].id,
          make: data.valuations[0].make,
          model: data.valuations[0].model,
          year: Number(data.valuations[0].year),
          mileage: Number(data.valuations[0].mileage),
          condition_score: Number(data.valuations[0].condition_score),
          estimated_value: Number(data.valuations[0].estimated_value),
          created_at: data.valuations[0].created_at
        } as SharedValuation
      : data.valuations as SharedValuation;

    return {
      token: data.token,
      valuation,
      created_at: data.created_at,
      expires_at: data.expires_at
    };
  } catch (err) {
    console.error('Error in getValuationByToken:', err);
    return null;
  }
}
