
/**
 * Calculate the price adjustment based on the vehicle's title status
 * Title status values range from 0-100, where:
 * - 0: Clean title (no adjustment)
 * - 25: Rebuilt/Revived (-30%)
 * - 50: Lemon/Buyback (-25%)
 * - 75: Theft recovered (-20%)
 * - 100: Salvage/Flood (-50%)
 */
export function getTitleStatusAdjustment(titleStatus: number, basePrice: number): number {
  // Convert titleStatus to a multiplier
  let multiplier = 1.0; // Default multiplier for clean title
  
  if (titleStatus === 0) {
    multiplier = 1.00; // Clean title, no adjustment
  } else if (titleStatus <= 25) {
    multiplier = 0.70; // Rebuilt/Revived, -30%
  } else if (titleStatus <= 50) {
    multiplier = 0.75; // Lemon/Buyback, -25%
  } else if (titleStatus <= 75) {
    multiplier = 0.80; // Theft recovered, -20% 
  } else {
    multiplier = 0.50; // Salvage/Flood, -50%
  }

  // Calculate the adjustment amount (can be negative)
  const adjustment = (multiplier - 1) * basePrice;
  
  return adjustment;
}
