
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
}

export function useDealerOfferActions() {
  const [isProcessing, setIsProcessing] = useState(false);

  const acceptOffer = async (options: OfferActionOptions) => {
    setIsProcessing(true);
    
    try {
      console.log('✅ Processing offer acceptance:', options);

      // Update offer status in database
      const { error: updateError } = await supabase
        .from('dealer_offers')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', options.offerId);

      if (updateError) {
        throw new Error(`Failed to update offer status: ${updateError.message}`);
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

      toast.success('Offer accepted successfully! The dealer has been notified.');
      return { success: true };
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

  return {
    acceptOffer,
    rejectOffer,
    isProcessing
  };
}
