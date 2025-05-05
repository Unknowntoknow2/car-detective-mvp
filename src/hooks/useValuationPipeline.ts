
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useValuationPipeline() {
  const { user } = useAuth();

  // Mark referral as earned when a user purchases premium
  const markReferralEarnedForPremium = async (userId: string) => {
    try {
      await supabase.functions.invoke('process-referral', {
        body: {
          action: 'mark-earned',
          userId,
          rewardType: 'premium',
          rewardAmount: 10.00
        }
      });
    } catch (error) {
      console.error('Error marking premium referral as earned:', error);
      // Don't show error to user
    }
  };

  // Mark referral as earned for premium purchase
  const handlePremiumPurchase = () => {
    if (user) {
      markReferralEarnedForPremium(user.id);
    }
  };

  return {
    handlePremiumPurchase
  };
}
