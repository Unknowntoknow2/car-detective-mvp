
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { errorHandler } from '@/utils/error-handling';

export interface CheckoutResult {
  success: boolean;
  url?: string;
  alreadyUnlocked?: boolean;
  error?: string;
}

export async function createCheckoutSession(valuationId: string): Promise<CheckoutResult> {
  try {
    if (!valuationId) {
      throw new Error('Valuation ID is required');
    }

    // Check if premium is already unlocked before creating checkout
    const { data: valuationData, error: valuationError } = await supabase
      .from('valuations')
      .select('premium_unlocked')
      .eq('id', valuationId)
      .maybeSingle();
    
    if (valuationError) {
      console.error("Error checking valuation status:", valuationError);
      // Continue anyway since the edge function will also verify
    } else if (valuationData?.premium_unlocked) {
      return { 
        success: true, 
        alreadyUnlocked: true 
      };
    }

    // Call the Edge Function to create a checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { valuationId }
    });
    
    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Checkout creation failed: ${error.message || 'Unknown error'}`);
    }
    
    // If already unlocked, return success with that flag
    if (data?.already_unlocked) {
      return { 
        success: true, 
        alreadyUnlocked: true 
      };
    }
    
    // Check that we have a URL
    if (!data?.url) {
      throw new Error('No checkout URL returned from server');
    }
    
    return { 
      success: true, 
      url: data.url 
    };
  } catch (error) {
    const errorDetails = errorHandler.handle(error, 'stripe-checkout');
    return { 
      success: false, 
      error: errorDetails.message 
    };
  }
}

export async function checkPremiumAccess(valuationId: string): Promise<boolean> {
  try {
    if (!valuationId) return false;
    
    // Use the database function has_premium_access to check if the user has premium access
    const { data, error } = await supabase
      .rpc('has_premium_access', { valuation_id: valuationId });
    
    if (error) {
      console.error("Error checking premium access:", error);
      throw error;
    }
    
    return !!data;
  } catch (error) {
    errorHandler.handle(error, 'premium-access-check');
    return false;
  }
}

export async function verifyPaymentStatus(sessionId: string, valuationId?: string): Promise<{
  success: boolean;
  paymentConfirmed: boolean;
  status?: string;
  valuationId?: string;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { sessionId, valuationId }
    });
    
    if (error) {
      console.error("Error verifying payment:", error);
      return { success: false, paymentConfirmed: false };
    }
    
    return {
      success: true,
      paymentConfirmed: data.paymentSucceeded,
      status: data.status || 'unknown',
      valuationId: data.valuation_id
    };
  } catch (error) {
    console.error("Error verifying payment status:", error);
    return { success: false, paymentConfirmed: false };
  }
}
