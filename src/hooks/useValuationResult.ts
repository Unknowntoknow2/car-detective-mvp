
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getValuationResult, checkPremiumAccess } from '@/utils/valuationService';
import { Valuation } from '@/types/valuation-history';

// Define a more specific type for the valuation result
type ValuationResultData = {
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
  isPremium: boolean;
  bodyStyle?: string | null;
  bodyType?: string | null;
  fuelType?: string | null;
  color?: string | null;
  explanation?: string | null;
  transmission?: string | null;
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
  bestPhotoUrl?: string;
};

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
      const transformedData: ValuationResultData = { 
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
      
      // Only assign properties if they exist in the data object
      if ('color' in data && data.color !== undefined) {
        transformedData.color = data.color as string | null;
      }
      
      if ('bodyStyle' in data && data.bodyStyle !== undefined) {
        transformedData.bodyStyle = data.bodyStyle as string | null;
      }
      
      if ('bodyType' in data && data.bodyType !== undefined) {
        transformedData.bodyType = data.bodyType as string | null;
      }
      
      if ('fuelType' in data && data.fuelType !== undefined) {
        transformedData.fuelType = data.fuelType as string | null;
      }
      
      if ('explanation' in data && data.explanation !== undefined) {
        transformedData.explanation = data.explanation as string | null;
      }
      
      if ('transmission' in data && data.transmission !== undefined) {
        transformedData.transmission = data.transmission as string | null;
      }
      
      // Handle aiCondition if it exists
      if ('aiCondition' in data && data.aiCondition !== undefined) {
        transformedData.aiCondition = data.aiCondition;
      }
      
      return transformedData;
    },
    enabled: !!valuationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
