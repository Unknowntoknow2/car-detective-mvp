
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
      
      // Make a copy of the data to make our transformations on
      const transformedData = { ...data, isPremium };
      
      // Handle camelCase and snake_case variations for estimatedValue/estimated_value
      if (data.estimatedValue !== undefined) {
        transformedData.estimatedValue = data.estimatedValue;
      } else if (data.estimated_value !== undefined) {
        transformedData.estimatedValue = data.estimated_value;
      } else {
        transformedData.estimatedValue = 0;
      }
      
      // Handle camelCase and snake_case variations for confidenceScore/confidence_score
      if (data.confidenceScore !== undefined) {
        transformedData.confidenceScore = data.confidenceScore;
      } else if (data.confidence_score !== undefined) {
        transformedData.confidenceScore = data.confidence_score;
      } else {
        transformedData.confidenceScore = 75;
      }
      
      // Add additional properties with proper null fallbacks
      transformedData.color = data.color || null;
      
      // Handle bodyStyle/body_style
      if (data.bodyStyle !== undefined) {
        transformedData.bodyStyle = data.bodyStyle;
      } else if (data.body_style !== undefined) {
        transformedData.bodyStyle = data.body_style;
      } else {
        transformedData.bodyStyle = null;
      }
      
      // Handle bodyType/body_type
      if (data.bodyType !== undefined) {
        transformedData.bodyType = data.bodyType;
      } else if (data.body_type !== undefined) {
        transformedData.bodyType = data.body_type;
      } else {
        transformedData.bodyType = null;
      }
      
      // Handle fuelType/fuel_type
      if (data.fuelType !== undefined) {
        transformedData.fuelType = data.fuelType;
      } else if (data.fuel_type !== undefined) {
        transformedData.fuelType = data.fuel_type;
      } else {
        transformedData.fuelType = null;
      }
      
      transformedData.explanation = data.explanation || null;
      transformedData.transmission = data.transmission || null;
      
      // Add snake_case versions for backward compatibility
      transformedData.body_style = transformedData.bodyStyle;
      transformedData.body_type = transformedData.bodyType;
      transformedData.fuel_type = transformedData.fuelType;
      
      return transformedData;
    },
    enabled: !!valuationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
