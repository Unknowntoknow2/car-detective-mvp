
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface ScrapedListing {
  id: string;
  title: string;
  price: number | null;
  url: string;
  platform: string;
  location: string | null;
  mileage: number | null;
  vin: string | null;
  created_at: string;
  updated_at: string | null;
}

export function useScrapedListings(vin: string) {
  return useQuery({
    queryKey: ['scraped-listings', vin],
    queryFn: async () => {
      if (!vin || vin.length !== 17) {
        return [];
      }

      const { data, error } = await supabase
        .from('scraped_listings')
        .select('*')
        .eq('vin', vin)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      return data as ScrapedListing[];
    },
    enabled: !!vin && vin.length === 17,
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: 1
  });
}
