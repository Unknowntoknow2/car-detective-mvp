
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { DealerOffer } from '@/types/dealer';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useDealerOffers(reportId?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: offers, isLoading } = useQuery({
    queryKey: ['dealer-offers', reportId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dealer_offers')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DealerOffer[];
    },
    enabled: !!reportId
  });

  const { mutate: submitOffer, isPending: isSubmitting } = useMutation({
    mutationFn: async ({ 
      reportId, 
      userId, 
      amount, 
      message 
    }: { 
      reportId: string; 
      userId: string;
      amount: number; 
      message?: string;
    }) => {
      const { data, error } = await supabase
        .from('dealer_offers')
        .insert({
          report_id: reportId,
          user_id: userId,
          dealer_id: user?.id,
          offer_amount: amount,
          message: message || null,
          status: 'pending'
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
    offers,
    isLoading,
    isSubmitting,
    submitOffer,
    updateOfferStatus
  };
}
