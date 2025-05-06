
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatStripeError } from '@/utils/stripe-error-handling';
import { checkPremiumAccess } from '@/utils/premiumService';

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
        // Use the checkPremiumAccess function that now uses the RPC function
        const hasPremiumAccess = await checkPremiumAccess(valuationId);
        setIsPremium(hasPremiumAccess);
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
      const hasPremiumAccess = await checkPremiumAccess(valuationId);
      if (hasPremiumAccess) {
        toast.success('Premium features are already unlocked!');
        return { success: true };
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
