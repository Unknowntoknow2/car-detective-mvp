
import { useState, useEffect } from 'react';
import { getConditionAnalysis, AIConditionResult } from '@/utils/getConditionAnalysis';

export function useAICondition(valuationId?: string) {
  const [conditionData, setConditionData] = useState<AIConditionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchConditionData() {
      if (!valuationId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getConditionAnalysis(valuationId);
        setConditionData(data);
      } catch (err) {
        console.error('Error fetching AI condition data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch condition data'));
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchConditionData();
  }, [valuationId]);

  return {
    conditionData,
    isLoading,
    error,
    isError: !!error
  };
}
