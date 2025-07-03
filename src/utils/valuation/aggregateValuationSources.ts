
import { LegacyValuationResult } from "@/types/valuation";
import { EnhancedValuationParams } from "@/utils/valuation/types";
import { calculateVehicleValue } from "@/valuation/calculateVehicleValue";
import { getZipAdjustment, getRegionNameFromZip } from "@/utils/adjustments/locationAdjustments";

export interface EnrichedDataSource {
  source: string;
  data: any;
  confidence: number;
  marketValue?: number;
}

export async function aggregateValuationSources(
  params: EnhancedValuationParams,
  enrichedSources: EnrichedDataSource[] = []
): Promise<LegacyValuationResult> {
  // Base market value estimation
  const baseMarketValue = params.baseMarketValue || estimateBaseValue(params);
  
  // Calculate adjustments from multiple sources
  const adjustments = [];
  
  // Location adjustment
  if (params.zipCode) {
    const locationMultiplier = getZipAdjustment(params.zipCode);
    if (locationMultiplier !== 1.0) {
      adjustments.push({
        factor: "Location",
        impact: Math.round((locationMultiplier - 1) * baseMarketValue),
        description: `${getRegionNameFromZip(params.zipCode)} market adjustment`
      });
    }
  }
  
  // Mileage adjustment
  if (params.mileage) {
    const mileageAdjustment = calculateMileageAdjustment(params.mileage, params.year || new Date().getFullYear());
    if (mileageAdjustment !== 0) {
      adjustments.push({
        factor: "Mileage",
        impact: mileageAdjustment,
        description: getMileageDescription(params.mileage)
      });
    }
  }
  
  // Condition adjustment
  if (params.condition) {
    const conditionAdjustment = calculateConditionAdjustment(params.condition, baseMarketValue);
    if (conditionAdjustment !== 0) {
      adjustments.push({
        factor: "Condition",
        impact: conditionAdjustment,
        description: `Vehicle condition: ${params.condition}`
      });
    }
  }
  
  // Calculate final value
  const finalValue = calculateVehicleValue(baseMarketValue, adjustments);
  
  // Calculate confidence score based on data availability
  const confidenceScore = calculateConfidenceScore(params, enrichedSources);
  
  // Calculate price range
  const priceRange: [number, number] = [
    Math.round(finalValue * 0.92),
    Math.round(finalValue * 1.08)
  ];
  
  return {
    id: params.valuationId || `val-${Date.now()}`,
    make: params.make || '',
    model: params.model || '',
    year: params.year || new Date().getFullYear(),
    mileage: params.mileage || 0,
    condition: params.condition || 'Good',
    estimatedValue: finalValue,
    confidenceScore,
    priceRange,
    adjustments,
    baseValue: baseMarketValue,
    finalValue,
    zipCode: params.zipCode,
    vin: params.vin,
    isPremium: params.isPremium || false
  };
}

function estimateBaseValue(params: EnhancedValuationParams): number {
  // Simple base value estimation - in production this would use comprehensive data
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - (params.year || currentYear);
  
  // Base value starts at $30K and depreciates
  let baseValue = 30000;
  
  // Age depreciation (roughly 15% per year for first 5 years, then slower)
  if (vehicleAge <= 5) {
    baseValue *= Math.pow(0.85, vehicleAge);
  } else {
    baseValue *= Math.pow(0.85, 5) * Math.pow(0.92, vehicleAge - 5);
  }
  
  return Math.round(baseValue);
}

function calculateMileageAdjustment(mileage: number, year: number): number {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;
  const expectedMileage = vehicleAge * 12000; // Average 12K miles per year
  
  const mileageDifference = mileage - expectedMileage;
  
  // Adjust by approximately $0.10 per mile difference
  return Math.round(mileageDifference * -0.10);
}

function getMileageDescription(mileage: number): string {
  if (mileage < 30000) return "Low mileage vehicle";
  if (mileage > 100000) return "High mileage affects value";
  return "Average mileage for age";
}

function calculateConditionAdjustment(condition: string, baseValue: number): number {
  const conditionMultipliers = {
    'Excellent': 0.05,
    'Very Good': 0.02,
    'Good': 0,
    'Fair': -0.08,
    'Poor': -0.15
  };
  
  const multiplier = conditionMultipliers[condition as keyof typeof conditionMultipliers] || 0;
  return Math.round(baseValue * multiplier);
}

function calculateConfidenceScore(params: EnhancedValuationParams, sources: EnrichedDataSource[]): number {
  let score = 50; // Base score
  
  // Add points for each available data point
  if (params.vin) score += 15;
  if (params.mileage) score += 10;
  if (params.condition) score += 10;
  if (params.zipCode) score += 5;
  if (params.make && params.model) score += 10;
  
  // Add points for enriched data sources
  score += sources.length * 5;
  
  // Cap at 95
  return Math.min(score, 95);
}
