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
  
  // Cap score at 100
  return Math.min(score, 100);
};

// For backward compatibility with existing code
export const calculateValuationEngine = async (input: ValuationParams): Promise<ValuationResult> => {
  // This function is just an alias for calculateFinalValuation
  const { calculateFinalValuation } = require('./valuationCalculator');
  return calculateFinalValuation(input);
};
