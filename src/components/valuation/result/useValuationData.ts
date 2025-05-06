
import { useState, useEffect, useCallback } from 'react';
import { generateValuationExplanation } from '@/utils/generateValuationExplanation';

export interface ValuationDataProps {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  location: string;
  valuation: number;
}

export const useValuationData = (data: ValuationDataProps) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const fetchExplanation = useCallback(async () => {
    if (!data.make || !data.model) return;
    
    setLoading(true);
    setError('');
    try {
      const result = await generateValuationExplanation({
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        condition: data.condition,
        location: data.location,
        valuation: data.valuation,
      });
      setExplanation(result);
    } catch (e: any) {
      console.error(e);
      setError('Failed to load explanation: ' + (e.message || ''));
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (data.make && data.model && data.year && data.mileage) {
      fetchExplanation();
    }
  }, [fetchExplanation]);

  const handleRegenerateExplanation = () => {
    fetchExplanation();
  };

  return {
    explanation,
    loading,
    error,
    handleRegenerateExplanation
  };
};
