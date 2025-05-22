
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Valuation } from '@/types/valuation-history';
import { ValuationResult } from '@/types/valuation';

// Normalize valuation data from different sources
const normalizeValuation = (valuation: any): Valuation => {
  // Convert property names to match Valuation type
  return {
    id: valuation.id,
    user_id: valuation.user_id,
    year: valuation.year,
    make: valuation.make,
    model: valuation.model,
    mileage: valuation.mileage,
    condition: valuation.condition,
    zipCode: valuation.zipCode || valuation.zip_code,
    estimated_value: valuation.estimated_value || valuation.estimatedValue,
    created_at: valuation.created_at || valuation.createdAt,
    updated_at: valuation.updated_at,
    confidence_score: valuation.confidence_score || valuation.confidenceScore,
    status: valuation.status,
    error_message: valuation.error_message,
    is_premium: valuation.is_premium,
    premium_unlocked: valuation.premium_unlocked,
    accident_count: valuation.accident_count || valuation.accidentCount,
    vin: valuation.vin,
    plate: valuation.plate,
    state: valuation.state,
    valuation: valuation.valuation
  };
};

export function useValuationHistory() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = supabase.auth.session()?.user?.id;

  useEffect(() => {
    if (userId) {
      fetchValuations();
    } else {
      setIsLoading(false);
      setError('User not authenticated');
    }
  }, [userId]);

  const fetchValuations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const normalizedValuations = (data || []).map(normalizeValuation);

      setValuations(normalizedValuations);
      return normalizedValuations;
    } catch (err: any) {
      console.error('Error fetching valuation history:', err);
      setError(err.message || 'Failed to fetch valuation history');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Add isEmpty helper method to fix errors in MyValuationsContent.tsx
  const isEmpty = () => valuations.length === 0;

  return {
    valuations,
    isLoading,
    error,
    fetchValuations,
    isEmpty
  };
}

// Export a test helper function for useValuationHistory.test.ts
export const testDeduplication = (items: any[]) => {
  // Implementation details here (mock for testing)
  return items.filter((value, index, self) => 
    index === self.findIndex((t) => t.id === value.id)
  );
};
