
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export function usePremiumDealer() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('profiles')
          .select('is_premium_dealer, premium_expires_at')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        // Check if the user is a premium dealer and if premium hasn't expired
        const isPremiumActive = 
          data?.is_premium_dealer === true && 
          (!data?.premium_expires_at || new Date(data.premium_expires_at) > new Date());

        setIsPremium(isPremiumActive);
      } catch (err) {
        console.error('Error checking premium status:', err);
        setError('Failed to check premium status');
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user]);

  return { isPremium, isLoading, error };
}
