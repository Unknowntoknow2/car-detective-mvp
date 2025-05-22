
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
  },
  DEALER_STARTER: {
    name: 'Dealer Starter Plan',
    price: 9900, // $99.00 in cents per month
    credits: 10,
    recurring: true
  },
  DEALER_PRO: {
    name: 'Dealer Pro Plan',
    price: 19900, // $199.00 in cents per month
    credits: 25,
    recurring: true
  },
  DEALER_ENTERPRISE: {
    name: 'Dealer Enterprise Plan',
    price: 29900, // $299.00 in cents per month
    credits: 50,
    recurring: true
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
    bundle: 'single',
    ...options
  });
}

/**
 * Create a checkout session for a bundle of 3 premium reports
 */
export async function checkoutBundle3Reports(options: CheckoutOptions) {
  return createCheckoutSession({
    bundle: 'bundle_3',
    ...options
  });
}

/**
 * Create a checkout session for a bundle of 5 premium reports
 */
export async function checkoutBundle5Reports(options: CheckoutOptions) {
  return createCheckoutSession({
    bundle: 'bundle_5',
    ...options
  });
}

/**
 * Create a checkout session for a dealer subscription
 */
export async function checkoutDealerSubscription(plan: 'starter' | 'pro' | 'enterprise', options: CheckoutOptions) {
  return createCheckoutSession({
    bundle: `dealer_${plan}`,
    ...options,
    isSubscription: true
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
  bundle: 'single' | 'bundle_3' | 'bundle_5' | 'dealer_starter' | 'dealer_pro' | 'dealer_enterprise';
  valuationId?: string;
  successUrl?: string;
  cancelUrl?: string;
  isSubscription?: boolean;
}): Promise<CheckoutResponse> {
  try {
    const { bundle = 'single', valuationId, successUrl, cancelUrl, isSubscription = false } = options;
    
    // Determine product based on bundle size
    let product;
    if (bundle === 'bundle_3') {
      product = STRIPE_PRODUCTS.BUNDLE_3;
    } else if (bundle === 'bundle_5') {
      product = STRIPE_PRODUCTS.BUNDLE_5;
    } else if (bundle === 'dealer_starter') {
      product = STRIPE_PRODUCTS.DEALER_STARTER;
    } else if (bundle === 'dealer_pro') {
      product = STRIPE_PRODUCTS.DEALER_PRO;
    } else if (bundle === 'dealer_enterprise') {
      product = STRIPE_PRODUCTS.DEALER_ENTERPRISE;
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
        isSubscription,
        successUrl: successUrl || `${window.location.origin}/premium-success?valuation_id=${valuationId || ''}`,
        cancelUrl: cancelUrl || `${window.location.origin}/pricing?checkout_canceled=true&valuation_id=${valuationId || ''}`
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
 * Get a Stripe customer portal link for managing subscriptions
 */
export async function getStripePortalLink(redirectUrl?: string): Promise<CheckoutResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('customer-portal', {
      body: { 
        returnUrl: redirectUrl || `${window.location.origin}/account/subscription`
      }
    });
    
    if (error) {
      console.error('Error creating customer portal session:', error);
      return { 
        success: false, 
        url: '', 
        sessionId: '',
        error: error.message || 'Failed to create customer portal session'
      };
    }
    
    return {
      success: true,
      url: data.url,
      sessionId: data.sessionId || '',
      error: undefined
    };
  } catch (error) {
    console.error('Error in getStripePortalLink:', error);
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
