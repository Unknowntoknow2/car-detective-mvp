
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RecallRecord {
  NHTSACampaignNumber: string;
  Component: string;
  Summary: string;
  Consequence: string;
  Remedy: string;
  ModelYear: number;
  Make: string;
  Model: string;
}

export interface UseNhtsaRecallsResult {
  data?: RecallRecord[];
  loading: boolean;
  error?: string;
}

export function useNhtsaRecalls(
  make: string,
  model: string,
  year: number
): UseNhtsaRecallsResult {
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['nhtsaRecalls', make, model, year],
    queryFn: async () => {
      // Only run the query if we have all the necessary parameters
      if (!make || !model || !year) {
        return { Results: [] };
      }

      try {
        const { data, error } = await supabase.functions.invoke('fetch_nhtsa_recalls', {
          body: { make, model, year },
        });

        if (error) {
          console.error('NHTSA recalls fetch error:', error);
          throw new Error(error.message || 'Failed to fetch recall data');
        }

        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch recall data';
        console.error('NHTSA recalls error:', err);
        toast.error(errorMsg);
        throw err;
      }
    },
    enabled: Boolean(make) && Boolean(model) && Boolean(year),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    data: data?.Results,
    loading: isLoading,
    error: error ? (error as Error).message : undefined,
  };
}
