
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function useUserRole() {
  const { userDetails, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const userRole = userDetails?.role || 'individual';
  const hasPermiumAccess = userDetails?.is_premium_dealer || 
    ['admin', 'dealer'].includes(userRole) ||
    (userDetails?.premium_expires_at && new Date(userDetails.premium_expires_at) > new Date());

  return { 
    userRole, 
    hasPermiumAccess, 
    isLoading,
    isPremium: hasPermiumAccess,
    isDealer: userRole === 'dealer',
    isAdmin: userRole === 'admin'
  };
}
