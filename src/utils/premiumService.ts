
import { supabase } from "@/integrations/supabase/client";

/**
 * Verifies the payment status for a premium session
 * @param sessionId The Stripe session ID
 * @param valuationId The valuation ID being upgraded
 */
export const verifyPaymentStatus = async (sessionId: string, valuationId: string) => {
  try {
    // Call our verify-payment Edge Function
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { sessionId, valuationId }
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error verifying payment status:', error);
    return {
      success: false,
      paymentConfirmed: false,
      error: 'Failed to verify payment'
    };
  }
};

/**
 * Checks if the current user has premium access
 */
export const checkPremiumAccess = async (valuationId?: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { hasPremium: false, isLoading: false };
    }
    
    const userId = session.user.id;
    
    // Check for valuation-specific premium access
    if (valuationId) {
      // Check if this valuation has premium unlocked
      const { data: valuationData, error: valuationError } = await supabase
        .from('valuations')
        .select('premium_unlocked')
        .eq('id', valuationId)
        .single();
        
      if (!valuationError && valuationData?.premium_unlocked) {
        return { hasPremium: true, isLoading: false };
      }
      
      // Check if there's a paid order for this valuation
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('valuation_id', valuationId)
        .eq('user_id', userId)
        .eq('status', 'paid')
        .maybeSingle();
        
      if (!orderError && orderData) {
        return { hasPremium: true, isLoading: false };
      }
    }
    
    // Check general premium access from user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('premium_expires_at, is_premium_dealer')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      throw profileError;
    }
    
    const hasPremium = profileData?.is_premium_dealer && 
      (profileData.premium_expires_at === null || 
       new Date(profileData.premium_expires_at) > new Date());
       
    return { hasPremium, isLoading: false };
  } catch (error) {
    console.error('Error checking premium access:', error);
    return { hasPremium: false, isLoading: false, error };
  }
};

/**
 * Creates a checkout session for premium access
 */
export const createCheckoutSession = async (valuationId: string, returnUrl?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { valuationId, returnUrl }
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};
