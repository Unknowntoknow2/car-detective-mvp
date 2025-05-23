
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export function usePremiumAccess(valuationId?: string) {
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [creditsRemaining, setCreditsRemaining] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const checkPremiumAccess = async () => {
      setIsLoading(true);
      
      try {
        // If no user, definitely no premium access
        if (!user) {
          setHasPremiumAccess(false);
          setCreditsRemaining(0);
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
          
          // Also check credits
          const { data: creditsData } = await supabase
            .from('premium_access')
            .select('credits_remaining')
            .eq('user_id', user.id)
            .maybeSingle();
            
          setCreditsRemaining(creditsData?.credits_remaining || 0);
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
        
        // Check available credits
        const { data: creditsData } = await supabase
          .from('premium_access')
          .select('credits_remaining')
          .eq('user_id', user.id)
          .maybeSingle();
          
        setCreditsRemaining(creditsData?.credits_remaining || 0);
        
        // No premium access found
        setHasPremiumAccess(false);
      } catch (error) {
        console.error('Error checking premium access:', error);
        setHasPremiumAccess(false);
        setCreditsRemaining(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPremiumAccess();
  }, [user, valuationId]);

  // Add the usePremiumCredit function
  const usePremiumCredit = async (valId: string): Promise<boolean> => {
    if (!user || !valId) return false;
    
    try {
      setIsLoading(true);
      
      // Call the Supabase Edge Function to use a premium credit
      const { data, error } = await supabase.functions.invoke('use-premium-credit', {
        body: { valuationId: valId }
      });
      
      if (error) {
        console.error('Error using premium credit:', error);
        return false;
      }
      
      if (data?.success) {
        // Update local state
        setHasPremiumAccess(true);
        setCreditsRemaining(prev => Math.max(0, prev - 1));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error using premium credit:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { hasPremiumAccess, isLoading, creditsRemaining, usePremiumCredit };
}
