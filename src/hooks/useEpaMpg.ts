
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EpaMpgResult {
  data: {
    menuItem: string;
    value: string;
    text: string;
  };
  source: string;
}

export function useEpaMpg(year: number, make: string, model: string) {
  return useQuery({
    queryKey: ['epaMpg', year, make, model],
    queryFn: async (): Promise<EpaMpgResult | null> => {
      // Skip API call if required parameters are missing
      if (!year || !make || !model) {
        return null;
      }

      try {
        const { data, error } = await supabase.functions.invoke('fetch_epa_mpg', {
          body: { year, make, model },
        });

        if (error) {
          throw new Error(error.message);
        }

        return data;
      } catch (error: any) {
        toast.error(`Failed to fetch EPA MPG data: ${error.message}`);
        throw error;
      }
    },
    enabled: Boolean(year && make && model),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
