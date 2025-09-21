
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ValuationData {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  zipCode?: string;
  vin?: string;
  isPremium?: boolean;
}

export function useValuationData(valuationId: string) {
  const [valuationData, setValuationData] = useState<ValuationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchValuationData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch real valuation data from the valuation-result edge function
        const { data, error } = await supabase.functions.invoke('valuation-result', {
          body: { requestId: valuationId }
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data?.success && data?.valuation_result) {
          const result = data.valuation_result;
          const request = data.valuation_request;
          
          const realData: ValuationData = {
            make: request.make,
            model: request.model,
            year: request.year,
            mileage: result.follow_up_data?.mileage || request.mileage,
            condition: result.follow_up_data?.condition || 'good',
            estimatedValue: result.estimated_value,
            confidenceScore: result.confidence_score,
            zipCode: request.zip_code,
            vin: request.vin,
            isPremium: false
          };
          
          setValuationData(realData);
          setError(null);
        } else {
          throw new Error('No valuation result found');
        }
      } catch (err) {
        setError('Failed to load valuation data');
        setValuationData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (valuationId) {
      fetchValuationData();
    }
  }, [valuationId]);

  return {
    valuationData,
    isLoading,
    error
  };
}
