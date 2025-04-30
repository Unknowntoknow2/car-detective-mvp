import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ValuationResultType {
  id: string;
  estimated_value: number;
  confidence_score: number;
  price_range?: [number, number];
  base_price?: number;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  // Keep the original fields available too
  accident_count: number;
  auction_avg_price?: number;
  dealer_avg_price?: number;
  condition_score: number;
  year: number;
  make: string;
  model: string;
  mileage?: number;
  zip_demand_factor?: number;
}

export function useValuationResult(valuationId?: string) {
  return useQuery({
    queryKey: ['valuation', valuationId],
    queryFn: async () => {
      if (!valuationId) {
        throw new Error('Valuation ID is required');
      }

      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch valuation: ${error.message}`);
      }

      // Transform the data to include calculated fields like price_range
      // and format adjustments based on the raw data
      const valuation: ValuationResultType = {
        ...data,
        price_range: data.estimated_value ? [
          Math.round(data.estimated_value * 0.95),
          Math.round(data.estimated_value * 1.05)
        ] as [number, number] : undefined,
        adjustments: [
          // Calculate adjustments based on various factors from the database
          data.accident_count > 0 ? {
            factor: 'Accident History',
            impact: -data.accident_count * 5,
          } : undefined,
          data.mileage && data.mileage > 70000 ? {
            factor: 'High Mileage',
            impact: -Math.round((data.mileage - 70000) / 10000) * 2,
          } : undefined,
          data.condition_score >= 80 ? {
            factor: 'Excellent Condition',
            impact: 5,
          } : data.condition_score < 50 ? {
            factor: 'Poor Condition', 
            impact: -10
          } : undefined,
          data.zip_demand_factor && data.zip_demand_factor !== 1.0 ? {
            factor: 'Location Demand',
            impact: Math.round((data.zip_demand_factor - 1) * 100),
          } : undefined
        ].filter(Boolean), // Remove undefined entries
      };

      return valuation;
    },
    enabled: !!valuationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
}
