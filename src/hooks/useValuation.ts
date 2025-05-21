import { useState, useEffect } from 'react';
import { getValuationById } from '@/services/valuationService';

export const useValuation = (id: string) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [valuationState, setValuationState] = useState<string | null>(null);

  useEffect(() => {
    const fetchValuation = async () => {
      setIsLoading(true);
      try {
        const result = await getValuationById(id);
        setData(result);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchValuation();
      setValuationState(id);
    }
  }, [id]);

  return { data, isLoading, error, valuationState };
};
