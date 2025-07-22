
export interface AdjustmentItem {
  factor: string;
  impact: number;
  description: string;
}

/**
 * Calculates the final vehicle value based on base value and adjustments
 * @param baseValue The starting value of the vehicle
 * @param adjustments Array of adjustments to apply to the base value
 * @returns Final calculated vehicle value
 */
export function calculateVehicleValue(
  baseValue: number,
  adjustments: AdjustmentItem[]
): number {
  const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.impact, 0);
  return Math.max(0, baseValue + totalAdjustment);
}

/**
 * Calculates a realistic price range based on the estimated value and available market data
 * @param estimatedValue The calculated vehicle value
 * @param marketListings Optional array of market listings to determine range
 * @returns Price range as [min, max]
 */
export function calculatePriceRange(
  estimatedValue: number,
  marketListings?: Array<{price: number}>
): [number, number] {
  // If we have market listings, use them for min/max calculations
  if (marketListings && marketListings.length > 0) {
    const prices = marketListings.map(listing => listing.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    // Ensure the range includes the estimated value
    return [
      Math.min(min, estimatedValue * 0.9),
      Math.max(max, estimatedValue * 1.1)
    ];
  }
  
  // Fallback to percentage-based range when no market data
  return [
    Math.round(estimatedValue * 0.9),
    Math.round(estimatedValue * 1.1)
  ];
}
