
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AuctionIndexEntry {
  id: number;
  date: string;
  index_data: {
    overall_index: number;
    luxury_index: number;
    economy_index: number;
    suv_index: number;
    truck_index: number;
    [key: string]: number;
  };
}

export function useAuctionIndex(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['auctionIndex', startDate, endDate],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch_auction_index', {
          body: { startDate, endDate },
        });

        if (error) {
          console.error('Auction index fetch error:', error);
          throw new Error(error.message || 'Failed to fetch auction index data');
        }

        return data.data as AuctionIndexEntry[];
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch auction index data';
        console.error('Auction index hook error:', err);
        toast.error(errorMsg);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
  });
}
