
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export function usePremiumCredits() {
  const { user } = useAuth();
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCredits = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const isPremium = localStorage.getItem('premium_purchased') === 'true';
        setCredits(isPremium ? 1 : 0);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      loadCredits();
    } else {
      setCredits(0);
      setIsLoading(false);
    }
  }, [user]);

  const useCredit = async (): Promise<boolean> => {
    if (credits <= 0) return false;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCredits(prev => prev - 1);
      return true;
    } catch {
      return false;
    }
  };

  return { credits, isLoading, useCredit };
}
