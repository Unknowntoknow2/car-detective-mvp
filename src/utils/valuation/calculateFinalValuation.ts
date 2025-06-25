
export interface ValuationAdjustment {
  factor: string;
  impact: number;
  description: string;
}

export interface FinalValuationParams {
  baseValue: number;
  adjustments: ValuationAdjustment[];
  confidenceFactors?: number[];
}

export interface FinalValuationResult {
  finalValue: number;
  adjustedValue: number;
  totalAdjustment: number;
  confidenceScore: number;
  priceRange: [number, number];
}

export function calculateFinalValuation(params: FinalValuationParams): FinalValuationResult {
  const { baseValue, adjustments = [], confidenceFactors = [] } = params;
  
  // Calculate total adjustment from all factors
  const totalAdjustment = adjustments.reduce((total, adj) => total + adj.impact, 0);
  const adjustedValue = Math.max(0, baseValue + totalAdjustment);
  
  // Calculate confidence score
  const baseConfidence = 75;
  const confidenceBonus = confidenceFactors.reduce((total, factor) => total + factor, 0);
  const confidenceScore = Math.min(100, Math.max(0, baseConfidence + confidenceBonus));
  
  // Calculate price range based on confidence
  const confidenceMultiplier = confidenceScore / 100;
  const rangeVariation = (1 - confidenceMultiplier) * 0.15; // Max 15% variation
  
  const lowerBound = Math.floor(adjustedValue * (1 - rangeVariation));
  const upperBound = Math.ceil(adjustedValue * (1 + rangeVariation));
  
  return {
    finalValue: Math.round(adjustedValue),
    adjustedValue: Math.round(adjustedValue),
    totalAdjustment: Math.round(totalAdjustment),
    confidenceScore: Math.round(confidenceScore),
    priceRange: [lowerBound, upperBound]
  };
}
