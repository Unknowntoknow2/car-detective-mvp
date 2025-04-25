
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePrediction(valuationId: string | undefined) {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPrediction = async () => {
    if (!valuationId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('predict', {
        body: { valuationId }
      });
      
      if (error) throw new Error(error.message);
      if (!data || !data.predictedPrice) throw new Error('Invalid prediction response');
      
      setPrice(data.predictedPrice);
      return data.predictedPrice;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get prediction';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    price,
    isLoading,
    error,
    getPrediction
  };
}
