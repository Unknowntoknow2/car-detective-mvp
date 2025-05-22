
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface PremiumAccessState {
  hasPremiumAccess: boolean;
  creditsRemaining: number;
  isLoading: boolean;
  error: string | null;
  expiresAt: string | null;
}

export function usePremiumAccess(valuationId?: string) {
  const { user, userRole } = useAuth();
  const [state, setState] = useState<PremiumAccessState>({
    hasPremiumAccess: false,
    creditsRemaining: 0,
    isLoading: true,
    error: null,
    expiresAt: null
  });

  useEffect(() => {
    async function checkPremiumAccess() {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        // If no user is logged in, they don't have premium access
        if (!user) {
          setState({
            hasPremiumAccess: false,
            creditsRemaining: 0,
            isLoading: false,
            error: null,
            expiresAt: null
          });
          return;
        }
        
        // Check if user has admin role (always has access)
        const hasAdminRole = userRole === 'admin';
        
        // Check if user has premium dealer role
        const hasPremiumRole = userRole === 'premium' || user?.role === 'premium' || userRole === 'admin';
        
        // For specific valuation access, check the premium_valuations table
        let valuationPremiumUnlocked = false;
        if (valuationId) {
          // First check if this specific valuation has been unlocked
          const { data: premiumValuation, error: premiumValuationError } = await supabase
            .from('premium_valuations')
            .select('*')
            .eq('user_id', user.id)
            .eq('valuation_id', valuationId)
            .maybeSingle();
            
          if (!premiumValuationError && premiumValuation) {
            valuationPremiumUnlocked = true;
          }
          
          // Also check if the valuation itself is marked as premium_unlocked
          const { data: valuation, error: valuationError } = await supabase
            .from('valuations')
            .select('premium_unlocked')
            .eq('id', valuationId)
            .maybeSingle();
            
          if (!valuationError && valuation?.premium_unlocked) {
            valuationPremiumUnlocked = true;
          }
        }
        
        // Check for available premium credits
        const { data: premiumAccess, error: premiumAccessError } = await supabase
          .from('premium_access')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (premiumAccessError) {
          console.error("Error checking premium access:", premiumAccessError);
        }
        
        const hasCredits = premiumAccess && 
                         premiumAccess.credits_remaining > 0 && 
                         (!premiumAccess.expires_at || new Date(premiumAccess.expires_at) > new Date());
        
        // User has premium access if they have admin/premium role, specific valuation access, or credits
        const hasPremium = hasAdminRole || hasPremiumRole || valuationPremiumUnlocked || hasCredits;
        
        setState({
          hasPremiumAccess: hasPremium,
          creditsRemaining: premiumAccess?.credits_remaining || 0,
          isLoading: false,
          error: null,
          expiresAt: premiumAccess?.expires_at || null
        });
      } catch (error) {
        console.error("Error checking premium access:", error);
        setState({
          hasPremiumAccess: false,
          creditsRemaining: 0,
          isLoading: false,
          error: "Failed to check premium access",
          expiresAt: null
        });
      }
    }
    
    checkPremiumAccess();
  }, [user, userRole, valuationId]);

  // Function to use a premium credit for a valuation
  const usePremiumCredit = async (valueValuationId: string): Promise<boolean> => {
    if (!user || !valueValuationId) return false;
    
    try {
      // First check if this valuation is already unlocked
      const { data: existingValuation } = await supabase
        .from('premium_valuations')
        .select('*')
        .eq('user_id', user.id)
        .eq('valuation_id', valueValuationId)
        .maybeSingle();
        
      if (existingValuation) {
        return true; // Already unlocked
      }
      
      // Get current premium access
      const { data: premiumAccess } = await supabase
        .from('premium_access')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (!premiumAccess || premiumAccess.credits_remaining <= 0) {
        return false; // No credits available
      }
      
      // Start a transaction to update credits and mark valuation as premium
      const { error: updateError } = await supabase.rpc('use_premium_credit', {
        user_id_param: user.id,
        valuation_id_param: valueValuationId
      });
      
      if (updateError) {
        console.error("Error using premium credit:", updateError);
        return false;
      }
      
      // Refresh the state
      setState(prev => ({ ...prev, creditsRemaining: prev.creditsRemaining - 1 }));
      
      return true;
    } catch (error) {
      console.error("Error using premium credit:", error);
      return false;
    }
  };

  return {
    ...state,
    usePremiumCredit
  };
}
