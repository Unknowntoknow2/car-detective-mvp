
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CensusData {
  population: number;
  medianIncome: number;
  zip: string;
}

export interface CensusResult {
  data: CensusData;
  source: 'api' | 'cache';
}

export function useCensus(zip: string) {
  return useQuery({
    queryKey: ['census', zip],
    queryFn: async () => {
      try {
        // Only run the query if we have a valid ZIP
        if (!zip || !/^\d{5}$/.test(zip)) {
          return null;
        }

        const { data, error } = await supabase.functions.invoke('fetch_census_demographics', {
          body: { zip },
        });

        if (error) {
          console.error('Census data fetch error:', error);
          throw new Error(error.message || 'Failed to fetch census data');
        }

        return data as CensusResult;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch census data';
        console.error('Census hook error:', err);
        toast.error(errorMsg);
        throw err;
      }
    },
    enabled: Boolean(zip) && /^\d{5}$/.test(zip),
    staleTime: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
}
