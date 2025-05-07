
import { getConditionAdjustment } from '../adjustments/conditionAdjustments';
import { RulesEngineInput, AdjustmentBreakdown } from '../rules/types';
import { getMileageAdjustment } from '../adjustments/mileageAdjustments';
import { getDemandAdjustment } from '../adjustments/demandAdjustments';
import { PhotoScoreCalculator } from '../rules/calculators/photoScoreCalculator';
import { AICondition } from '@/types/photo';

interface ValuationBreakdownItem {
  factor: string;
  impact: number;
  description: string;
}

export interface FinalValuationResult {
  estimatedValue: number;
  valuationBreakdown: ValuationBreakdownItem[];
  confidenceScore: number;
  aiCondition?: AICondition;
  adjustments: {
    mileageAdjustment: number;
    conditionAdjustment: number;
    regionalAdjustment: number;
    featureAdjustments: Record<string, number>;
  };
  totalAdjustments: number;
  finalValuation: number;
  conditionSource?: string;
  aiSummary?: string;
}

/**
 * Calculates the final valuation based on various factors and adjustments.
 */
export function calculateFinalValuation(input: RulesEngineInput): FinalValuationResult {
  const { basePrice = 0, condition, mileage, zipCode, photoScore } = input;

  let estimatedValue = basePrice;
  const valuationBreakdown: ValuationBreakdownItem[] = [];
  let conditionSource = 'user';
  let aiSummary: string | undefined;

  // Adjustments object
  const adjustments = {
    mileageAdjustment: 0,
    conditionAdjustment: 0,
    regionalAdjustment: 0,
    featureAdjustments: {} as Record<string, number>
  };

  // 1. Condition Adjustment
  adjustments.conditionAdjustment = getConditionAdjustment(condition, basePrice);
  valuationBreakdown.push({
    factor: 'Condition',
    impact: Math.round((adjustments.conditionAdjustment / basePrice) * 100),
    description: `Adjustment based on the vehicle's condition (${condition})`
  });

  // 2. Mileage Adjustment
  adjustments.mileageAdjustment = getMileageAdjustment(mileage, basePrice);
  valuationBreakdown.push({
    factor: 'Mileage',
    impact: Math.round((adjustments.mileageAdjustment / basePrice) * 100),
    description: `Adjustment based on the vehicle's mileage (${mileage})`
  });

  // 3. Demand Adjustment
  adjustments.regionalAdjustment = getDemandAdjustment(zipCode, basePrice);
  valuationBreakdown.push({
    factor: 'Location',
    impact: Math.round((adjustments.regionalAdjustment / basePrice) * 100),
    description: `Adjustment based on the vehicle's location (${zipCode})`
  });

  // 4. Feature Adjustments
  if (input.features && input.features.length > 0) {
    input.features.forEach(feature => {
      const value = Math.round(basePrice * 0.01); // Example: 1% per feature
      adjustments.featureAdjustments[feature] = value;
    });
  }

  // 4. Photo Score Adjustment
  if (photoScore) {
    const photoScoreCalculator = new PhotoScoreCalculator();
    const photoScoreAdjustment = photoScoreCalculator.calculate(input);

    if (photoScoreAdjustment) {
      const photoValue = photoScoreAdjustment.value;
      valuationBreakdown.push({
        factor: 'Photo Score',
        impact: Math.round(photoScoreAdjustment.percentAdjustment * 100),
        description: photoScoreAdjustment.description
      });
    }
  }

  // Calculate total adjustments
  const totalAdjustments = 
    adjustments.mileageAdjustment + 
    adjustments.conditionAdjustment + 
    adjustments.regionalAdjustment + 
    Object.values(adjustments.featureAdjustments).reduce((sum, value) => sum + value, 0);

  // Final valuation
  const finalValuation = basePrice + totalAdjustments;
  
  // Ensure the estimated value is not negative
  estimatedValue = Math.max(0, estimatedValue);

  // 5. Photo Analysis Condition
  if (photoScore) {
    const photoScoreCondition: AICondition = {
      condition: getConditionFromScore(photoScore) as "Excellent" | "Good" | "Fair" | "Poor",
      confidenceScore: photoScore * 100,
      issuesDetected: []
    };
    
    conditionSource = 'ai';

    return {
      estimatedValue: Math.round(estimatedValue),
      valuationBreakdown,
      confidenceScore: 85,
      aiCondition: photoScoreCondition,
      adjustments,
      totalAdjustments,
      finalValuation: Math.round(finalValuation),
      conditionSource,
      aiSummary
    };
  }

  return {
    estimatedValue: Math.round(estimatedValue),
    valuationBreakdown,
    confidenceScore: 85,
    adjustments,
    totalAdjustments,
    finalValuation: Math.round(finalValuation),
    conditionSource
  };
}

// Helper function to convert score to condition
function getConditionFromScore(score: number): "Excellent" | "Good" | "Fair" | "Poor" {
  if (score >= 0.85) return "Excellent";
  if (score >= 0.7) return "Good";
  if (score >= 0.5) return "Fair";
  return "Poor";
}
