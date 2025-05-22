
import { EnhancedRulesEngineInput } from "../rules/types";

/**
 * Calculate demand adjustment based on market trends
 * @param input The rules engine input
 * @returns The demand adjustment amount
 */
export function demandAdjustment(input: EnhancedRulesEngineInput) {
  // Implementation of demand adjustment calculation
  const baseValue = input.baseValue || input.basePrice || 0;
  
  // Calculate demand adjustment (example implementation)
  const demandFactor = 0.05; // 5% adjustment
  return baseValue * demandFactor;
}

/**
 * Calculate seasonal adjustment based on time of year
 * @param input The rules engine input
 * @returns The seasonal adjustment amount
 */
export function seasonalAdjustment(input: EnhancedRulesEngineInput) {
  const baseValue = input.baseValue || input.basePrice || 0;
  const currentMonth = new Date().getMonth();
  
  // Seasonal factors (example values)
  const seasonalFactors = [
    -0.02, // January: slight decrease
    -0.01, // February: slight decrease
    0.01,  // March: slight increase
    0.02,  // April: moderate increase
    0.03,  // May: moderate increase
    0.04,  // June: strong increase
    0.03,  // July: moderate increase
    0.02,  // August: moderate increase
    0.01,  // September: slight increase
    -0.01, // October: slight decrease
    -0.02, // November: moderate decrease
    -0.03  // December: strong decrease
  ];
  
  return baseValue * seasonalFactors[currentMonth];
}

/**
 * Calculate market demand adjustment
 * @param input The rules engine input
 * @returns The market demand adjustment
 */
export function calculateDemandAdjustment(input: EnhancedRulesEngineInput) {
  // Use nullish coalescing to handle potentially undefined baseValue
  const baseValue = input.baseValue ?? input.basePrice ?? 0;
  
  // Calculate market demand based on various factors
  const marketDemand = 0.05; // Example: 5% positive adjustment for high demand
  
  // Apply market demand adjustment to base value
  return baseValue * marketDemand;
}

/**
 * Calculate regional market adjustment
 * @param input The rules engine input
 * @returns The regional market adjustment
 */
export function regionalMarketAdjustment(input: EnhancedRulesEngineInput) {
  const baseValue = input.baseValue || input.basePrice || 0;
  const zipCode = input.zipCode || '';
  
  // Example regional adjustments based on ZIP code first digit
  // In a real implementation, this would use a more sophisticated regional analysis
  const firstDigit = zipCode.charAt(0);
  const regionalFactors: Record<string, number> = {
    '0': 0.03,  // Northeast: 3% increase
    '1': 0.02,  // Northeast/Mid-Atlantic: 2% increase
    '2': 0.01,  // Mid-Atlantic: 1% increase
    '3': -0.01, // Southeast: 1% decrease
    '4': 0.00,  // Midwest: no adjustment
    '5': -0.02, // South Central: 2% decrease
    '6': -0.01, // South Central/Midwest: 1% decrease
    '7': 0.00,  // Central/Mountain: no adjustment
    '8': 0.01,  // Mountain/West: 1% increase
    '9': 0.04   // West Coast: 4% increase
  };
  
  const factor = regionalFactors[firstDigit] || 0;
  return baseValue * factor;
}
