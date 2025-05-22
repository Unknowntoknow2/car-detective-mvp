
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PremiumAccessState {
  hasPremiumAccess: boolean;
  creditsRemaining: number;
  isLoading: boolean;
  error: string | null;
}

export const usePremiumAccess = (valuationId?: string) => {
  const [state, setState] = useState<PremiumAccessState>({
    hasPremiumAccess: false,
    creditsRemaining: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const checkPremiumAccess = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (!user) {
          setState({
            hasPremiumAccess: false,
            creditsRemaining: 0,
            isLoading: false,
            error: null
          });
          return;
        }
        
        // If we have a valuation ID, check if it already has premium access
        if (valuationId) {
          const { data: premiumValuation, error: pvError } = await supabase
            .from('premium_valuations')
            .select('*')
            .eq('user_id', user.id)
            .eq('valuation_id', valuationId)
            .maybeSingle();
            
          if (premiumValuation) {
            setState({
              hasPremiumAccess: true,
              creditsRemaining: 0, // We'll get this from the premium_access table below
              isLoading: false,
              error: null
            });
            return;
          }
        }
        
        // Check user's premium access
        const { data: premiumAccess, error: accessError } = await supabase
          .from('premium_access')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (accessError) throw accessError;
        
        // Determine if user has valid premium access
        const hasAccess = !!premiumAccess && 
                          premiumAccess.credits_remaining > 0 && 
                          (!premiumAccess.expires_at || new Date(premiumAccess.expires_at) > new Date());
        
        setState({
          hasPremiumAccess: hasAccess,
          creditsRemaining: premiumAccess?.credits_remaining || 0,
          isLoading: false,
          error: null
        });
      } catch (err) {
        console.error('Error checking premium access:', err);
        setState({
          hasPremiumAccess: false,
          creditsRemaining: 0,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to check premium access'
        });
      }
    };
    
    checkPremiumAccess();
  }, [valuationId]);

  return state;
};
