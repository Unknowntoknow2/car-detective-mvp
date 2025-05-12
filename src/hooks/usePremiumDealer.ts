
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function usePremiumDealer() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  useEffect(() => {
    async function checkPremiumStatus() {
      if (!user) {
        setIsPremium(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // First check the profile table
        const { data, error } = await supabase
          .from('profiles')
          .select('is_premium_dealer, premium_expires_at, user_role')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error checking premium status:', error);
          setIsPremium(false);
          return;
        }
        
        // User must be a dealer and have premium access
        const isDealer = data?.user_role === 'dealer';
        const hasPremium = data?.is_premium_dealer === true;
        const premiumExpired = data?.premium_expires_at 
          ? new Date(data.premium_expires_at) < new Date() 
          : false;
        
        if (isDealer && hasPremium && !premiumExpired) {
          setIsPremium(true);
          setExpiresAt(data?.premium_expires_at ? new Date(data.premium_expires_at) : null);
        } else {
          setIsPremium(false);
        }
      } catch (err) {
        console.error('Error in premium dealer check:', err);
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkPremiumStatus();
  }, [user]);

  return { isPremium, isLoading, expiresAt };
}
