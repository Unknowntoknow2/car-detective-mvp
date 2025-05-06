
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getValuationResult, checkPremiumAccess } from '@/utils/valuationService';
import { Valuation } from '@/types/valuation-history';

export function useValuationResult(valuationId: string) {
  return useQuery({
    queryKey: ['valuation', valuationId],
    queryFn: async () => {
      if (!valuationId) {
        throw new Error('Valuation ID is required');
      }
      
      // Get the valuation data
      const data = await getValuationResult(valuationId);
      
      // Check if this is a premium report
      const isPremium = await checkPremiumAccess(valuationId);
      
      // Return the data with standardized property names to work with our components
      return {
        ...data,
        isPremium,
        // Map snake_case to camelCase for convenience
        estimatedValue: data.estimated_value || data.valuation || 0,
        confidenceScore: data.confidence_score || 75,
      };
    },
    enabled: !!valuationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
