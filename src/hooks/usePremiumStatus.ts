import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function usePremiumStatus(valuationId?: string) {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!valuationId || !user) {
      setIsPremium(false);
      setIsLoading(false);
      return;
    }

    async function checkPremiumStatus() {
      setIsLoading(true);
      setError(null);
      
      try {
        // First, check if the valuation itself has premium_unlocked flag
        const { data: valuationData, error: valuationError } = await supabase
          .from('valuations')
          .select('premium_unlocked')
          .eq('id', valuationId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (valuationError) throw new Error(valuationError.message);
        
        // If valuation has premium_unlocked set to true, it's premium
        if (valuationData?.premium_unlocked) {
          setIsPremium(true);
          setIsLoading(false);
          return;
        }
        
        // Otherwise, check if there's a completed order for this valuation
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('status')
          .eq('valuation_id', valuationId)
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .maybeSingle();
        
        if (orderError) throw new Error(orderError.message);
        
        // Set premium status based on order existence
        setIsPremium(!!orderData);
      } catch (err) {
        console.error('Error checking premium access:', err);
        setError(err instanceof Error ? err : new Error('Failed to check premium status'));
      } finally {
        setIsLoading(false);
      }
    }
    
    checkPremiumStatus();
    
    // Check URL for successful payment
    const url = new URL(window.location.href);
    if (url.searchParams.get('session_id')) {
      toast.success('Payment successful! Your premium features are now unlocked.');
    }
  }, [valuationId, user]);

  return { isPremium, isLoading, error };
}
