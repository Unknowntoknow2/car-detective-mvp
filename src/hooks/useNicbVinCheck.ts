
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NicbResponse, NicbError, NicbData } from '@/types/nicb';

export interface UseNicbVinCheckResult {
  data: NicbData | null;
  loading: boolean;
  error: string | null;
  source: 'api' | 'cache' | null;
  fetchedAt: string | null;
  checkVin: (vin: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNicbVinCheck(): UseNicbVinCheckResult {
  const [data, setData] = useState<NicbData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'api' | 'cache' | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [currentVin, setCurrentVin] = useState<string>('');

  const checkVin = async (vin: string) => {
    if (!vin || vin.length !== 17) {
      setError('Invalid VIN. Must be a 17-character string.');
      return;
    }

    setCurrentVin(vin);
    await fetchData(vin);
  };

  const fetchData = async (vin: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: responseData, error: responseError } = await supabase.functions.invoke<NicbResponse | NicbError>(
        'fetch_nicb_vincheck',
        {
          body: { vin }
        }
      );

      if (responseError || (responseData && 'error' in responseData)) {
        const errorMessage = responseData && 'error' in responseData 
          ? (responseData as NicbError).error 
          : responseError?.message || 'Unknown error';
        
        setError(errorMessage);
        setData(null);
        setSource(null);
        setFetchedAt(null);
      } else if (responseData) {
        const nicbResponse = responseData as NicbResponse;
        setData(nicbResponse.data);
        setSource(nicbResponse.source);
        setFetchedAt(nicbResponse.fetched_at);
      }
    } catch (err) {
      console.error('Error fetching NICB data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch NICB data');
      setData(null);
      setSource(null);
      setFetchedAt(null);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    if (currentVin) {
      await fetchData(currentVin);
    }
  };

  return {
    data,
    loading,
    error,
    source,
    fetchedAt,
    checkVin,
    refresh
  };
}
