<<<<<<< HEAD

import { RulesEngineInput, AdjustmentBreakdown } from './rules/types';
import { calculateAccidentImpact } from './valuation/valuationEngine';

// Define the Rule interface here instead of importing it
interface Rule {
  name: string;
  description: string;
  calculate: (input: RulesEngineInput) => AdjustmentBreakdown;
}
=======
import { AdjustmentBreakdown, RulesEngineInput } from "./rules/types";

// Re-export types with 'export type' syntax for isolatedModules
export type { AdjustmentBreakdown, RulesEngineInput };
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

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
<<<<<<< HEAD
  calculateAdjustments,
  calculateTotalAdjustment,
  addRule,
  getRules
};
=======
  calculateAdjustments: async (
    input: RulesEngineInput,
  ): Promise<AdjustmentBreakdown[]> => {
    // Mock implementation
    return [
      {
        name: "Mileage",
        factor: "Mileage",
        value: calculateMileageAdjustment(input),
        impact: calculateMileageAdjustment(input),
        description: getMileageAdjustmentDescription(input),
        percentAdjustment: calculateMileagePercentage(input),
      },
      {
        name: "Condition",
        factor: "Condition",
        value: calculateConditionAdjustment(input),
        impact: calculateConditionAdjustment(input),
        description: `Based on ${input.condition} condition`,
        percentAdjustment: calculateConditionPercentage(input),
      },
      {
        name: "Market Demand",
        factor: "Market Demand",
        value: input.basePrice * 0.03,
        impact: input.basePrice * 0.03,
        description: "Current market demand in your region",
        percentAdjustment: 3,
      },
    ];
  },
  calculateTotalAdjustment: (adjustments: AdjustmentBreakdown[]): number => {
    return adjustments.reduce((sum, adjustment) => sum + adjustment.value, 0);
  },
};

// Helper functions
function calculateMileageAdjustment(input: RulesEngineInput): number {
  const avgMileagePerYear = 12000;
  const vehicleAge = new Date().getFullYear() - input.year;
  const expectedMileage = vehicleAge * avgMileagePerYear;
  const mileageDifference = input.mileage - expectedMileage;

  if (mileageDifference <= 0) {
    return Math.min(input.basePrice * 0.05, 1500); // Bonus for low mileage
  } else {
    const excessMileagePenalty = mileageDifference * -0.05;
    return Math.max(excessMileagePenalty, input.basePrice * -0.1); // Cap at 10% penalty
  }
}

function calculateMileagePercentage(input: RulesEngineInput): number {
  const adjustment = calculateMileageAdjustment(input);
  return (adjustment / input.basePrice) * 100;
}

function getMileageAdjustmentDescription(input: RulesEngineInput): string {
  const avgMileagePerYear = 12000;
  const vehicleAge = new Date().getFullYear() - input.year;
  const expectedMileage = vehicleAge * avgMileagePerYear;

  if (input.mileage < expectedMileage) {
    return `Lower than average mileage (${input.mileage.toLocaleString()} vs expected ${expectedMileage.toLocaleString()})`;
  } else {
    return `Higher than average mileage (${input.mileage.toLocaleString()} vs expected ${expectedMileage.toLocaleString()})`;
  }
}

function calculateConditionAdjustment(input: RulesEngineInput): number {
  // Override with AI condition if available
  const condition = input.aiConditionOverride?.condition || input.condition;

  switch (condition.toLowerCase()) {
    case "excellent":
      return input.basePrice * 0.08;
    case "good":
      return input.basePrice * 0.02;
    case "fair":
      return input.basePrice * -0.05;
    case "poor":
      return input.basePrice * -0.15;
    default:
      return 0;
  }
}

function calculateConditionPercentage(input: RulesEngineInput): number {
  const adjustment = calculateConditionAdjustment(input);
  return (adjustment / input.basePrice) * 100;
}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
