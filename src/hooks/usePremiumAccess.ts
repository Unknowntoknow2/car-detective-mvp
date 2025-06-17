
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const usePremiumAccess = () => {
  const { userDetails } = useAuth();
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);

  useEffect(() => {
    if (userDetails) {
      setHasPremiumAccess(
        userDetails.is_premium_dealer ||
        ['admin', 'dealer'].includes(userDetails.role || '') ||
        (userDetails.premium_expires_at && new Date(userDetails.premium_expires_at) > new Date())
      );
    }
  }, [userDetails]);

  return { hasPremiumAccess };
};
