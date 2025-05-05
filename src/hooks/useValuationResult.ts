
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ValuationResultData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
}

export function useValuationResult(valuationId: string) {
  const [data, setData] = useState<ValuationResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchValuationResult = async () => {
      setIsLoading(true);
      
      try {
        const { data: valuationData, error: valuationError } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', valuationId)
          .single();
          
        if (valuationError) throw new Error(valuationError.message);
        
        if (valuationData) {
          setData({
            id: valuationData.id,
            make: valuationData.make,
            model: valuationData.model,
            year: valuationData.year,
            mileage: valuationData.mileage || 0,
            condition: valuationData.condition || 'Good',
            zipCode: valuationData.zip_code || '00000',
            estimatedValue: valuationData.estimated_value || 0
          });
        }
      } catch (err) {
        console.error('Error fetching valuation result:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch valuation data'));
      } finally {
        setIsLoading(false);
      }
    };
    
    if (valuationId) {
      fetchValuationResult();
    }
  }, [valuationId]);
  
  return { data, isLoading, error };
}
