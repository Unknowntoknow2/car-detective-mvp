
import { calculateAdjustments, calculateTotalAdjustment } from './rulesEngine';
import { RulesEngineInput } from './rules/types';
import { AdjustmentBreakdown } from './types/photo';

/**
 * Calculate a vehicle's value
 */
export async function calculateVehicleValue(input: RulesEngineInput): Promise<{
  estimatedValue: number;
  adjustments: AdjustmentBreakdown[];
  confidenceScore: number;
}> {
  try {
    // Starting point - base value
    const baseValue = input.baseValue || 20000; // Example default
    
    // Calculate adjustments
    const adjustments = await calculateAdjustments(input);
    
    // Calculate total adjustment amount
    const totalAdjustment = calculateTotalAdjustment(adjustments);
    
    // Final value
    const estimatedValue = baseValue + totalAdjustment;
    
    // Simple confidence score (in real app, would be more sophisticated)
    const confidenceScore = Math.min(95, 70 + adjustments.length * 5);
    
    return {
      estimatedValue: Math.max(0, Math.round(estimatedValue)),
      adjustments,
      confidenceScore
    };
  } catch (error) {
    console.error('Error calculating vehicle value:', error);
    throw error;
  }
}

/**
 * Advanced valuation calculator with confidence scoring
 */
export async function calculateEnhancedValuation(input: RulesEngineInput): Promise<{
  estimatedValue: number;
  adjustments: AdjustmentBreakdown[];
  confidenceScore: number;
  priceRange: { min: number; max: number };
}> {
  const { estimatedValue, adjustments, confidenceScore } = await calculateVehicleValue(input);
  
  // Create price range (in real app, would be more sophisticated)
  const variancePercentage = Math.max(5, 20 - (confidenceScore / 5));
  const variance = estimatedValue * (variancePercentage / 100);
  
  return {
    estimatedValue,
    adjustments,
    confidenceScore,
    priceRange: {
      min: Math.max(0, Math.round(estimatedValue - variance)),
      max: Math.round(estimatedValue + variance)
    }
  };
}
