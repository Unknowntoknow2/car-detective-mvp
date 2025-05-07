import { getConditionAdjustment } from '../adjustments/conditionAdjustments';
import { RulesEngineInput } from '../rules/types';
import { getMileageAdjustment } from '../adjustments/mileageAdjustments';
import { getDemandAdjustment } from '../adjustments/demandAdjustments';
import { PhotoScoreCalculator } from '../rules/calculators/photoScoreCalculator';
import { AICondition } from '@/types/photo';

interface ValuationBreakdownItem {
  factor: string;
  impact: number;
  description: string;
}

interface FinalValuationResult {
  estimatedValue: number;
  valuationBreakdown: ValuationBreakdownItem[];
  confidenceScore: number;
  aiCondition?: AICondition;
}

/**
 * Calculates the final valuation based on various factors and adjustments.
 */
export function calculateFinalValuation(input: RulesEngineInput): FinalValuationResult {
  const { basePrice, condition, mileage, zipCode, photoScore } = input;

  let estimatedValue = basePrice;
  const valuationBreakdown: ValuationBreakdownItem[] = [];

  // 1. Condition Adjustment
  const conditionAdjustment = getConditionAdjustment(condition, basePrice);
  estimatedValue += conditionAdjustment;
  valuationBreakdown.push({
    factor: 'Condition',
    impact: Math.round((conditionAdjustment / basePrice) * 100),
    description: `Adjustment based on the vehicle's condition (${condition})`
  });

  // 2. Mileage Adjustment
  const mileageAdjustment = getMileageAdjustment(mileage, basePrice);
  estimatedValue += mileageAdjustment;
  valuationBreakdown.push({
    factor: 'Mileage',
    impact: Math.round((mileageAdjustment / basePrice) * 100),
    description: `Adjustment based on the vehicle's mileage (${mileage})`
  });

  // 3. Demand Adjustment
  const demandAdjustment = getDemandAdjustment(zipCode, basePrice);
  estimatedValue += demandAdjustment;
  valuationBreakdown.push({
    factor: 'Location',
    impact: Math.round((demandAdjustment / basePrice) * 100),
    description: `Adjustment based on the vehicle's location (${zipCode})`
  });

  // 4. Photo Score Adjustment
  if (photoScore) {
    const photoScoreCalculator = new PhotoScoreCalculator();
    const photoScoreAdjustment = photoScoreCalculator.calculate(input);

    if (photoScoreAdjustment) {
      estimatedValue += photoScoreAdjustment.value;
      valuationBreakdown.push({
        factor: 'Photo Score',
        impact: Math.round(photoScoreAdjustment.percentAdjustment * 100),
        description: photoScoreAdjustment.description
      });
    }
  }

  // Ensure the estimated value is not negative
  estimatedValue = Math.max(0, estimatedValue);

  // 5. Photo Analysis Condition
  if (photoScore) {
    const photoScoreCondition: AICondition = {
      condition: getConditionFromScore(photoScore) as "Excellent" | "Good" | "Fair" | "Poor",
      confidenceScore: photoScore * 100,
      issuesDetected: []
    };

    return {
      estimatedValue: Math.round(estimatedValue),
      valuationBreakdown,
      confidenceScore: 85,
      aiCondition: photoScoreCondition
    };
  }

  return {
    estimatedValue: Math.round(estimatedValue),
    valuationBreakdown,
    confidenceScore: 85
  };
}

// Helper function to convert score to condition
function getConditionFromScore(score: number): "Excellent" | "Good" | "Fair" | "Poor" {
  if (score >= 0.85) return "Excellent";
  if (score >= 0.7) return "Good";
  if (score >= 0.5) return "Fair";
  return "Poor";
}
