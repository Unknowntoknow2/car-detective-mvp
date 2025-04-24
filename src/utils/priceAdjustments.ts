
/**
 * Types for price adjustment calculations
 */
export type VehicleCondition = 'excellent' | 'good' | 'fair' | 'poor';

interface ZipTier {
  zips: string[];
  adjustment: number;
}

/**
 * Calculates price adjustment based on vehicle mileage
 * @param mileage - Vehicle mileage in miles
 * @param basePrice - Base price of the vehicle
 * @returns Adjustment amount (positive or negative)
 */
export function getMileageAdjustment(mileage: number, basePrice: number): number {
  if (mileage < 30000) {
    return basePrice * 0.025; // +2.5% for low mileage
  } else if (mileage <= 60000) {
    return 0; // No adjustment for average mileage
  } else if (mileage <= 100000) {
    return basePrice * -0.05; // -5% for high mileage
  } else if (mileage <= 150000) {
    return basePrice * -0.10; // -10% for very high mileage
  } else {
    return basePrice * -0.15; // -15% for excessive mileage
  }
}

/**
 * Calculates price adjustment based on vehicle condition
 * @param condition - Vehicle condition rating
 * @param basePrice - Base price of the vehicle
 * @returns Adjustment amount (positive or negative)
 */
export function getConditionAdjustment(condition: VehicleCondition, basePrice: number): number {
  const adjustments: Record<VehicleCondition, number> = {
    excellent: 0.05,  // +5% for excellent condition
    good: 0,         // No adjustment for good condition
    fair: -0.075,    // -7.5% for fair condition
    poor: -0.15      // -15% for poor condition
  };

  return basePrice * (adjustments[condition] || 0);
}

/**
 * Determines ZIP code-based price adjustment
 * @param zip - Vehicle location ZIP code
 * @param basePrice - Base price of the vehicle
 * @returns Adjustment amount (positive or negative)
 */
export function getZipAdjustment(zip: string, basePrice: number): number {
  const zipTiers: ZipTier[] = [
    {
      zips: ['90210', '10001', '60611', '94102', '98101'],
      adjustment: 0.03 // +3% for high-demand areas
    },
    {
      zips: ['78572', '30401', '63115', '35203', '59101'],
      adjustment: -0.02 // -2% for low-demand areas
    }
  ];

  const tier = zipTiers.find(t => t.zips.includes(zip));
  return tier ? basePrice * tier.adjustment : 0;
}

/**
 * Calculates total price adjustment based on all factors
 * @param params - Vehicle parameters for adjustment calculation
 * @returns Total adjustment amount
 */
export function calculateTotalAdjustment(params: {
  mileage: number;
  condition: VehicleCondition;
  zipCode?: string;
  basePrice: number;
}): number {
  const mileageAdj = getMileageAdjustment(params.mileage, params.basePrice);
  const conditionAdj = getConditionAdjustment(params.condition, params.basePrice);
  const zipAdj = params.zipCode ? getZipAdjustment(params.zipCode, params.basePrice) : 0;

  return mileageAdj + conditionAdj + zipAdj;
}
