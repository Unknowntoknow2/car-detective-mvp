
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
        // Map to consistent camelCase format for frontend use
        estimatedValue: data.estimatedValue || 0,
        confidenceScore: data.confidenceScore || 75,
        // Add these properties in a consistent format - support both formats
        color: data.color || null,
        bodyStyle: data.body_style || data.bodyStyle || null,
        bodyType: data.body_type || data.bodyType || null,
        fuelType: data.fuel_type || data.fuelType || null,
        explanation: data.explanation || null,
        transmission: data.transmission || null,
        // Also maintain the original properties in snake_case format for backward compatibility
        body_style: data.body_style || data.bodyStyle || null,
        body_type: data.body_type || data.bodyType || null,
        fuel_type: data.fuel_type || data.fuelType || null
      };
    },
    enabled: !!valuationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
