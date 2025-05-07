
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';

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
      const { data, error } = await supabase
        .from('valuations')
        .select('is_premium')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
      } else {
        setIsPremium(data.is_premium || false);
      }
    } catch (error) {
      console.error('Error in premium status check:', error);
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to create a Stripe checkout session
  const createCheckoutSession = async (id: string): Promise<PremiumResponse> => {
    try {
      // First check if it's already unlocked
      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .select('is_premium')
        .eq('id', id)
        .single();
        
      if (valuationError) {
        console.error('Error checking valuation:', valuationError);
        return { 
          success: false, 
          error: 'Could not verify valuation status' 
        };
      }
      
      if (valuationData.is_premium) {
        return { 
          success: true,
          alreadyUnlocked: true
        };
      }
      
      // Create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { valuationId: id }
      });
      
      if (error) {
        console.error('Error creating checkout session:', error);
        return { 
          success: false, 
          error: 'Failed to create checkout session' 
        };
      }
      
      return { 
        success: true, 
        url: data.url 
      };
    } catch (error) {
      console.error('Error in checkout session creation:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred' 
      };
    }
  };
  
  // Initialize premium check if valuationId is provided
  if (valuationId && isLoading) {
    checkPremiumStatus(valuationId);
  }
  
  return {
    isPremium,
    isLoading,
    checkPremiumStatus,
    createCheckoutSession
  };
}
