
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePrediction(valuationId: string | undefined) {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPrediction = useCallback(async () => {
    if (!valuationId) {
      console.error('No valuation ID provided');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Getting prediction for valuation:', valuationId);
      
      const { data, error } = await supabase.functions.invoke('predict', {
        body: { valuationId }
      });
      
      if (error) {
        console.error('Prediction error:', error);
        throw new Error(error.message);
      }
      
      if (!data || !data.predictedPrice) {
        throw new Error('Invalid prediction response');
      }
      
      console.log('Received prediction:', data);
      setPrice(data.predictedPrice);
      return data; // Return full data including breakdown
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get prediction';
      console.error('Prediction failed:', message);
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [valuationId]);

  return {
    price,
    isLoading,
    error,
    getPrediction
  };
}
