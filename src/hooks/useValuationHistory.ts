
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Valuation } from '@/types/valuation-history';

const normalizeValuation = (valuation: any): Valuation => {
  return {
    id: valuation.id,
    userId: valuation.user_id,
    year: valuation.year,
    make: valuation.make,
    model: valuation.model,
    mileage: valuation.mileage,
    condition: valuation.condition,
    zipCode: valuation.zipCode || valuation.zip_code,
    estimatedValue: valuation.estimated_value || valuation.estimatedValue,
    createdAt: new Date(valuation.created_at || valuation.createdAt),
    updatedAt: new Date(valuation.updated_at || valuation.updatedAt || valuation.created_at || valuation.createdAt),
    confidenceScore: valuation.confidence_score || valuation.confidenceScore,
    vin: valuation.vin,
    created_at: valuation.created_at,
    updated_at: valuation.updated_at,
    user_id: valuation.user_id,
    estimated_value: valuation.estimated_value,
    confidence_score: valuation.confidence_score,
    accident_count: valuation.accident_count || valuation.accidentCount,
    is_premium: valuation.is_premium,
    premium_unlocked: valuation.premium_unlocked,
    valuation: valuation.valuation,
    plate: valuation.plate,
    state: valuation.state
  };
};

export function useValuationHistory() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = supabase.auth.getSession ? 
    (supabase.auth.getSession() as any)?.data?.session?.user?.id : 
    null;

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
      setError(err.message || 'Failed to fetch valuation history');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const isEmpty = () => valuations.length === 0;

  return {
    valuations,
    isLoading,
    error,
    fetchValuations,
    isEmpty
  };
}

export const testDeduplication = (items: any[]) => {
  return items.filter((value, index, self) => 
    index === self.findIndex((t) => t.id === value.id)
  );
};
