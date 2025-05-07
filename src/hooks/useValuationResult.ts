
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
        estimatedValue: data.estimatedValue || data.estimated_value || 0,
        confidenceScore: data.confidenceScore || data.confidence_score || 75,
        // Add these properties in a consistent format
        bodyStyle: data.bodyStyle || data.body_style || null,
        bodyType: data.bodyType || data.body_type || null,
        fuelType: data.fuelType || data.fuel_type || null,
        color: data.color || null,
        explanation: data.explanation || null,
        transmission: data.transmission || null,
        // These are accessed in PremiumValuationPage.tsx so we need to ensure they exist
        body_style: data.bodyStyle || data.body_style || null,
        body_type: data.bodyType || data.body_type || null,
        fuel_type: data.fuelType || data.fuel_type || null
      };
    },
    enabled: !!valuationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
