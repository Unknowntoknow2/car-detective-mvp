
/**
 * Utility functions for generating human-readable descriptions for valuation adjustments
 */

/**
 * Generate a description for a photo score adjustment
 */
export function getPhotoScoreAdjustmentDescription(
  photoScore: number, 
  impactPercentage: number, 
  adjustmentAmount: number
): string {
  const formattedAmount = Math.abs(adjustmentAmount).toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  const formattedPercentage = Math.abs(impactPercentage).toFixed(1);
  
  if (photoScore >= 0.9) {
    return `Your vehicle photos show excellent condition, adding ${formattedAmount} (${formattedPercentage}%) to the valuation.`;
  } else if (photoScore >= 0.7) {
    return `Vehicle condition from photos matches expected condition, no adjustment applied.`;
  } else if (photoScore >= 0.5) {
    return `Photos show some wear and issues, reducing value by ${formattedAmount} (${formattedPercentage}%).`;
  } else {
    return `Photos indicate significant condition issues, reducing value by ${formattedAmount} (${formattedPercentage}%).`;
  }
}
