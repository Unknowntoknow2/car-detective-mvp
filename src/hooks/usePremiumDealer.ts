
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export function usePremiumDealer() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function checkPremiumStatus() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch profile to check premium dealer status
        const { data, error } = await supabase
          .from('profiles')
          .select('is_premium_dealer, premium_expires_at')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching premium status:', error);
          setIsPremium(false);
        } else {
          // Check if user is a premium dealer and subscription hasn't expired
          const isPremiumActive = data?.is_premium_dealer && 
            (!data?.premium_expires_at || new Date(data.premium_expires_at) > new Date());
          
          setIsPremium(isPremiumActive);
          setExpiryDate(data?.premium_expires_at);
        }
      } catch (error) {
        console.error('Error in premium dealer check:', error);
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkPremiumStatus();
  }, [user]);

  return { isPremium, isLoading, expiryDate };
}
