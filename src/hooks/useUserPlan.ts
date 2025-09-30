// User Plan Hook - Determines user's subscription status
import { usePremiumAccess } from '@/hooks/usePremiumAccess';
import { useAuth } from '@/hooks/useAuth';

export interface UserPlan {
  isPremium: boolean;
  isLoading: boolean;
  planType: 'free' | 'premium' | 'dealer' | 'admin';
  hasFeature: (feature: string) => boolean;
}

export function useUserPlan(): UserPlan {
  const { user, loading: authLoading } = useAuth();
  const { hasPremiumAccess, isLoading: premiumLoading } = usePremiumAccess();

  const isLoading = authLoading || premiumLoading;
  
  // Determine plan type based on user data
  const planType = !user ? 'free' : 
    hasPremiumAccess ? 'premium' : 'free';

  const hasFeature = () => {
    return hasPremiumAccess;
  };

  return {
    isPremium: hasPremiumAccess,
    isLoading,
    planType,
    hasFeature
  };
}