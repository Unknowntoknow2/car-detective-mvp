
import { RulesEngineInput, AdjustmentBreakdown } from './rules/types';
import { calculateAccidentImpact } from './valuation/valuationEngine';

// Define the Rule interface here instead of importing it
interface Rule {
  name: string;
  description: string;
  calculate: (input: RulesEngineInput) => AdjustmentBreakdown;
}

export class RulesEngine {
  private rules: Rule[];
  
  constructor(rules: Rule[]) {
    this.rules = rules;
  }
  
  // Run all rules and return the results
  public evaluate(input: RulesEngineInput): AdjustmentBreakdown[] {
    return this.rules.map(rule => rule.calculate(input));
  }
  
  // Add a new rule to the engine
  public addRule(rule: Rule): void {
    this.rules.push(rule);
  }
  
  // Get all rules
  public getRules(): Rule[] {
    return this.rules;
  }
}

/**
 * Calculate adjustments based on rules
 */
export async function calculateAdjustments(input: RulesEngineInput): Promise<AdjustmentBreakdown[]> {
  const adjustments: AdjustmentBreakdown[] = [];
  
  // Apply accident adjustment if accident data is available
  if (input.accidentCount !== undefined) {
    const severity = input.condition?.toLowerCase() === 'poor' ? 'severe' : 
                    input.condition?.toLowerCase() === 'fair' ? 'moderate' : 'minor';
    
    const { percentImpact, dollarImpact } = calculateAccidentImpact(
      input.baseValue || 0, 
      input.accidentCount,
      severity
    );
    
    if (dollarImpact !== 0) {
      adjustments.push({
        factor: 'Accident History',
        impact: dollarImpact,
        description: `${input.accidentCount} ${severity} accident${input.accidentCount !== 1 ? 's' : ''} reported`
      });
    }
  }
  
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

// Define an array to store rules
const rulesList: Rule[] = [];

/**
 * Add a rule to the engine
 */
export function addRule(rule: Rule): void {
  rulesList.push(rule);
}

/**
 * Get all rules
 */
export function getRules(): Rule[] {
  return rulesList;
}

// Default export for backward compatibility
export default {
  calculateAdjustments,
  calculateTotalAdjustment,
  addRule,
  getRules
};
