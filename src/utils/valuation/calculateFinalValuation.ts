<<<<<<< HEAD

import { RulesEngineInput, AdjustmentBreakdown } from './rules/types';
import { calculateAdjustments, calculateTotalAdjustment } from './rulesEngine';
=======
import { AdjustmentBreakdown, RulesEngineInput } from "../rules/types";
import { AICondition } from "@/types/photo";
import rulesEngine from "../rulesEngine";
import { getPhotoScoreAdjustmentDescription } from "../rules/descriptions";

export interface ValuationInput {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  trim?: string;
  fuelType?: string;
  transmission?: string;
  features?: string[];
  accidentCount?: number;
  color?: string;
  premiumFeatures?: boolean[] | string[];
  photoScore?: number;
  aiConditionOverride?: AICondition;
  baseMarketValue?: number;
}

export interface FinalValuationResult {
  basePrice: number;
  estimatedValue: number;
  priceRange: [number, number];
  confidenceScore: number;
  adjustments: AdjustmentBreakdown[];
  aiSummary?: string;
  conditionSource?: string;
  baseValue: number;
  finalValue: number;
}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

/**
 * Calculate the final valuation based on inputs
 */
export async function calculateFinalValuation(
<<<<<<< HEAD
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
  
=======
  input: ValuationInput,
  basePrice: number,
  aiCondition?: AICondition | null,
): Promise<FinalValuationResult> {
  // Convert input to RulesEngineInput
  const rulesInput: RulesEngineInput = {
    baseValue: basePrice,
    basePrice,
    make: input.make,
    model: input.model,
    year: input.year,
    mileage: input.mileage,
    condition: input.condition,
    zipCode: input.zipCode,
    trim: input.trim,
    fuelType: input.fuelType,
    transmissionType: input.transmission,
    accidentCount: input.accidentCount || 0,
    exteriorColor: input.color,
    features: input.features,
    premiumFeatures: input.premiumFeatures || [],
    // Add AI condition override if present
    aiConditionOverride: aiCondition,
    photoScore: input.photoScore,
  };

  // Calculate adjustments using rules engine
  const adjustments = await rulesEngine.calculateAdjustments(rulesInput);

  // Add photo score adjustment if available
  if (input.photoScore !== undefined && input.photoScore > 0) {
    const photoAdjustment = calculatePhotoScoreAdjustment(
      input.photoScore,
      basePrice,
    );
    const photoImpactPercent = (photoAdjustment / basePrice) * 100;

    const photoAdjustmentBreakdown: AdjustmentBreakdown = {
      name: "Photo Condition",
      factor: "Photo Condition",
      value: photoAdjustment,
      impact: photoAdjustment,
      description: getPhotoScoreAdjustmentDescription(
        input.photoScore,
        photoImpactPercent,
        photoAdjustment,
      ),
      percentAdjustment: photoImpactPercent,
    };

    adjustments.push(photoAdjustmentBreakdown);
  }

  // Calculate total adjustment
  const totalAdjustment = rulesEngine.calculateTotalAdjustment(adjustments);

  // Calculate estimated value
  const estimatedValue = basePrice + totalAdjustment;

  // Calculate confidence score based on available data
  const confidenceScore = calculateConfidenceScore(
    input,
    adjustments,
    aiCondition,
  );

  // Calculate price range based on confidence score
  const priceRange = calculatePriceRange(estimatedValue, confidenceScore);

  // Format the result
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  return {
    estimatedValue: Math.max(0, Math.round(estimatedValue)),
    confidenceScore: Math.round(confidenceScore),
    adjustments,
<<<<<<< HEAD
    basePrice
=======
    aiSummary: aiCondition?.aiSummary,
    conditionSource: aiCondition ? "AI" : "User",
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
}

/**
 * Estimate base value based on year, make, model
 */
<<<<<<< HEAD
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
=======
function calculatePhotoScoreAdjustment(
  photoScore: number,
  basePrice: number,
): number {
  if (photoScore >= 0.9) {
    // Excellent condition photos get a bonus
    return basePrice * 0.05;
  } else if (photoScore >= 0.7) {
    // Good condition photos get no adjustment
    return 0;
  } else if (photoScore >= 0.5) {
    // Fair condition photos get a small penalty
    return basePrice * -0.03;
  } else {
    // Poor condition photos get a larger penalty
    return basePrice * -0.08;
  }
}

/**
 * Calculate confidence score based on input data quality
 */
function calculateConfidenceScore(
  input: ValuationInput,
  adjustments: AdjustmentBreakdown[],
  aiCondition?: AICondition | null,
): number {
  // Base confidence starts at 70%
  let confidence = 70;

  // Adjust based on data completeness
  if (input.fuelType) confidence += 2;
  if (input.transmission) confidence += 2;
  if (input.trim) confidence += 3;
  if (input.color) confidence += 1;
  if (input.features && input.features.length > 0) confidence += 3;

  // Adjust based on AI condition data
  if (aiCondition) {
    // Add the AI confidence score (normalized to 0-15 range)
    const aiConfidenceBoost = (aiCondition.confidenceScore / 100) * 15;
    confidence += aiConfidenceBoost;
  }

  // Adjust based on adjustment validity
  if (adjustments.length >= 3) confidence += 2;
  if (adjustments.length >= 5) confidence += 3;

  // Cap confidence at 95%
  return Math.min(confidence, 95);
}

/**
 * Calculate price range based on estimated value and confidence
 */
function calculatePriceRange(
  estimatedValue: number,
  confidenceScore: number,
): [number, number] {
  // Calculate margin based on confidence (less confident = wider range)
  const margin = ((100 - confidenceScore) / 100) * estimatedValue;

  // Return price range as [min, max]
  return [
    Math.floor(estimatedValue - margin),
    Math.ceil(estimatedValue + margin),
  ];
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}
