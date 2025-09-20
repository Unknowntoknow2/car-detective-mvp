
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface UsePremiumPaymentResult {
  isLoading: boolean;
  error: Error | null;
  verifyPaymentSession: (sessionId: string) => Promise<boolean>;
  createPaymentSession: (valuationId: string, returnUrl?: string) => Promise<void>;
}

export function usePremiumPayment(): UsePremiumPaymentResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const createPaymentSession = async (
    valuationId: string,
    returnUrl?: string,
  ): Promise<void> => {
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
      toast.success("Payment session created successfully");
    } catch (err: any) {
      console.error("Error creating payment session:", err);
      setError(err.message || "Failed to initiate payment");
      toast.error(err.message || "Failed to initiate payment");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPaymentSession = async (sessionId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
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
        return true;
      } else {
        toast.error("Payment verification failed.");
        return false;
      }
    } catch (err: any) {
      console.error("Error verifying payment:", err);
      setError(err.message || "Failed to verify payment");
      toast.error(err.message || "Failed to verify payment");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createPaymentSession,
    verifyPaymentSession,
  };
}
