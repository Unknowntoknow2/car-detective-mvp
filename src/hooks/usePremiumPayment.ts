
import { useState } from 'react';
import { verifyPaymentSession } from '@/utils/stripeService';
import { toast } from 'sonner';

interface UsePremiumPaymentResult {
  isLoading: boolean;
  error: Error | null;
  verifyPaymentSession: (sessionId: string) => Promise<boolean>;
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

  return {
    isLoading,
    error,
    verifyPaymentSession: verifyPayment
  };
}
