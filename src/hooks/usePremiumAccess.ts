
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
        const result = await checkPremiumAccess(user?.id || '', valuationId);

        if (typeof result === 'boolean') {
          setHasPremiumAccess(result);
        } else if (result && typeof result === 'object' && 'hasPremium' in result) {
          setHasPremiumAccess((result as any).hasPremium);
        } else {
          setHasPremiumAccess(false);
        }
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
