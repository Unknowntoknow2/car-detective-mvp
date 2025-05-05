
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface ValuationResultData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
}

export function useValuationResult(valuationId: string) {
  const [data, setData] = useState<ValuationResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchValuationResult = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .single();
        
      if (valuationError) throw new Error(valuationError.message);
      
      if (valuationData) {
        // Transform the data to the expected format with camelCase properties
        // Convert adjustments from {name, value, percentage} to {factor, impact, description}
        const formattedAdjustments = (valuationData.adjustments || []).map(adj => ({
          factor: adj.name || adj.factor || '',
          impact: adj.percentage || adj.impact || 0,
          description: adj.description || `Impact of ${adj.name || adj.factor} on vehicle value`
        }));
        
        setData({
          id: valuationData.id,
          make: valuationData.make,
          model: valuationData.model,
          year: valuationData.year,
          mileage: valuationData.mileage || 0,
          condition: valuationData.condition || 'Good',
          zipCode: valuationData.zip_code || '00000',
          estimatedValue: valuationData.estimated_value || 0,
          confidenceScore: valuationData.confidence_score,
          priceRange: valuationData.price_range || [0, 0],
          adjustments: formattedAdjustments
        });
      }
    } catch (err) {
      console.error('Error fetching valuation result:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch valuation data'));
    } finally {
      setIsLoading(false);
    }
  }, [valuationId]);
  
  useEffect(() => {
    if (valuationId) {
      fetchValuationResult();
    }
  }, [valuationId, fetchValuationResult]);
  
  return { 
    data, 
    isLoading, 
    error,
    isError: !!error,
    refetch: fetchValuationResult
  };
}
