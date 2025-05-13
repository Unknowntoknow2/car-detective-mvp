
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';

export interface DealerOffer {
  id: string;
  report_id: string;
  dealer_id: string;
  offer_amount: number;
  message?: string;
  status: 'sent' | 'viewed' | 'accepted' | 'rejected' | 'pending'; // Added 'pending' status
  created_at: string;
  score?: number;
  label?: string;
  insight?: string;
}

export function useDealerOfferComparison(valuationId?: string) {
  const { data: offers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['dealer-offers', valuationId],
    queryFn: async (): Promise<DealerOffer[]> => {
      if (!valuationId) return [];

      try {
        const { data, error } = await supabase
          .from('dealer_offers')
          .select('*')
          .eq('report_id', valuationId)
          .order('score', { ascending: false });

        if (error) throw error;
        
        // Ensure the status is one of the allowed values in our type
        const typedData = data?.map(offer => ({
          ...offer,
          status: offer.status as DealerOffer['status']
        })) || [];
        
        return typedData;
      } catch (error) {
        console.error('Error fetching dealer offers:', error);
        toast.error('Failed to load dealer offers');
        throw error;
      }
    },
    enabled: !!valuationId,
    refetchInterval: 30000, // Refetch every 30 seconds to get new offers
  });

  const getBestOffer = (): DealerOffer | null => {
    if (!offers || offers.length === 0) return null;
    return offers[0]; // Already sorted by score DESC
  };

  return {
    offers,
    isLoading,
    error,
    refetch,
    getBestOffer,
    formatOfferAmount: (amount: number) => formatCurrency(amount)
  };
}
