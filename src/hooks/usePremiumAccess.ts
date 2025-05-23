
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export function usePremiumAccess(valuationId?: string) {
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkPremiumAccess = async () => {
      setIsLoading(true);
      
      try {
        // If no user, definitely no premium access
        if (!user) {
          setHasPremiumAccess(false);
          setIsLoading(false);
          return;
        }
        
        // Check user's subscription status
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();
          
        if (subscriptionData && !subscriptionError) {
          setHasPremiumAccess(true);
          setIsLoading(false);
          return;
        }
        
        // If valuationId is provided, check if this specific valuation has premium access
        if (valuationId) {
          const { data: premiumValuation, error: premiumError } = await supabase
            .from('premium_valuations')
            .select('*')
            .eq('valuation_id', valuationId)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (premiumValuation && !premiumError) {
            setHasPremiumAccess(true);
            setIsLoading(false);
            return;
          }
        }
        
        // No premium access found
        setHasPremiumAccess(false);
      } catch (error) {
        console.error('Error checking premium access:', error);
        setHasPremiumAccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPremiumAccess();
  }, [user, valuationId]);

  return { hasPremiumAccess, isLoading };
}
