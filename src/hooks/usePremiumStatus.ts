
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatStripeError } from '@/utils/stripe-error-handling';

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
          .eq('status', 'paid')
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
      toast.info("Verifying payment...");
    }
  }, [valuationId, user]);

  // Function to create a checkout session with improved error handling
  const createCheckoutSession = async (valuationId: string): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      if (!user) {
        toast.error('You must be logged in to unlock premium features');
        return { success: false, error: 'Authentication required' };
      }

      if (!valuationId) {
        toast.error('Valuation ID is required');
        return { success: false, error: 'Missing valuation ID' };
      }

      toast.info('Preparing checkout...', { id: 'checkout-preparation' });
      
      // First, check if already unlocked to avoid unnecessary checkout
      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .select('premium_unlocked')
        .eq('id', valuationId)
        .maybeSingle();
      
      if (valuationError) {
        console.error('Error checking valuation status:', valuationError);
        // Continue anyway, since the edge function will also verify
      } else if (valuationData?.premium_unlocked) {
        toast.success('Premium features are already unlocked!');
        return { success: true, url: window.location.href };
      }
      
      // Call the Edge Function to create a checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { valuationId }
      });
      
      toast.dismiss('checkout-preparation');
      
      if (error) {
        console.error('Edge function error:', error);
        const formattedError = formatStripeError(error);
        toast.error(formattedError);
        return { success: false, error: formattedError };
      }
      
      // If already unlocked, return success
      if (data?.already_unlocked) {
        toast.success('Premium features are already unlocked!');
        return { success: true };
      }
      
      // Check that we have a URL
      if (!data?.url) {
        const errorMsg = 'No checkout URL returned from server';
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
      
      return { success: true, url: data.url };
    } catch (error) {
      console.error('Checkout error:', error);
      const formattedError = formatStripeError(error);
      toast.error(formattedError);
      return { success: false, error: formattedError };
    }
  };

  return { isPremium, isLoading, error, createCheckoutSession };
}
