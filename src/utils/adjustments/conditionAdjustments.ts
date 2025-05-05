
/**
 * Condition Adjustment Calculator
 * Calculates value adjustments based on vehicle condition.
 */

/**
 * Standard condition multipliers based on industry valuation practices
 */
const CONDITION_MULTIPLIERS = {
  'Excellent': 0.05,  // +5% for excellent condition
  'Good': 0,         // No adjustment for good condition (baseline)
  'Fair': -0.08,     // -8% for fair condition
  'Poor': -0.15      // -15% for poor condition
};

/**
 * Gets the condition adjustment multiplier based on the vehicle's condition
 * @param condition The vehicle condition rating
 * @returns A multiplier to be applied to the base value
 */
export function getConditionMultiplier(condition: string): number {
  // Case-insensitive lookup with fallback to 0 (no adjustment)
  const normalizedCondition = condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase();
  return CONDITION_MULTIPLIERS[normalizedCondition as keyof typeof CONDITION_MULTIPLIERS] || 0;
}

/**
 * Gets a detailed description of what each condition rating means
 * @param condition The vehicle condition rating
 * @returns A descriptive explanation of the condition rating
 */
export function getConditionDescription(condition: string): string {
  const normalizedCondition = condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase();
  
  switch (normalizedCondition) {
    case 'Excellent':
      return "Vehicle is in exceptional condition with minimal wear and tear. No mechanical issues, pristine interior and exterior.";
    case 'Good':
      return "Vehicle is in good overall condition with normal wear and tear for age. Minor cosmetic issues may be present, but mechanically sound.";
    case 'Fair':
      return "Vehicle shows noticeable wear and tear. May have some mechanical issues requiring attention and visible cosmetic defects.";
    case 'Poor':
      return "Vehicle has significant mechanical and/or cosmetic issues. Requires major repairs or restoration to restore to good condition.";
    default:
      return "Vehicle condition is unspecified. Assuming average condition for valuation purposes.";
  }
}

/**
 * Calculates the monetary adjustment based on vehicle condition
 * @param condition The vehicle condition
 * @param basePrice The base price of the vehicle
 * @returns Dollar amount adjustment based on condition
 */
export function getConditionAdjustment(condition: string, basePrice: number): number {
  const multiplier = getConditionMultiplier(condition);
  return basePrice * multiplier;
}
