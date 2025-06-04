<<<<<<< HEAD

import { useState } from 'react';
import { verifyPaymentSession, createCheckoutSession } from '@/utils/stripeService';
import { toast } from 'sonner';
=======
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface UsePremiumPaymentResult {
  isLoading: boolean;
  error: Error | null;
  verifyPaymentSession: (sessionId: string) => Promise<boolean>;
  createPaymentSession: (valuationId: string, returnUrl?: string) => Promise<void>;
}

export function usePremiumPayment(): UsePremiumPaymentResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

<<<<<<< HEAD
  const verifyPayment = async (sessionId: string): Promise<boolean> => {
    if (!sessionId) {
      setError(new Error('No session ID provided'));
      return false;
    }

=======
  const createPaymentSession = async (
    valuationId: string,
    returnUrl?: string,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // For now, simulate a successful payment creation
      // In a real implementation, this would call a Supabase function to create a Stripe checkout
      console.log(`Creating payment session for valuation: ${valuationId}`);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate a successful response
      const mockUrl =
        `/premium-success?session_id=mock_session_123&valuation_id=${valuationId}`;

      // In production, this would open Stripe checkout
      return { success: true, url: mockUrl };
    } catch (err: any) {
      console.error("Error creating payment session:", err);
      setError(err.message || "Failed to initiate payment");
      toast.error(err.message || "Failed to initiate payment");
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPaymentSession = async (sessionId: string) => {
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    setIsLoading(true);
    setError(null);

    try {
<<<<<<< HEAD
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
=======
      // For now, simulate a successful payment verification
      // In a real implementation, this would call a Supabase function to verify the Stripe session
      console.log(`Verifying payment session: ${sessionId}`);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get valuation ID from URL if available
      const urlParams = new URLSearchParams(globalThis.location.search);
      const valuationId = urlParams.get("valuation_id");

      // Simulate a successful response
      const mockResponse = {
        success: true,
        status: "paid",
        valuationId: valuationId,
      };

      if (mockResponse.success) {
        toast.success("Payment successful! Premium features unlocked.");

        // Navigate to the valuation page if there's a valuationId
        if (mockResponse.valuationId) {
          navigate(`/valuation/${mockResponse.valuationId}`);
        }
      } else {
        toast.error("Payment verification failed.");
      }

      return mockResponse;
    } catch (err: any) {
      console.error("Error verifying payment:", err);
      setError(err.message || "Failed to verify payment");
      toast.error(err.message || "Failed to verify payment");
      return { success: false, error: err.message };
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
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
=======
  return {
    isLoading,
    error,
    createPaymentSession,
    verifyPaymentSession,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
}
