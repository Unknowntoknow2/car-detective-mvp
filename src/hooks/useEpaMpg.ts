
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EpaMpgData {
  menuItem: string;
  value: string;
  text: string;
}

export interface EpaMpgResult {
  data: EpaMpgData[];
  source: 'api' | 'cache';
}

export function useEpaMpg(year: number, make: string, model: string) {
  return useQuery({
    queryKey: ['epaMpg', year, make, model],
    queryFn: async () => {
      try {
        // Only run the query if we have all required parameters
        if (!year || !make || !model) {
          return null;
        }

        const { data, error } = await supabase.functions.invoke('fetch_epa_mpg', {
          body: { year, make, model },
        });

        if (error) {
          console.error('EPA MPG fetch error:', error);
          throw new Error(error.message || 'Failed to fetch EPA MPG data');
        }

        return data as EpaMpgResult;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch EPA MPG data';
        console.error('EPA MPG hook error:', err);
        toast.error(errorMsg);
        throw err;
      }
    },
    enabled: Boolean(year) && Boolean(make) && Boolean(model),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
