import { AdjustmentBreakdown } from './rules/types';
import { ValuationParams, ValuationResult } from './valuationCalculator';
import { calculateAdjustments, calculateTotalAdjustment } from './rulesEngine';

// Re-export the function from valuationCalculator to avoid duplication
export { calculateFinalValuation, calculateEnhancedValuation } from './valuationCalculator';

// Other utility functions for valuation engine
export const calculateConfidenceScore = (
  input: ValuationParams, 
  adjustments: AdjustmentBreakdown[]
): number => {
  // Calculate a confidence score based on input data quality
  let score = 85; // Base confidence score
  
  // Adjust confidence based on data completeness
  if (input.make && input.model && input.year && input.mileage) {
    score += 5; // Complete basic info
  }
  
  if (input.condition) {
    score += 3; // Condition provided
  }
  
  if (input.photoScore && input.photoScore > 0.7) {
    score += 5; // Good photo score
  }
  
  if (input.features && input.features.length > 0) {
    score += 2; // Features provided
  }

  // Adjust based on driving behavior data
  if (input.drivingScore) {
    score += 4; // Driving behavior provided
  }
  
  // Adjust based on trim specification
  if (input.trim) {
    score += 3; // Trim specified
  }
  
  // Adjust confidence based on accident data quality
  if (input.accidentCount !== undefined) {
    // We don't check for accidentDetails since it's not in the ValuationParams interface
    // Just use the accidentCount for confidence adjustment
    if (input.accidentCount > 0) {
      score -= 1; // Accidents reduce confidence slightly
    }
  }
  
  // Cap score at 100
  return Math.min(score, 100);
};

/**
 * Calculate accident impact on vehicle value
 * @param baseValue Base vehicle value
 * @param accidentCount Number of accidents
 * @param severity Optional severity level of accidents
 * @returns Percentage impact and dollar amount
 */
export const calculateAccidentImpact = (
  baseValue: number,
  accidentCount: number = 0,
  severity: 'minor' | 'moderate' | 'severe' | string = 'minor'
): { percentImpact: number; dollarImpact: number } => {
  if (accidentCount === 0) {
    return { percentImpact: 0, dollarImpact: 0 };
  }
  
  // Base impact percentages by severity
  const severityImpact = {
    minor: 0.05, // 5% for minor accidents
    moderate: 0.12, // 12% for moderate accidents
    severe: 0.20, // 20% for severe accidents
  };
  
  // Default to minor if severity not recognized
  const impactRate = severityImpact[severity as keyof typeof severityImpact] || severityImpact.minor;
  
  // Multiple accidents have exponential impact up to a cap
  const multiplier = Math.min(accidentCount, 3); // Cap at 3x for multiple accidents
  const percentImpact = Math.min(impactRate * multiplier, 0.35); // Cap at 35% total impact
  
  // Calculate dollar amount
  const dollarImpact = Math.round(baseValue * percentImpact);
  
  return {
    percentImpact: percentImpact,
    dollarImpact: -dollarImpact // Negative because it reduces value
  };
};

// For backward compatibility with existing code
export const calculateValuationEngine = async (input: ValuationParams): Promise<ValuationResult> => {
  // This function is just an alias for calculateFinalValuation
  const { calculateFinalValuation } = require('./valuationCalculator');
  return calculateFinalValuation(input);
};
