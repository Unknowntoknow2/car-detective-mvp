
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PremiumResponse {
  success: boolean;
  url?: string;
  error?: string;
  alreadyUnlocked?: boolean;
}

export function usePremiumStatus(valuationId?: string) {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to check premium status
  const checkPremiumStatus = async (id: string) => {
    setIsLoading(true);
    try {
      console.log("Checking premium status for valuation:", id);
      
      // For now, let's simulate an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if we have an entry in localStorage marking this as premium
      // This is just for demo purposes
      const premiumIds = JSON.parse(localStorage.getItem('premium_valuations') || '[]');
      const isPremiumValuation = premiumIds.includes(id);
      
      setIsPremium(isPremiumValuation);
      console.log("Premium status check result:", isPremiumValuation);
      
      return isPremiumValuation;
    } catch (error) {
      console.error('Error in premium status check:', error);
      setIsPremium(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to create a checkout session
  const createCheckoutSession = async (id: string): Promise<PremiumResponse> => {
    try {
      console.log("Creating checkout session for valuation:", id);
      
      // First check if it's already unlocked
      const isPremiumValuation = await checkPremiumStatus(id);
      
      if (isPremiumValuation) {
        return { 
          success: true,
          alreadyUnlocked: true
        };
      }
      
      // Simulate creating a checkout session
      // In production, this would call the Supabase function to create a Stripe checkout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return a simulated response
      return { 
        success: true, 
        url: `/premium-success?session_id=mock_session_${Date.now()}&valuation_id=${id}` 
      };
    } catch (error: any) {
      console.error('Error in checkout session creation:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred' 
      };
    }
  };
  
  // Initialize premium check if valuationId is provided
  useEffect(() => {
    if (valuationId && isLoading) {
      checkPremiumStatus(valuationId);
    }
  }, [valuationId, isLoading]);
  
  return {
    isPremium,
    isLoading,
    checkPremiumStatus,
    createCheckoutSession
  };
}
