
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { checkPremiumAccess } from "@/utils/premiumService";

export function usePremiumAccess(valuationId?: string) {
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchPremiumAccess() {
      setIsLoading(true);
      setError(null);

      try {
        // Check if the function implementation in premiumService.ts returns an object
        const result = await checkPremiumAccess();

        // Extract the hasPremium boolean from the result
        setHasPremiumAccess(result.hasPremium);
      } catch (err) {
        console.error("Error checking premium access:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to check premium access"),
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchPremiumAccess();
  }, [valuationId, user]);

  return { hasPremiumAccess, isLoading, error };
}
