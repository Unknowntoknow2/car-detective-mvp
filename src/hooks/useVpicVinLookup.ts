
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VpicResponse, VpicError, VpicVehicleData } from '@/types/vpic';

export interface UseVpicVinLookupResult {
  data: VpicVehicleData | null;
  loading: boolean;
  error: string | null;
  source: 'api' | 'cache' | null;
  fetchedAt: string | null;
  refresh: () => Promise<void>;
}

export function useVpicVinLookup(vin: string): UseVpicVinLookupResult {
  const [data, setData] = useState<VpicVehicleData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'api' | 'cache' | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const fetchData = async () => {
    // Don't fetch if VIN is invalid
    if (!vin || vin.length !== 17) {
      setError('Invalid VIN. Must be a 17-character string.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: responseData, error: responseError } = await supabase.functions.invoke<VpicResponse | VpicError>(
        'fetch_vpic_data',
        {
          body: { vin }
        }
      );

      if (responseError || 'error' in (responseData || {})) {
        const errorMessage = 'error' in (responseData || {}) 
          ? (responseData as VpicError).error 
          : responseError?.message || 'Unknown error';
        
        setError(errorMessage);
        setData(null);
        setSource(null);
        setFetchedAt(null);
      } else {
        const vpicResponse = responseData as VpicResponse;
        setData(vpicResponse.data);
        setSource(vpicResponse.source);
        setFetchedAt(vpicResponse.fetched_at);
      }
    } catch (err) {
      console.error('Error fetching vPIC data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch vPIC data');
      setData(null);
      setSource(null);
      setFetchedAt(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when VIN changes
  useEffect(() => {
    if (vin) {
      fetchData();
    } else {
      setData(null);
      setError(null);
      setSource(null);
      setFetchedAt(null);
    }
  }, [vin]);

  // Return the hook result
  return {
    data,
    loading,
    error,
    source,
    fetchedAt,
    refresh: fetchData
  };
}
