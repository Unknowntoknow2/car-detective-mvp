
import { RulesEngineInput, AdjustmentBreakdown } from '../rules/types';
import { AICondition } from '@/types/photo';
import rulesEngine from '../rulesEngine';
import { calculateDemandAdjustment } from '../adjustments/demandAdjustments';

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
  premiumFeatures?: boolean;
}

export interface ValuationOutput {
  estimatedValue: number;
  basePrice: number;
  adjustments: AdjustmentBreakdown[];
  confidenceScore: number;
  priceRange: [number, number];
}

export interface FinalValuationResult {
  basePrice: number;
  estimatedValue: number;
  priceRange: [number, number];
  confidenceScore: number;
  adjustments: AdjustmentBreakdown[];
  aiSummary?: string;
  conditionSource?: string;
}

/**
 * Calculate the final valuation for a vehicle
 */
export async function calculateFinalValuation(
  input: ValuationInput,
  basePrice: number,
  aiCondition?: AICondition | null
): Promise<FinalValuationResult> {
  // Convert input to RulesEngineInput
  const rulesInput: RulesEngineInput = {
    basePrice,
    make: input.make,
    model: input.model,
    year: input.year,
    mileage: input.mileage,
    condition: input.condition,
    zipCode: input.zipCode,
    trim: input.trim,
    fuelType: input.fuelType,
    transmission: input.transmission,
    accidentCount: input.accidentCount || 0,
    color: input.color,
    features: input.features,
    premiumFeatures: input.premiumFeatures,
    // Add AI condition override if present
    aiConditionOverride: aiCondition
  };
  
  // Calculate adjustments using rules engine
  const adjustments = await rulesEngine.calculateAdjustments(rulesInput);
  
  // Calculate total adjustment
  const totalAdjustment = rulesEngine.calculateTotalAdjustment(adjustments);
  
  // Calculate estimated value
  const estimatedValue = basePrice + totalAdjustment;
  
  // Calculate confidence score based on available data
  const confidenceScore = calculateConfidenceScore(input, adjustments, aiCondition);
  
  // Calculate price range based on confidence score
  const priceRange = calculatePriceRange(estimatedValue, confidenceScore);
  
  // Format the result
  return {
    basePrice,
    estimatedValue,
    priceRange,
    confidenceScore,
    adjustments,
    aiSummary: aiCondition?.aiSummary,
    conditionSource: aiCondition ? 'AI' : 'User' 
  };
}

/**
 * Calculate confidence score based on input data quality
 */
function calculateConfidenceScore(
  input: ValuationInput, 
  adjustments: AdjustmentBreakdown[],
  aiCondition?: AICondition | null
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
  confidenceScore: number
): [number, number] {
  // Calculate margin based on confidence (less confident = wider range)
  const margin = ((100 - confidenceScore) / 100) * estimatedValue;
  
  // Return price range as [min, max]
  return [
    Math.floor(estimatedValue - margin),
    Math.ceil(estimatedValue + margin)
  ];
}
