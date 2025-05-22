
import { RulesEngineInput, AdjustmentBreakdown } from './rules/types';
import { calculateAdjustments, calculateTotalAdjustment } from './rulesEngine';

/**
 * Calculate the final valuation based on inputs
 */
export async function calculateFinalValuation(
  input: RulesEngineInput
): Promise<{
  estimatedValue: number;
  confidenceScore: number;
  adjustments: AdjustmentBreakdown[];
  basePrice: number;
}> {
  // Get adjustments from the rules engine
  const adjustments = await calculateAdjustments(input);
  
  // Calculate total adjustment
  const totalAdjustment = calculateTotalAdjustment(adjustments);
  
  // Calculate base price and final value
  const basePrice = input.basePrice || getBaseValueEstimate(input);
  const estimatedValue = basePrice + totalAdjustment;
  
  // Calculate confidence score
  let confidenceScore = 80; // Default
  
  // Adjust confidence based on available data
  if (input.photoScore) {
    confidenceScore = Math.min(
      95,
      confidenceScore + (input.photoScore * 10)
    );
  }
  
  // Adjust based on data quality
  if (input.accidentCount !== undefined) {
    confidenceScore += 3; // More data = more confidence
  }
  
  if (input.aiConditionOverride) {
    confidenceScore += 2; // AI assessment improves confidence
  }
  
  return {
    estimatedValue: Math.max(0, Math.round(estimatedValue)),
    confidenceScore: Math.round(confidenceScore),
    adjustments,
    basePrice
  };
}

/**
 * Estimate base value based on year, make, model
 */
export function getBaseValueEstimate(input: { 
  make: string;
  model: string; 
  year: number;
  mileage: number;
}): number {
  // In real app, this would call database or API
  // For now, use a simple calculation
  const currentYear = new Date().getFullYear();
  const ageDiscount = (currentYear - input.year) * 1500;
  const mileageDiscount = Math.floor(input.mileage / 10000) * 500;
  
  // Base values by make (very simplified)
  const baseMakeValues: Record<string, number> = {
    'Toyota': 30000,
    'Honda': 28000,
    'Ford': 26000,
    'Chevrolet': 25000,
    'BMW': 45000,
    'Mercedes': 48000,
    'Audi': 42000
  };
  
  const baseValue = baseMakeValues[input.make] || 25000;
  
  return Math.max(5000, baseValue - ageDiscount - mileageDiscount);
}
