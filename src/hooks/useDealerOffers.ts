
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Define types for dealer offers
interface DealerOffer {
  id: string;
  dealer_id: string;
  report_id: string;
  offer_amount: number;
  message: string;
  status: 'sent' | 'viewed' | 'accepted' | 'rejected';
  created_at: string;
}

export function useDealerOffers() {
  const { user } = useAuth();

  // Query for fetching dealer offers
  const { data: offers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['dealer-offers', user?.id],
    queryFn: async (): Promise<DealerOffer[]> => {
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

  return {
    offers,
    isLoading,
    error,
    refetch,
  };
}
