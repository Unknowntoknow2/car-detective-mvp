
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface DealerOffer {
  id: string;
  report_id: string; // Changed from lead_id to match DB schema
  dealer_id: string;
  offer_price: number; // Changed from offer_amount to match interface expectations
  notes?: string;
  status: 'sent' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  user_id?: string;
}

// Type for submitOffer parameters
export interface SubmitOfferParams {
  reportId: string;  // Using reportId for consistency
  userId?: string;
  amount: number;
  message?: string;
}

export function useDealerOffers(reportId?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['dealer-offers', reportId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dealer_offers')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our DealerOffer interface
      return (data as any[]).map(item => ({
        ...item,
        offer_price: item.offer_amount // Map offer_amount to offer_price
      })) as DealerOffer[];
    },
    enabled: !!reportId
  });

  const { mutate: submitOffer, isPending: isSubmitting } = useMutation({
    mutationFn: async ({ 
      reportId, 
      amount, 
      message,
      userId
    }: SubmitOfferParams) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('dealer_offers')
        .insert({
          report_id: reportId,
          dealer_id: user.id,
          offer_amount: amount, // Using offer_amount for DB
          message: message || null,
          status: 'sent',
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-offers'] });
      toast.success('Offer submitted successfully');
    },
    onError: (error) => {
      toast.error('Failed to submit offer');
      console.error('Error submitting offer:', error);
    }
  });

  const { mutate: updateOfferStatus } = useMutation({
    mutationFn: async ({ offerId, status }: { offerId: string; status: 'accepted' | 'rejected' }) => {
      const { data, error } = await supabase
        .from('dealer_offers')
        .update({ status })
        .eq('id', offerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dealer-offers'] });
      toast.success('Offer status updated');
    },
    onError: (error) => {
      toast.error('Failed to update offer status');
      console.error('Error updating offer status:', error);
    }
  });

  return {
    offers: data || [],
    isLoading,
    isSubmitting,
    submitOffer,
    updateOfferStatus
  };
}
