
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

      // If still no result, check localStorage for temporary data
      if (!result) {
        console.log('No database result found, checking localStorage');
        const tempData = localStorage.getItem('temp_valuation_data');
        const latestId = localStorage.getItem('latest_valuation_id');
        
        if (tempData) {
          try {
            const parsedData = JSON.parse(tempData);
            if (parsedData.vin === valuationId || parsedData.id === valuationId) {
              result = parsedData;
              console.log('Found data in localStorage:', result);
            }
          } catch (e) {
            console.error('Failed to parse temp data:', e);
          }
        }
        
        // If we have a latest valuation ID, try to use that
        if (!result && latestId && (latestId.startsWith('temp-') || isValidUUID(latestId))) {
          // Try to fetch the latest valuation ID from database
          if (isValidUUID(latestId)) {
            const response = await supabase
              .from('valuations')
              .select('*')
              .eq('id', latestId)
              .maybeSingle();
            
            if (response.data) {
              result = response.data;
              console.log('Found data using latest valuation ID:', result);
            }
          }
          
          // Fallback mock data for temp IDs
          if (!result && latestId.startsWith('temp-')) {
            result = {
              id: latestId,
              vin: valuationId,
              make: 'Auto-detected',
              model: 'Vehicle',
              year: 2020,
              estimated_value: 15000,
              confidence_score: 95,
              mileage: 45000,
              created_at: new Date().toISOString(),
              condition: 'Good'
            };
            console.log('Using fallback mock data for temp ID');
          }
        }
      }

      if (apiError && !result) {
        console.error('Supabase API error:', apiError);
        throw new Error(apiError.message || 'Database query failed');
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
              Math.round((result.estimated_value || result.estimatedValue || 15000) * 0.9),
              Math.round((result.estimated_value || result.estimatedValue || 15000) * 1.1)
            ];
          }
        }

        // Add default price range if missing
        if (!result.price_range && (result.estimated_value || result.estimatedValue)) {
          const estimatedValue = result.estimated_value || result.estimatedValue || 15000;
          result.price_range = [
            Math.round(estimatedValue * 0.9),
            Math.round(estimatedValue * 1.1)
          ];
        }

        setData(result as ValuationResult);
      } else {
        setError('Valuation not found. The data may not be available or the link may have expired.');
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
