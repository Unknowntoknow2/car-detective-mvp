
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
      
      // Create a consistent data structure with all required properties
      const transformedData = { 
        ...data,
        isPremium,
        // Set default values for required properties
        estimatedValue: 0,
        confidenceScore: 75,
        bodyStyle: null,
        bodyType: null,
        fuelType: null,
        color: null,
        explanation: null,
        transmission: null,
        aiCondition: null
      };
      
      // Handle estimatedValue (camelCase)
      if (data.estimatedValue !== undefined) {
        transformedData.estimatedValue = data.estimatedValue;
      }
      
      // Handle confidenceScore (camelCase)
      if (data.confidenceScore !== undefined) {
        transformedData.confidenceScore = data.confidenceScore;
      }
      
      // Handle color
      if (data.color !== undefined) {
        transformedData.color = data.color;
      }
      
      // Handle bodyStyle (camelCase)
      if (data.bodyStyle !== undefined) {
        transformedData.bodyStyle = data.bodyStyle;
      }
      
      // Handle bodyType (camelCase)
      if (data.bodyType !== undefined) {
        transformedData.bodyType = data.bodyType;
      }
      
      // Handle fuelType (camelCase)
      if (data.fuelType !== undefined) {
        transformedData.fuelType = data.fuelType;
      }
      
      // Handle explanation and transmission
      if (data.explanation !== undefined) {
        transformedData.explanation = data.explanation;
      }
      
      if (data.transmission !== undefined) {
        transformedData.transmission = data.transmission;
      }
      
      // Handle aiCondition if it exists
      if (data.aiCondition !== undefined) {
        transformedData.aiCondition = data.aiCondition;
      }
      
      return transformedData;
    },
    enabled: !!valuationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
