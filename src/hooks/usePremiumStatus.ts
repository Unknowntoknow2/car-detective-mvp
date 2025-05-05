
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePremiumStatus(valuationId?: string) {
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!valuationId) return;

    const checkPremiumStatus = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('valuations')
          .select('*')
          .eq('id', valuationId)
          .single();
          
        if (error) {
          throw new Error(error.message);
        }
        
        // Use type assertion to access the premium_unlocked property
        type ValuationWithPremium = typeof data & { premium_unlocked?: boolean };
        const valuationData = data as ValuationWithPremium;
        
        // Access the premium_unlocked property safely
        setIsPremiumUnlocked(!!valuationData.premium_unlocked);
      } catch (err) {
        console.error('Error checking premium status:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [valuationId]);

  const unlockPremium = async (valuationId: string) => {
    try {
      // Call the create-checkout function to handle payment
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { valuationId }
      });
      
      if (error) throw new Error(error.message);
      
      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
      
    } catch (err) {
      console.error('Error creating checkout session:', err);
      toast.error('Failed to start checkout process');
      return false;
    }
  };

  return { 
    isPremiumUnlocked, 
    isLoading, 
    error,
    unlockPremium 
  };
}
