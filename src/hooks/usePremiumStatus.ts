
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function usePremiumStatus(valuationId?: string) {
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!valuationId || !user) return;

    const checkPremiumStatus = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('valuations')
          .select('premium_unlocked')
          .eq('id', valuationId)
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          throw new Error(error.message);
        }
        
        // Use type assertion to access the premium_unlocked property
        type ValuationWithPremium = typeof data & { premium_unlocked?: boolean };
        const valuationData = data as ValuationWithPremium;
        
        // Access the premium_unlocked property safely
        setIsPremiumUnlocked(!!valuationData.premium_unlocked);
      } catch (err) {
        console.error('Error checking premium status:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel('premium-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'valuations',
          filter: `id=eq.${valuationId}`,
        },
        (payload) => {
          const newData = payload.new as { premium_unlocked?: boolean };
          setIsPremiumUnlocked(!!newData.premium_unlocked);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [valuationId, user]);

  const unlockPremium = async (valuationId: string) => {
    if (!user) {
      toast.error('You must be logged in to unlock premium features');
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // Call the create-checkout function to handle payment
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { valuationId }
      });
      
      if (error) throw new Error(error.message);
      
      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
      
      return true;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      toast.error('Failed to start checkout process');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    isPremiumUnlocked, 
    isLoading, 
    error,
    unlockPremium 
  };
}
