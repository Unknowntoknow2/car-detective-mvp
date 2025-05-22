
import { RulesEngineInput, AdjustmentBreakdown, Rule } from './rules/types';

const rules: Rule[] = [];

/**
 * Calculate adjustments based on rules
 */
export async function calculateAdjustments(input: RulesEngineInput): Promise<AdjustmentBreakdown[]> {
  const adjustments: AdjustmentBreakdown[] = [];
  
  // For demonstration purposes, return sample adjustments
  if (input.mileage > 100000) {
    adjustments.push({
      factor: 'High Mileage',
      impact: -1500,
      description: 'Vehicle has high mileage, reducing value'
    });
  } else if (input.mileage < 30000) {
    adjustments.push({
      factor: 'Low Mileage',
      impact: 1000,
      description: 'Vehicle has low mileage, increasing value'
    });
  }
  
  // Add more sample adjustments
  adjustments.push({
    factor: 'Market Demand',
    impact: 500,
    description: 'High market demand in your area'
  });
  
  return adjustments;
}

/**
 * Calculate total adjustment
 */
export function calculateTotalAdjustment(adjustments: AdjustmentBreakdown[]): number {
  return adjustments.reduce((total, adjustment) => total + adjustment.impact, 0);
}

/**
 * Add a rule to the engine
 */
export function addRule(rule: Rule): void {
  rules.push(rule);
}

/**
 * Get all rules
 */
export function getRules(): Rule[] {
  return rules;
}
