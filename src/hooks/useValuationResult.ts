
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
        transmission: null
      };
      
      // Handle estimatedValue (camelCase) and estimated_value (snake_case)
      if (data.estimatedValue !== undefined) {
        transformedData.estimatedValue = data.estimatedValue;
      } else if (data.estimated_value !== undefined) {
        transformedData.estimatedValue = data.estimated_value;
      }
      
      // Handle confidenceScore (camelCase) and confidence_score (snake_case)
      if (data.confidenceScore !== undefined) {
        transformedData.confidenceScore = data.confidenceScore;
      } else if (data.confidence_score !== undefined) {
        transformedData.confidenceScore = data.confidence_score;
      }
      
      // Handle color
      if (data.color !== undefined) {
        transformedData.color = data.color;
      }
      
      // Handle bodyStyle (camelCase) and body_style (snake_case)
      if (data.bodyStyle !== undefined) {
        transformedData.bodyStyle = data.bodyStyle;
      } else if (data.body_style !== undefined) {
        transformedData.bodyStyle = data.body_style;
      }
      
      // Handle bodyType (camelCase) and body_type (snake_case)
      if (data.bodyType !== undefined) {
        transformedData.bodyType = data.bodyType;
      } else if (data.body_type !== undefined) {
        transformedData.bodyType = data.body_type;
      }
      
      // Handle fuelType (camelCase) and fuel_type (snake_case)
      if (data.fuelType !== undefined) {
        transformedData.fuelType = data.fuelType;
      } else if (data.fuel_type !== undefined) {
        transformedData.fuelType = data.fuel_type;
      }
      
      // Handle explanation and transmission
      if (data.explanation !== undefined) {
        transformedData.explanation = data.explanation;
      }
      
      if (data.transmission !== undefined) {
        transformedData.transmission = data.transmission;
      }
      
      // Add snake_case versions for backward compatibility
      transformedData.body_style = transformedData.bodyStyle;
      transformedData.body_type = transformedData.bodyType;
      transformedData.fuel_type = transformedData.fuelType;
      transformedData.estimated_value = transformedData.estimatedValue;
      transformedData.confidence_score = transformedData.confidenceScore;
      
      return transformedData;
    },
    enabled: !!valuationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
