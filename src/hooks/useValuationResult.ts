
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ValuationData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  adjustments?: { factor: string; impact: number; description: string }[];
  createdAt: string;
  aiCondition?: any;
  isPremium?: boolean;
}

export function useValuationResult(valuationId: string) {
  const [data, setData] = useState<ValuationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isError, setIsError] = useState(false);

  const fetchValuation = async () => {
    if (!valuationId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsError(false);

      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .single();

      if (valuationError) {
        throw new Error(valuationError.message);
      }

      if (!valuationData) {
        throw new Error('Valuation not found');
      }

      // Transform the Supabase data to our expected format
      const transformedData: ValuationData = {
        id: valuationData.id,
        make: valuationData.make || '',
        model: valuationData.model || '',
        year: valuationData.year || 0,
        mileage: valuationData.mileage || 0,
        condition: valuationData.condition || 'Good',
        zipCode: valuationData.state || '',
        estimatedValue: valuationData.estimated_value || 0,
        confidenceScore: valuationData.confidence_score || 75,
        priceRange: [
          Math.round((valuationData.estimated_value || 0) * 0.95),
          Math.round((valuationData.estimated_value || 0) * 1.05)
        ],
        adjustments: [
          { 
            factor: 'Base Condition', 
            impact: 0, 
            description: 'Baseline vehicle value' 
          },
          { 
            factor: 'Market Demand', 
            impact: 1.5, 
            description: 'Current market conditions' 
          }
        ],
        createdAt: valuationData.created_at,
        isPremium: valuationData.premium_unlocked || false
      };

      setData(transformedData);
    } catch (err) {
      console.error('Error fetching valuation:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch valuation data'));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchValuation();
  }, [valuationId]);

  return {
    data,
    isLoading,
    error,
    isError,
    refetch: fetchValuation
  };
}
