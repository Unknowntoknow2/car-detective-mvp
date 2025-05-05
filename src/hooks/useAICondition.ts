
import { useState, useEffect } from 'react';
import { getConditionAnalysis, AIConditionResult } from '@/utils/getConditionAnalysis';

export function useAICondition(valuationId: string | undefined) {
  const [conditionData, setConditionData] = useState<AIConditionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!valuationId) return;

    const fetchConditionData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getConditionAnalysis(valuationId);
        setConditionData(data);
      } catch (err) {
        console.error('Error in useAICondition:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchConditionData();
  }, [valuationId]);

  return { conditionData, isLoading, error };
}
