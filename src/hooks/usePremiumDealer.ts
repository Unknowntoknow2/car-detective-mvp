
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function usePremiumDealer() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  useEffect(() => {
    async function checkPremiumStatus() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_premium_dealer, premium_expires_at')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking premium status:', error);
          setIsLoading(false);
          return;
        }

        // Check if user is premium and if premium hasn't expired
        const isPremiumUser = data?.is_premium_dealer === true;
        const expiryDateValue = data?.premium_expires_at ? new Date(data.premium_expires_at) : null;
        const hasValidSubscription = expiryDateValue ? expiryDateValue > new Date() : false;

        setIsPremium(isPremiumUser && hasValidSubscription);
        setExpiryDate(expiryDateValue);
      } catch (err) {
        console.error('Error in premium check:', err);
      } finally {
        setIsLoading(false);
      }
    }

    checkPremiumStatus();
  }, [user]);

  return { isPremium, isLoading, expiryDate };
}
