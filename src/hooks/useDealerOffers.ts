
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export interface DealerOffer {
  id: string;
  lead_id: string;
  dealer_id: string;
  offer_price: number;
  notes?: string;
  status: 'sent' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export function useDealerOffers(leadId?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: offers, isLoading } = useQuery({
    queryKey: ['dealer-offers', leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dealer_offers')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DealerOffer[];
    },
    enabled: !!leadId
  });

  const { mutate: submitOffer, isPending: isSubmitting } = useMutation({
    mutationFn: async ({ 
      leadId, 
      offerPrice, 
      notes 
    }: { 
      leadId: string; 
      offerPrice: number; 
      notes?: string;
    }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('dealer_offers')
        .insert({
          lead_id: leadId,
          dealer_id: user.id,
          offer_price: offerPrice,
          notes: notes || null,
          status: 'sent'
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
