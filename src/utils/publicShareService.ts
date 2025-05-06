
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

    return {
      token: data.token,
      valuation: data.valuations as SharedValuation,
      created_at: data.created_at,
      expires_at: data.expires_at
    };
  } catch (err) {
    console.error('Error in getValuationByToken:', err);
    return null;
  }
}
