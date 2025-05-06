
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function usePremiumAccess(valuationId?: string) {
  const { user } = useAuth();
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!valuationId || !user) {
      setHasPremiumAccess(false);
      setIsLoading(false);
      return;
    }

    async function checkPremiumAccess() {
      setIsLoading(true);
      setError(null);
      
      try {
        // First check if the valuation has premium_unlocked set to true
        const { data: valuationData, error: valuationError } = await supabase
          .from('valuations')
          .select('premium_unlocked')
          .eq('id', valuationId)
          .maybeSingle();
        
        if (valuationError) throw new Error(valuationError.message);
        
        // If valuation has premium_unlocked set to true, access is granted
        if (valuationData?.premium_unlocked) {
          setHasPremiumAccess(true);
          setIsLoading(false);
          return;
        }
        
        // Check if there's a completed order for this valuation
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('status')
          .eq('valuation_id', valuationId)
          .eq('user_id', user.id)
          .eq('status', 'paid')
          .maybeSingle();
        
        if (orderError) throw new Error(orderError.message);
        
        // Set premium access status based on order existence
        setHasPremiumAccess(!!orderData);
      } catch (err) {
        console.error('Error checking premium access:', err);
        setError(err instanceof Error ? err : new Error('Failed to check premium access'));
      } finally {
        setIsLoading(false);
      }
    }
    
    checkPremiumAccess();
  }, [valuationId, user]);

  return { hasPremiumAccess, isLoading, error };
}
