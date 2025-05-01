
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ZipLocation {
  'place name': string;
  state: string;
  'state abbreviation': string;
  latitude: string;
  longitude: string;
}

export interface ZipValidationResult {
  country: string;
  'post code': string;
  places: ZipLocation[];
}

export function useZipValidation(zip: string) {
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['zipValidation', zip],
    queryFn: async () => {
      // Only run the query if we have a valid ZIP
      if (!zip || !/^\d{5}$/.test(zip)) {
        return null;
      }

      try {
        const { data, error } = await supabase.functions.invoke('fetch_zippopotamus', {
          body: { zip },
        });

        if (error) {
          console.error('ZIP validation error:', error);
          throw new Error(error.message || 'Failed to validate ZIP code');
        }

        return data as ZipValidationResult;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to validate ZIP code';
        console.error('ZIP validation error:', err);
        toast.error(errorMsg);
        throw err;
      }
    },
    enabled: Boolean(zip) && /^\d{5}$/.test(zip),
    staleTime: 1000 * 60 * 60 * 24 * 30, // 30 days
  });

  return {
    data,
    loading: isLoading,
    error: error ? (error as Error).message : undefined,
  };
}
