
import { RulesEngineInput, AdjustmentBreakdown } from './rules/types';
import { calculateAdjustments, calculateTotalAdjustment } from './rulesEngine';

// Export these type definitions for the ValuationCalculatorDemo component
export interface ValuationParams {
  baseMarketValue?: number;
  baseValue?: number;
  mileage?: number;
  condition?: string;
  zipCode: string;
  features?: string[];
  make?: string;
  model?: string;
  year?: number;
  vehicleYear?: number;
  accidentCount?: number;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  titleStatus?: string;
  exteriorColor?: string;
  colorMultiplier?: number;
  saleDate?: string;
  mpg?: number;
  aiConditionOverride?: any;
  photoScore?: number;
  drivingScore?: number; // Added for DrivingBehaviorCalculator
}

export interface ValuationResult {
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  basePrice?: number;
  baseValue?: number;
  finalValue?: number;
  adjustments: AdjustmentBreakdown[];
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  vin?: string;
  isPremium?: boolean;
  features?: string[];
  color?: string;
  bodyStyle?: string;
  bodyType?: string;
  fuelType?: string;
  explanation?: string;
  transmission?: string;
  bestPhotoUrl?: string;
  photoScore?: number;
  photoExplanation?: string;
}

// Provide a renamed version of calculateAdjustments as calculateFinalValuation for backward compatibility
export const calculateFinalValuation = async (input: ValuationParams): Promise<ValuationResult> => {
  // Convert ValuationParams to RulesEngineInput
  const rulesInput: RulesEngineInput = {
    make: input.make || '',
    model: input.model || '',
    year: input.year || input.vehicleYear || new Date().getFullYear(),
    mileage: input.mileage || 0,
    condition: input.condition || 'Good',
    zipCode: input.zipCode,
    trim: input.trim,
    fuelType: input.fuelType,
    transmissionType: input.transmission,
    accidentCount: input.accidentCount,
    exteriorColor: input.exteriorColor,
    features: input.features,
    aiConditionOverride: input.aiConditionOverride,
    photoScore: input.photoScore,
    basePrice: input.baseMarketValue,
    bodyType: input.bodyType,
    bodyStyle: input.bodyType,
    colorMultiplier: input.colorMultiplier,
    drivingScore: input.drivingScore // Added for DrivingBehaviorCalculator
  };

  // Calculate adjustments
  const adjustments = await calculateAdjustments(rulesInput);
  const totalAdjustment = calculateTotalAdjustment(adjustments);
  
  // Calculate estimated value
  const baseValue = input.baseMarketValue || 20000;
  const estimatedValue = Math.round(baseValue + totalAdjustment);
  
  // Calculate confidence score (mock implementation)
  const confidenceScore = 85;
  
  // Calculate price range
  const priceRange: [number, number] = [
    Math.round(estimatedValue * 0.95),
    Math.round(estimatedValue * 1.05)
  ];
  
  return {
    estimatedValue,
    confidenceScore,
    priceRange,
    basePrice: baseValue,
    baseValue,
    finalValue: estimatedValue,
    adjustments,
    make: input.make,
    model: input.model,
    year: input.year,
    mileage: input.mileage,
    condition: input.condition,
    photoScore: input.photoScore
  };
};

// Add an alias for backward compatibility
export const calculateEnhancedValuation = calculateFinalValuation;
