
import { supabase } from '@/integrations/supabase/client';

export interface CheckoutOptions {
  bundle?: number; // 1, 3, or 5
  valuationId?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export async function createCheckoutSession(options: CheckoutOptions) {
  try {
    const { bundle = 1, valuationId, successUrl, cancelUrl } = options;
    
    // Call the create-checkout edge function
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { 
        bundle,
        valuationId,
        successUrl: successUrl || window.location.href,
        cancelUrl: cancelUrl || window.location.href
      }
    });
    
    if (error) {
      console.error('Error creating checkout session:', error);
      throw new Error(error.message || 'Failed to create checkout session');
    }
    
    return data;
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    throw error;
  }
}

export async function verifyPaymentSession(sessionId: string) {
  try {
    // Call the verify-payment edge function
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { sessionId }
    });
    
    if (error) {
      console.error('Error verifying payment session:', error);
      throw new Error(error.message || 'Failed to verify payment');
    }
    
    return data;
  } catch (error) {
    console.error('Error in verifyPaymentSession:', error);
    throw error;
  }
}
