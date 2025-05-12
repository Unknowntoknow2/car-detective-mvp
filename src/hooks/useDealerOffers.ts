
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Define types for dealer offers
export interface DealerOffer {
  id: string;
  dealer_id: string;
  report_id: string;
  offer_amount: number;
  message: string;
  status: 'sent' | 'viewed' | 'accepted' | 'rejected';
  created_at: string;
  user_id?: string;
  updated_at?: string;
}

export interface SubmitOfferParams {
  report_id: string;
  offer_amount: number;
  message: string;
  user_id: string;
}

export function useDealerOffers() {
  const { user } = useAuth();

  // Query for fetching dealer offers
  const { data: rawOffers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['dealer-offers', user?.id],
    queryFn: async (): Promise<any[]> => {
      if (!user) return [];

      // For dealers, fetch offers they've sent
      const { data: dealerData, error: dealerError } = await supabase
        .from('dealer_offers')
        .select('*')
        .eq('dealer_id', user.id)
        .order('created_at', { ascending: false });

      if (dealerError) {
        console.error('Error fetching dealer offers:', dealerError);
        throw dealerError;
      }
      
      // For regular users, fetch offers sent to them
      const { data: userData, error: userError } = await supabase
        .from('dealer_offers')
        .select('*, valuations!inner(*)')
        .eq('valuations.user_id', user.id)
        .order('created_at', { ascending: false });

      if (userError) {
        console.error('Error fetching user offers:', userError);
        throw userError;
      }
      
      // Return appropriate data based on user role
      // For simplicity, we're returning all offers for now
      return [...(dealerData || []), ...(userData || [])];
    },
    enabled: !!user,
    refetchInterval: 60000, // Refetch every minute
  });

  // Convert raw offers to properly typed DealerOffer objects
  const offers: DealerOffer[] = rawOffers.map(offer => ({
    ...offer,
    status: (offer.status as 'sent' | 'viewed' | 'accepted' | 'rejected') || 'sent'
  }));

  // Add stub functions to satisfy components that expect these functions
  const updateOfferStatus = async () => {
    console.warn('updateOfferStatus is not implemented');
    return null;
  };

  const submitOffer = async () => {
    console.warn('submitOffer is not implemented');
    return null;
  };

  const isSubmitting = false;

  return {
    offers,
    isLoading,
    error,
    refetch,
    updateOfferStatus,
    submitOffer,
    isSubmitting
  };
}
