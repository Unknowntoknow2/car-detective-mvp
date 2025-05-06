
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
    
    // First, check if the valuation itself has premium_unlocked
    const { data: valuationData, error: valuationError } = await supabase
      .from('valuations')
      .select('premium_unlocked')
      .eq('id', valuationId)
      .maybeSingle();
    
    if (valuationError) throw valuationError;
    
    if (valuationData?.premium_unlocked) {
      return true;
    }
    
    // If not unlocked in valuation, check orders
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('status')
      .eq('valuation_id', valuationId)
      .eq('status', 'paid')
      .maybeSingle();
    
    if (orderError) throw orderError;
    
    // If order exists and is paid, but premium_unlocked flag is not set,
    // this is a data inconsistency - fix it
    if (orderData) {
      // Fix the inconsistency by updating premium_unlocked flag
      await supabase
        .from('valuations')
        .update({ premium_unlocked: true })
        .eq('id', valuationId);
        
      return true;
    }
    
    return false;
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
