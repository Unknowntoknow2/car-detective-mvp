
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

type PremiumDealerStatus = {
  isPremium: boolean;
  expiryDate: string | null;
  isLoading: boolean;
  error: Error | null;
};

export const usePremiumDealer = (): PremiumDealerStatus => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Get profile data which contains premium information
        const { data, error } = await supabase
          .from('profiles')
          .select('is_premium_dealer, premium_expires_at')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        const isPremiumActive = data.is_premium_dealer && 
          (!data.premium_expires_at || new Date(data.premium_expires_at) > new Date());

        setIsPremium(isPremiumActive);
        setExpiryDate(data.premium_expires_at);
      } catch (err) {
        console.error('Error checking premium status:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user]);

  return { isPremium, expiryDate, isLoading, error };
};
