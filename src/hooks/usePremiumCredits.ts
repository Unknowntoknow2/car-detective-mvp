
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UsePremiumCreditsResult {
  credits: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  useCredit: (valuationId: string) => Promise<boolean>;
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

  const useCredit = async (valuationId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to use credits');
      return false;
    }
    
    if (credits <= 0) {
      toast.error('You have no premium credits remaining');
      return false;
    }
    
    try {
      // Call the use-premium-credit edge function to use a credit
      const { data, error } = await supabase.functions.invoke('use-premium-credit', {
        body: { valuationId }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        // Update local state
        setCredits(prevCredits => Math.max(0, prevCredits - 1));
        toast.success('Premium credit used successfully');
        return true;
      } else {
        toast.error(data?.message || 'Failed to use premium credit');
        return false;
      }
    } catch (err) {
      console.error('Error using premium credit:', err);
      toast.error('Failed to use premium credit');
      return false;
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user]);

  return {
    credits,
    isLoading,
    error,
    refetch: fetchCredits,
    useCredit
  };
}
