
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

export function useValuationResult(valuationId: string) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const fetchData = async () => {
    if (!valuationId) {
      setIsLoading(false);
      setIsError(true);
      setError('No valuation ID provided');
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError('');

    try {
      const { data: result, error: apiError } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .single();

      if (apiError) {
        throw apiError;
      }

      if (result) {
        // Convert adjustments from string to array if needed
        if (result.adjustments && typeof result.adjustments === 'string') {
          try {
            result.adjustments = JSON.parse(result.adjustments);
          } catch (e) {
            console.error('Failed to parse adjustments:', e);
            result.adjustments = [];
          }
        }

        // Convert price range from string to array if needed
        if (result.price_range && typeof result.price_range === 'string') {
          try {
            result.price_range = JSON.parse(result.price_range);
          } catch (e) {
            console.error('Failed to parse price range:', e);
            result.price_range = [
              Math.round(result.estimated_value * 0.9),
              Math.round(result.estimated_value * 1.1)
            ];
          }
        }

        setData(result);
      } else {
        setError('Valuation not found');
        setIsError(true);
      }
    } catch (err: any) {
      console.error('Error fetching valuation result:', err);
      setError(err.message || 'Failed to fetch valuation data');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [valuationId]);

  // Refetch function for manually triggering a refresh
  const refetch = () => {
    fetchData();
  };

  return { data, isLoading, error, isError, refetch };
}
