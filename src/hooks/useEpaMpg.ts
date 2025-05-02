
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EpaMpgResponse {
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
    queryFn: async () => {
      // Validate required parameters
      if (!year || !make || !model) {
        return null;
      }

      const { data, error } = await supabase.functions.invoke('fetch_epa_mpg', {
        body: { year, make, model },
      });

      if (error) {
        toast.error(`Error fetching EPA MPG data: ${error.message}`);
        throw error;
      }

      return data as EpaMpgResponse;
    },
    enabled: !!year && !!make && !!model
  });
}
