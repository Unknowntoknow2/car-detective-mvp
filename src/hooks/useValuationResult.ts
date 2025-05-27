
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ValuationResult } from '@/types/valuation';

// Helper function to validate UUID format
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Helper function to validate VIN format
const isValidVIN = (vin: string): boolean => {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
};

export function useValuationResult(valuationId: string) {
  return useQuery({
    queryKey: ['valuation-result', valuationId],
    queryFn: async (): Promise<ValuationResult | null> => {
      // Check for invalid or placeholder IDs
      if (!valuationId || valuationId === ':id' || valuationId === '%3Aid') {
        throw new Error('No valuation ID or VIN provided');
      }

      console.log('Fetching valuation data for ID/VIN:', valuationId);
      
      let result = null;
      let apiError = null;

      // First try to fetch by ID if it's a valid UUID
      if (isValidUUID(valuationId)) {
        console.log('Attempting fetch by UUID:', valuationId);
        const response = await supabase
          .from('valuations')
          .select('*')
          .eq('id', valuationId)
          .maybeSingle();
        
        result = response.data;
        apiError = response.error;
      }
      
      // If no result and it looks like a VIN, try fetching by VIN
      if (!result && isValidVIN(valuationId)) {
        console.log('Attempting fetch by VIN:', valuationId);
        const response = await supabase
          .from('valuations')
          .select('*')
          .eq('vin', valuationId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        result = response.data;
        apiError = response.error;
      }

      if (apiError) {
        console.error('Supabase API error:', apiError);
        throw new Error(apiError.message || 'Failed to fetch valuation data');
      }

      if (!result) {
        throw new Error('Valuation not found');
      }

      console.log('Valuation data fetched successfully:', result);
      
      // Transform database result to match ValuationResult interface
      const transformedResult: ValuationResult = {
        id: result.id,
        vin: result.vin,
        year: result.year,
        make: result.make,
        model: result.model,
        fuelType: result.fuel_type,
        transmission: result.transmission,
        color: result.color,
        mileage: result.mileage,
        estimatedValue: result.estimated_value,
        confidenceScore: result.confidence_score,
        basePrice: result.base_price,
        isPremium: result.premium_unlocked,
        userId: result.user_id,
        created_at: result.created_at,
        zipCode: result.state
      };

      return transformedResult;
    },
    enabled: Boolean(valuationId) && valuationId !== ':id' && valuationId !== '%3Aid',
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's a "not found" error
      if (error?.message?.includes('not found') || error?.message?.includes('No valuation ID')) {
        return false;
      }
      return failureCount < 2;
    }
  });
}
