
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useValuationResult(valuationId?: string) {
  return useQuery({
    queryKey: ['valuation', valuationId],
    queryFn: async () => {
      if (!valuationId) {
        throw new Error('Valuation ID is required');
      }

      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch valuation: ${error.message}`);
      }

      return data;
    },
    enabled: !!valuationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
}
