
import { useState } from 'react';
import { verifyPaymentSession, createCheckoutSession } from '@/utils/stripeService';
import { toast } from 'sonner';

interface UsePremiumPaymentResult {
  isLoading: boolean;
  error: Error | null;
  verifyPaymentSession: (sessionId: string) => Promise<boolean>;
  createPaymentSession: (valuationId: string, returnUrl?: string) => Promise<void>;
}

export function usePremiumPayment(): UsePremiumPaymentResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const verifyPayment = async (sessionId: string): Promise<boolean> => {
    if (!sessionId) {
      setError(new Error('No session ID provided'));
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyPaymentSession(sessionId);
      
      if (result.success) {
        toast.success('Payment verified successfully');
        return true;
      } else {
        toast.error('Payment verification failed');
        setError(new Error(result.error || 'Payment verification failed'));
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during payment verification';
      console.error('Error verifying payment:', errorMessage);
      toast.error(errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createPaymentSession = async (valuationId: string, returnUrl?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createCheckoutSession({
        bundle: 'single',
        valuationId,
        successUrl: returnUrl
      });
      
      if (result.success && result.url) {
        // Redirect to Stripe checkout
        window.location.href = result.url;
      } else {
        throw new Error(result.error || 'Failed to create checkout session');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error creating payment session';
      console.error('Error creating payment session:', errorMessage);
      toast.error(errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    verifyPaymentSession: verifyPayment,
    createPaymentSession
  };
}
