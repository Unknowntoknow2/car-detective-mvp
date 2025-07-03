import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePublicShare() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePublicToken = async (valuationId: string): Promise<string> => {
    try {
      setIsGenerating(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('create-public-token', {
        body: { valuationId }
      });

      if (error) throw error;

      return data.token;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate public token';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const getValuationByToken = async (token: string) => {
    try {
      setError(null);

      const { data, error } = await supabase
        .from('public_tokens')
        .select(`
          token,
          expires_at,
          valuations (
            id,
            year,
            make,
            model,
            trim,
            vin,
            mileage,
            condition,
            estimated_value,
            confidence_score,
            created_at,
            valuation_type
          )
        `)
        .eq('token', token)
        .single();

      if (error) throw error;

      // Check if token has expired
      if (new Date(data.expires_at) < new Date()) {
        throw new Error('Share link has expired');
      }

      return data.valuations;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load valuation';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    generatePublicToken,
    getValuationByToken,
    isGenerating,
    error,
  };
}