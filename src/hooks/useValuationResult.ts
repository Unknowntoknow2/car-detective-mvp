
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useValuationResult(valuationId: string | undefined) {
  return useQuery({
    queryKey: ['valuation-result', valuationId],
    queryFn: async () => {
      if (!valuationId) throw new Error('No valuation ID provided');
      
      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!valuationId,
  });
}
