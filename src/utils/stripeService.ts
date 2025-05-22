
import { supabase } from '@/integrations/supabase/client';

// Product pricing (could be moved to environment variables or config)
export const STRIPE_PRODUCTS = {
  SINGLE_REPORT: {
    name: 'Single Premium Report',
    price: 1999, // $19.99 in cents
    credits: 1
  },
  BUNDLE_3: {
    name: 'Bundle of 3 Premium Reports',
    price: 4999, // $49.99 in cents
    credits: 3
  },
  BUNDLE_5: {
    name: 'Bundle of 5 Premium Reports',
    price: 7999, // $79.99 in cents
    credits: 5
  }
};

interface CheckoutOptions {
  valuationId?: string;
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Create a checkout session for a single premium report
 */
export async function checkoutSingleReport(options: CheckoutOptions) {
  return createCheckoutSession({
    bundle: 1,
    ...options
  });
}

/**
 * Create a checkout session for a bundle of 3 premium reports
 */
export async function checkoutBundle3Reports(options: CheckoutOptions) {
  return createCheckoutSession({
    bundle: 3,
    ...options
  });
}

/**
 * Create a checkout session for a bundle of 5 premium reports
 */
export async function checkoutBundle5Reports(options: CheckoutOptions) {
  return createCheckoutSession({
    bundle: 5,
    ...options
  });
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
  success: boolean;
  error?: string;
}

/**
 * Create a Stripe checkout session through Supabase Edge Function
 */
export async function createCheckoutSession(options: {
  bundle: 1 | 3 | 5;
  valuationId?: string;
  successUrl?: string;
  cancelUrl?: string;
}): Promise<CheckoutResponse> {
  try {
    const { bundle = 1, valuationId, successUrl, cancelUrl } = options;
    
    // Determine product based on bundle size
    let product;
    if (bundle === 3) {
      product = STRIPE_PRODUCTS.BUNDLE_3;
    } else if (bundle === 5) {
      product = STRIPE_PRODUCTS.BUNDLE_5;
    } else {
      product = STRIPE_PRODUCTS.SINGLE_REPORT;
    }
    
    // Call the create-checkout edge function
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { 
        product: {
          name: product.name,
          price: product.price,
          credits: product.credits
        },
        valuationId,
        successUrl: successUrl || `${window.location.origin}/dashboard?checkout_success=true`,
        cancelUrl: cancelUrl || `${window.location.origin}/pricing?checkout_canceled=true`
      }
    });
    
    if (error) {
      console.error('Error creating checkout session:', error);
      return { 
        success: false, 
        url: '', 
        sessionId: '',
        error: error.message || 'Failed to create checkout session'
      };
    }
    
    return {
      success: true,
      url: data.url,
      sessionId: data.sessionId || '',
      error: undefined
    };
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    return { 
      success: false, 
      url: '', 
      sessionId: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Verify a Stripe payment session
 */
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
