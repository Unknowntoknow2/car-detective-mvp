
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PremiumCreditsState {
  credits: number;
  isLoading: boolean;
  error: string | null;
}

export function usePremiumCredits() {
  const { user } = useAuth();
  const [state, setState] = useState<PremiumCreditsState>({
    credits: 0,
    isLoading: true,
    error: null
  });

  const fetchCredits = useCallback(async () => {
    if (!user) {
      setState({
        credits: 0,
        isLoading: false,
        error: null
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase
        .from('premium_credits')
        .select('remaining_credits')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      setState({
        credits: data?.remaining_credits || 0,
        isLoading: false,
        error: null
      });
    } catch (err) {
      console.error('Error fetching premium credits:', err);
      setState({
        credits: 0,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch premium credits'
      });
    }
  }, [user]);

  const useCredit = useCallback(async (valuationId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Call the edge function to use a credit
      const { data, error } = await supabase.functions.invoke('use-premium-credit', {
        body: { valuation_id: valuationId }
      });

      if (error) throw error;
      
      // If successful, update local state
      if (data.success) {
        setState(prev => ({
          ...prev,
          credits: Math.max(0, prev.credits - 1)
        }));
      }
      
      return data.success;
    } catch (err) {
      console.error('Error using premium credit:', err);
      return false;
    }
  }, [user]);

  // Fetch credits on mount and when user changes
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return {
    credits: state.credits,
    isLoading: state.isLoading,
    error: state.error,
    fetchCredits,
    useCredit
  };
}
