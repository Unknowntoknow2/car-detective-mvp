
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
          .single();
        
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
          .single();
        
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
      
      // Convert adjustments from string to array if needed
      if (result.adjustments && typeof result.adjustments === 'string') {
        try {
          result.adjustments = JSON.parse(result.adjustments);
        } catch (e) {
          console.error('Failed to parse adjustments:', e);
          result.adjustments = [];
        }
      }

      // Convert price range from string to array if needed
      if (result.price_range && typeof result.price_range === 'string') {
        try {
          result.price_range = JSON.parse(result.price_range);
        } catch (e) {
          console.error('Failed to parse price range:', e);
          result.price_range = {
            low: Math.round(result.estimated_value * 0.95),
            high: Math.round(result.estimated_value * 1.05)
          };
        }
      }

      return result as ValuationResult;
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
