
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function usePremiumPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const createPaymentSession = async (valuationId: string, returnUrl?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { valuationId, returnUrl }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to create payment session');
      }
      
      if (!data?.url) {
        throw new Error('No checkout URL returned from server');
      }
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      return { success: true, url: data.url };
    } catch (err: any) {
      console.error('Error creating payment session:', err);
      setError(err.message || 'Failed to initiate payment');
      toast.error(err.message || 'Failed to initiate payment');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyPaymentSession = async (sessionId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to verify payment');
      }
      
      if (data.success) {
        toast.success('Payment successful! Premium features unlocked.');
        
        // Navigate to the valuation page if there's a valuationId
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
      toast.error(err.message || 'Failed to verify payment');
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
