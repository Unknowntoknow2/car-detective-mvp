
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UsePremiumCreditsResult {
  credits: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePremiumCredits(): UsePremiumCreditsResult {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const fetchCredits = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('premium_credits')
        .select('remaining_credits')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw fetchError;
      }

      setCredits(data?.remaining_credits || 0);
    } catch (err) {
      console.error('Error fetching premium credits:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch premium credits'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user]);

  return {
    credits,
    isLoading,
    error,
    refetch: fetchCredits
  };
}
