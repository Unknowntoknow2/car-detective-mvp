
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function usePremiumPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Creates a Stripe checkout session for premium access
   * @param valuationId The valuation ID to associate with the premium purchase
   * @param returnUrl Optional custom return URL after successful payment
   */
  const createPaymentSession = async (valuationId: string, returnUrl?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the Supabase Edge Function to create a Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          valuationId,
          returnUrl: returnUrl || `/premium-success?valuation_id=${valuationId}`
        }
      });
      
      if (error) throw error;
      
      if (!data?.url) {
        throw new Error('No checkout URL returned from server');
      }
      
      // Redirect to the Stripe checkout page
      window.location.href = data.url;
      
      return { success: true };
    } catch (err: any) {
      console.error('Error creating payment session:', err);
      setError(err.message || 'Failed to initiate payment');
      toast.error('Failed to initiate payment', {
        description: err.message || 'An unexpected error occurred'
      });
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Verifies a payment session after returning from Stripe
   * @param sessionId The Stripe session ID
   */
  const verifyPaymentSession = async (sessionId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the Supabase Edge Function to verify the payment
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success('Payment successful! Premium features unlocked.');
        
        // If there's a valuation ID, redirect to the valuation page
        if (data.valuationId) {
          navigate(`/valuation/${data.valuationId}`);
        }
      } else {
        toast.error('Payment verification failed.');
      }
      
      return data;
    } catch (err: any) {
      console.error('Error verifying payment:', err);
      setError(err.message || 'Failed to verify payment');
      toast.error('Failed to verify payment', {
        description: err.message || 'An unexpected error occurred'
      });
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    error,
    createPaymentSession,
    verifyPaymentSession
  };
}
