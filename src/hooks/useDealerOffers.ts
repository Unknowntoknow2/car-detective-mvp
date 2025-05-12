
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
  // New AI scoring fields
  score?: number;
  label?: string;
  insight?: string;
}

export interface SubmitOfferParams {
  reportId: string;
  offer_amount?: number;
  amount?: number;
  message?: string;
  userId?: string;
  user_id?: string;
}

// Improved type for offer status update
export interface UpdateOfferStatusParams {
  offerId: string;
  status: 'viewed' | 'accepted' | 'rejected';
}

export function useDealerOffers(reportId?: string) {
  const { user } = useAuth();

  // Query for fetching dealer offers
  const { data: rawOffers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['dealer-offers', user?.id, reportId],
    queryFn: async (): Promise<any[]> => {
      if (!user) return [];

      try {
        if (reportId) {
          // If reportId is provided, fetch offers for that specific report
          const { data, error } = await supabase
            .from('dealer_offers')
            .select('*')
            .eq('report_id', reportId)
            .order('created_at', { ascending: false });

          if (error) throw error;
          return data || [];
        } else {
          // For dealers, fetch offers they've sent
          const { data: dealerData, error: dealerError } = await supabase
            .from('dealer_offers')
            .select('*')
            .eq('dealer_id', user.id)
            .order('created_at', { ascending: false });

          if (dealerError) throw dealerError;
          
          // For regular users, fetch offers sent to them
          const { data: userData, error: userError } = await supabase
            .from('dealer_offers')
            .select('*, valuations!inner(*)')
            .eq('valuations.user_id', user.id)
            .order('created_at', { ascending: false });

          if (userError) throw userError;
          
          // Return appropriate data based on user role
          return [...(dealerData || []), ...(userData || [])];
        }
      } catch (error) {
        console.error('Error fetching dealer offers:', error);
        throw error;
      }
    },
    enabled: !!user,
    refetchInterval: 60000, // Refetch every minute
  });

  // Convert raw offers to properly typed DealerOffer objects
  const offers: DealerOffer[] = rawOffers.map(offer => ({
    ...offer,
    status: (offer.status as 'sent' | 'viewed' | 'accepted' | 'rejected') || 'sent'
  }));

  // Update offer status (viewed, accepted, rejected)
  const updateOfferStatus = async (params: UpdateOfferStatusParams) => {
    if (!user) {
      toast.error('You must be logged in to update an offer');
      return null;
    }

    try {
      const { offerId, status } = params;
      
      const { data, error } = await supabase
        .from('dealer_offers')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', offerId)
        .select()
        .single();

      if (error) throw error;
      
      toast.success(`Offer ${status} successfully!`);
      refetch();
      return data;
    } catch (error) {
      console.error('Error updating offer status:', error);
      toast.error('Failed to update offer status');
      return null;
    }
  };

  // Submit new dealer offer
  const submitOffer = async (params: SubmitOfferParams, options?: { onSuccess?: () => void }) => {
    if (!user) {
      toast.error('You must be logged in to submit an offer');
      return null;
    }

    try {
      // Handle different parameter names (some components use amount, others use offer_amount)
      const amount = params.amount || params.offer_amount;
      const userId = params.userId || params.user_id;
      
      if (!amount) {
        toast.error('Offer amount is required');
        return null;
      }

      if (!params.reportId) {
        toast.error('Report ID is required');
        return null;
      }

      const offerData = {
        dealer_id: user.id,
        report_id: params.reportId,
        offer_amount: amount,
        message: params.message || '',
        status: 'sent',
        user_id: userId
      };

      const { data, error } = await supabase
        .from('dealer_offers')
        .insert(offerData)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Offer submitted successfully!');
      refetch();
      
      // Call onSuccess callback if provided
      if (options?.onSuccess) {
        options.onSuccess();
      }
      
      return data;
    } catch (error) {
      console.error('Error submitting offer:', error);
      toast.error('Failed to submit offer');
      return null;
    }
  };

  // Get the best offer based on score
  const getBestOffer = (): DealerOffer | null => {
    if (!offers || offers.length === 0) return null;
    
    // Sort by score (highest first) and return the top offer
    return [...offers].sort((a, b) => (b.score || 0) - (a.score || 0))[0];
  };

  const isSubmitting = false; // This would be state if we tracked loading state

  return {
    offers,
    isLoading,
    error,
    refetch,
    updateOfferStatus,
    submitOffer,
    isSubmitting,
    getBestOffer
  };
}
