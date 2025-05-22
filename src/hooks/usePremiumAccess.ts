
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function usePremiumAccess(valuationId?: string) {
  const { user } = useAuth();
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setHasPremiumAccess(false);
      setIsLoading(false);
      return;
    }

    async function checkPremiumAccess() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if the valuation has been specifically unlocked
        if (valuationId && user) {
          // First check if this specific valuation was unlocked via a direct purchase
          const { data: valuationData, error: valuationError } = await supabase
            .from('valuations')
            .select('premium_unlocked')
            .eq('id', valuationId)
            .single();
            
          if (!valuationError && valuationData?.premium_unlocked) {
            setHasPremiumAccess(true);
            setIsLoading(false);
            return;
          }
          
          // Check if there's a paid order for this valuation
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('valuation_id', valuationId)
            .eq('user_id', user.id)
            .eq('status', 'paid')
            .maybeSingle();
            
          if (!orderError && orderData) {
            setHasPremiumAccess(true);
            setIsLoading(false);
            return;
          }
        }
        
        // Check for general premium access based on user profile
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('premium_expires_at, is_premium_dealer')
            .eq('id', user.id)
            .single();
            
          if (profileError) {
            throw profileError;
          }
          
          // Determine if user has premium access
          const hasPremium = profileData?.is_premium_dealer && 
            (profileData.premium_expires_at === null || 
             new Date(profileData.premium_expires_at) > new Date());
             
          setHasPremiumAccess(hasPremium);
        }
      } catch (err) {
        console.error('Error checking premium access:', err);
        setError(err instanceof Error ? err : new Error('Failed to check premium access'));
      } finally {
        setIsLoading(false);
      }
    }
    
    checkPremiumAccess();
  }, [valuationId, user]);

  return { hasPremiumAccess, isLoading, error };
}
