
/**
 * Mileage Adjustment Calculator
 * Calculates value adjustments based on vehicle mileage using industry standard
 * depreciation curves.
 */

/**
 * Calculates the mileage adjustment multiplier based on the vehicle's mileage
 * @param mileage The vehicle mileage
 * @returns A multiplier to be applied to the base value
 */
export function mileageAdjustmentCurve(mileage: number): number {
  // Industry standard mileage adjustment curve
  // These values would typically be calibrated based on historical sales data
  
  if (mileage < 10000) {
    // Very low mileage premium
    return 0.04;
  } else if (mileage < 25000) {
    // Low mileage premium
    return 0.025;
  } else if (mileage < 50000) {
    // Below average mileage
    return 0.01;
  } else if (mileage < 75000) {
    // Average mileage - no adjustment
    return 0;
  } else if (mileage < 100000) {
    // Above average mileage
    return -0.03;
  } else if (mileage < 125000) {
    // High mileage
    return -0.07;
  } else if (mileage < 150000) {
    // Very high mileage
    return -0.11;
  } else {
    // Excessive mileage
    return -0.15;
  }
}

export function getMileageDescription(mileage: number): string {
  if (mileage < 10000) {
    return "Very low mileage vehicle - significantly below average for age";
  } else if (mileage < 25000) {
    return "Low mileage vehicle - below average for age";
  } else if (mileage < 50000) {
    return "Below average mileage for vehicle age";
  } else if (mileage < 75000) {
    return "Average mileage for vehicle age";
  } else if (mileage < 100000) {
    return "Above average mileage for vehicle age";
  } else if (mileage < 125000) {
    return "High mileage vehicle - above average for age";
  } else if (mileage < 150000) {
    return "Very high mileage vehicle - significantly above average for age";
  } else {
    return "Excessive mileage vehicle - well above typical for age";
  }
}

/**
 * Calculates the monetary impact of mileage on vehicle value
 * @param mileage The vehicle mileage
 * @param basePrice The base price of the vehicle
 * @returns Dollar amount adjustment based on mileage
 */
export function getMileageAdjustment(mileage: number, basePrice: number): number {
  const multiplier = mileageAdjustmentCurve(mileage);
  return basePrice * multiplier;
}
