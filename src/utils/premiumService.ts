
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if a user has premium access to a specific valuation
 * @param valuationId The ID of the valuation to check
 * @returns Promise resolving to a boolean indicating if the user has premium access
 */
export async function checkPremiumAccess(valuationId: string): Promise<boolean> {
  try {
    // First check if the valuation itself has premium_unlocked flag
    const { data: valuationData, error: valuationError } = await supabase
      .from('valuations')
      .select('premium_unlocked, user_id')
      .eq('id', valuationId)
      .maybeSingle();
    
    if (valuationError) throw new Error(valuationError.message);
    
    // If valuation has premium_unlocked set to true, access is granted
    if (valuationData?.premium_unlocked) {
      return true;
    }
    
    // If not, check if there's a completed order for this valuation
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('status')
      .eq('valuation_id', valuationId)
      .eq('status', 'paid')
      .maybeSingle();
    
    if (orderError) throw new Error(orderError.message);
    
    // Return true if a paid order exists
    return !!orderData;
  } catch (error) {
    console.error('Error checking premium access:', error);
    return false;
  }
}

/**
 * Updates the premium_unlocked status for a valuation
 * @param valuationId The ID of the valuation to update
 * @param isUnlocked The new premium unlocked status
 * @returns Promise resolving to a boolean indicating success
 */
export async function updatePremiumStatus(valuationId: string, isUnlocked: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('valuations')
      .update({ premium_unlocked: isUnlocked })
      .eq('id', valuationId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating premium status:', error);
    return false;
  }
}
