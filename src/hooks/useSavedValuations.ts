
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SavedValuation } from '@/types/valuation';

export const useSavedValuations = () => {
  const { user } = useAuth();
  const [valuations, setValuations] = useState<SavedValuation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      // Mock saved valuations data
      setTimeout(() => {
        setValuations([]);
        setIsLoading(false);
      }, 1000);
    }
  }, [user]);

  const deleteValuation = async (id: string): Promise<void> => {
    try {
      setValuations(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError('Failed to delete valuation');
    }
  };

  return { 
    valuations, 
    isLoading, 
    error, 
    deleteValuation,
    loading: isLoading 
  };
};
