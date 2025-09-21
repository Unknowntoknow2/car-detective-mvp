
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { notifyDealerOfAcceptedOffer } from '@/lib/notifications/UserValuationAlert';
import { toast } from 'sonner';

export interface OfferActionOptions {
  offerId: string;
  offerAmount: number;
  dealerEmail?: string;
  userEmail?: string;
  vin?: string;
  valuationId?: string;
  dealerId?: string;
}

export function useDealerOfferActions() {
  const [isProcessing, setIsProcessing] = useState(false);

  const acceptOffer = async (options: OfferActionOptions) => {
    setIsProcessing(true);
    
    try {

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Update offer status in database
      const { error: updateError } = await supabase
        .from('dealer_offers')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', options.offerId);

      if (updateError) {
        throw new Error(`Failed to update offer status: ${updateError.message}`);
      }

      // Create accepted offer record
      const { data: acceptedOffer, error: acceptedError } = await supabase
        .from('accepted_offers')
        .insert({
          valuation_id: options.valuationId,
          dealer_offer_id: options.offerId,
          user_id: user.id,
          dealer_id: options.dealerId,
          status: 'pending'
        })
        .select()
        .single();

      if (acceptedError) {
        throw new Error(`Failed to create accepted offer: ${acceptedError.message}`);
      }

      // Optional: Log acceptance for AIN learning
      if (options.valuationId) {
        const { data: valuationData } = await supabase
          .from('valuations')
          .select('estimated_value, zip_code')
          .eq('id', options.valuationId)
          .single();

        if (valuationData) {
          await supabase
            .from('offer_acceptance_log')
            .insert({
              accepted_offer_id: acceptedOffer.id,
              price_delta: options.offerAmount - valuationData.estimated_value,
              valuation_price: valuationData.estimated_value,
              accepted_price: options.offerAmount,
              user_zip_code: valuationData.zip_code
            });
        }
      }

      // Send notification to dealer if email information is available
      if (options.dealerEmail && options.userEmail && options.vin) {
        await notifyDealerOfAcceptedOffer({
          dealerEmail: options.dealerEmail,
          userEmail: options.userEmail,
          vin: options.vin,
          offerPrice: options.offerAmount
        });
      }

      toast.success('Offer accepted successfully! The dealer has been notified and will contact you soon.');
      return { success: true, acceptedOffer };
    } catch (error) {
      console.error('❌ Error accepting offer:', error);
      toast.error('Failed to accept offer. Please try again.');
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  const rejectOffer = async (offerId: string) => {
    setIsProcessing(true);
    
    try {
      const { error } = await supabase
        .from('dealer_offers')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', offerId);

      if (error) {
        throw new Error(`Failed to reject offer: ${error.message}`);
      }

      toast.success('Offer rejected.');
      return { success: true };
    } catch (error) {
      console.error('❌ Error rejecting offer:', error);
      toast.error('Failed to reject offer. Please try again.');
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelAcceptedOffer = async (acceptedOfferId: string) => {
    setIsProcessing(true);
    
    try {
      // Update accepted offer status to cancelled
      const { error: cancelError } = await supabase
        .from('accepted_offers')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', acceptedOfferId);

      if (cancelError) {
        throw new Error(`Failed to cancel accepted offer: ${cancelError.message}`);
      }

      // Reset the original dealer offer status back to sent
      const { data: acceptedOffer } = await supabase
        .from('accepted_offers')
        .select('dealer_offer_id')
        .eq('id', acceptedOfferId)
        .single();

      if (acceptedOffer) {
        await supabase
          .from('dealer_offers')
          .update({ status: 'sent', updated_at: new Date().toISOString() })
          .eq('id', acceptedOffer.dealer_offer_id);
      }

      toast.success('Accepted offer cancelled successfully.');
      return { success: true };
    } catch (error) {
      console.error('❌ Error cancelling accepted offer:', error);
      toast.error('Failed to cancel accepted offer. Please try again.');
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    acceptOffer,
    rejectOffer,
    cancelAcceptedOffer,
    isProcessing
  };
}
