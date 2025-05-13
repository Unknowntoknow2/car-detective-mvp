
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

export function useValuationResult(valuationId: string) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const refetch = async () => {
    if (!valuationId) {
      setError('No valuation ID provided');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First try to get from Supabase
      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .maybeSingle();
      
      if (valuationError) {
        throw new Error(valuationError.message);
      }
      
      if (valuationData) {
        // Transform data structure to match expected format
        const transformedData = {
          ...valuationData,
          estimatedValue: valuationData.estimated_value,
          confidenceScore: valuationData.confidence_score,
          priceRange: [
            valuationData.estimated_value * 0.9,
            valuationData.estimated_value * 1.1
          ],
          make: valuationData.make,
          model: valuationData.model,
          year: valuationData.year
        };
        
        setData(transformedData);
      } else {
        // If not in Supabase, try localStorage
        const tempData = localStorage.getItem('temp_valuation_data');
        if (tempData) {
          const parsedData = JSON.parse(tempData);
          if (parsedData.id === valuationId) {
            setData(parsedData);
          } else {
            throw new Error('Valuation not found');
          }
        } else {
          throw new Error('Valuation not found');
        }
      }
    } catch (err: any) {
      console.error('Error fetching valuation:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [valuationId]);

  return { 
    data, 
    isLoading, 
    error,
    isError: !!error,
    refetch 
  };
}
