
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
    
    return !!orderData;
  } catch (error) {
    errorHandler.handle(error, 'premium-access-check');
    return false;
  }
}
