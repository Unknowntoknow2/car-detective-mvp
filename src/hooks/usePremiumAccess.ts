
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const usePremiumAccess = () => {
  const { userDetails, loading } = useAuth();
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      return;
    }

    try {
      if (userDetails) {
        const premiumAccess = Boolean(
          userDetails.is_premium_dealer ||
          ['admin', 'dealer'].includes(userDetails.role || '') ||
          (userDetails.premium_expires_at && new Date(userDetails.premium_expires_at) > new Date())
        );
        setHasPremiumAccess(premiumAccess);
      } else {
        setHasPremiumAccess(false);
      }
      setError(null);
    } catch {
      setError('Failed to check premium access');
      setHasPremiumAccess(false);
    } finally {
      setIsLoading(false);
    }
  }, [userDetails, loading]);

  return { hasPremiumAccess, isLoading, error };
};
