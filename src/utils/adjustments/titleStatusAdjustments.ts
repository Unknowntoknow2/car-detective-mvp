
import { supabase } from '@/integrations/supabase/client';

/**
 * Calculate the price adjustment based on the vehicle's title status
 * This function fetches the multiplier from the title_status table
 * and calculates the adjustment based on the base price
 */
export async function getTitleStatusAdjustmentFromDB(titleStatus: string, basePrice: number): Promise<number> {
  try {
    // Default to 'Clean' if no status provided
    const status = titleStatus || 'Clean';
    
    // Fetch the multiplier from the database
    const { data, error } = await supabase
      .from('title_status')
      .select('multiplier')
      .eq('status', status)
      .single();
    
    if (error) {
      console.error('Error fetching title status multiplier:', error);
      return 0; // No adjustment on error
    }
    
    if (!data) {
      console.warn(`No multiplier found for title status: ${status}`);
      return 0; // No adjustment if no data found
    }
    
    // Calculate the adjustment amount (can be negative)
    const multiplier = data.multiplier;
    const adjustment = (multiplier - 1) * basePrice;
    
    return adjustment;
  } catch (error) {
    console.error('Error calculating title status adjustment:', error);
    return 0; // No adjustment on error
  }
}

/**
 * Synchronous version of title status adjustment calculation
 * This is a fallback used when the database is not available
 */
export function getTitleStatusAdjustment(titleStatus: string, basePrice: number): number {
  // Convert titleStatus to a multiplier
  let multiplier = 1.0; // Default multiplier for clean title
  
  switch (titleStatus) {
    case 'Clean':
      multiplier = 1.00; // Clean title, no adjustment
      break;
    case 'Rebuilt':
      multiplier = 0.70; // Rebuilt/Revived, -30%
      break;
    case 'Lemon':
      multiplier = 0.75; // Lemon/Buyback, -25%
      break;
    case 'Flood':
    case 'Salvage':
      multiplier = 0.50; // Salvage/Flood, -50%
      break;
    default:
      multiplier = 1.00; // Default to no adjustment
  }

  // Calculate the adjustment amount (can be negative)
  const adjustment = (multiplier - 1) * basePrice;
  
  return adjustment;
}
