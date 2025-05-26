
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { ValuationResult } from '@/types/valuation';

interface UseValuationDataReturn {
  data: ValuationResult | null;
  isLoading: boolean;
  error: Error | string | null;
  isError: boolean;
  refetch: () => void;
}

// Helper function to validate UUID format
const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

// Helper function to validate VIN format
const isValidVIN = (vin: string): boolean => {
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
};

export function useValuationData(valuationId: string): UseValuationDataReturn {
  const [data, setData] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchData = async () => {
    // Check for invalid or placeholder IDs
    if (!valuationId || valuationId === ':id' || valuationId === '%3Aid') {
      setIsLoading(false);
      setIsError(true);
      setError('No valuation ID or VIN provided');
      console.log('Invalid valuationId (placeholder):', valuationId);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
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
        throw apiError;
      }

      if (result) {
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
            result.price_range = [
              Math.round(result.estimated_value * 0.9),
              Math.round(result.estimated_value * 1.1)
            ];
          }
        }

        setData(result as ValuationResult);
      } else {
        setError('Valuation not found');
        setIsError(true);
      }
    } catch (err: any) {
      console.error('Error fetching valuation result:', err);
      setError(err.message || 'Failed to fetch valuation data');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [valuationId]);

  // Refetch function for manually triggering a refresh
  const refetch = () => {
    fetchData();
  };

  return { data, isLoading, error, isError, refetch };
}
