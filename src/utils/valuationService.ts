
// Consolidated valuation service combining pricing, adjustments, and market analysis
import { ReportData } from './pdfService';
import { UnifiedVehicleData } from '@/types/vehicle';

export interface ValuationInput {
  vehicle: UnifiedVehicleData;
  mileage: number;
  condition: string;
  zipCode: string;
  features?: string[];
  accidents?: number;
  serviceHistory?: string;
}

export interface ValuationResult {
  estimatedValue: number;
  basePrice: number;
  adjustments: AdjustmentFactor[];
  priceRange: [number, number];
  confidenceScore: number;
  marketAnalysis: MarketAnalysis;
}

export interface AdjustmentFactor {
  factor: string;
  impact: number;
  description: string;
  percentAdjustment?: number;
}

export interface MarketAnalysis {
  demandLevel: 'low' | 'medium' | 'high';
  seasonalFactor: number;
  regionalMultiplier: number;
  competitorAverage?: number;
  marketTrend: 'up' | 'down' | 'stable';
}

// Base price calculation
function calculateBasePrice(vehicle: UnifiedVehicleData): number {
  // Simplified base price calculation
  const yearFactor = Math.max(0.5, (vehicle.year - 2000) / 24);
  const makeFactor = getMakeFactor(vehicle.make);
  
  return Math.round(30000 * yearFactor * makeFactor);
}

// Make-specific pricing factors
function getMakeFactor(make: string): number {
  const factors: Record<string, number> = {
    'Toyota': 1.1,
    'Honda': 1.05,
    'BMW': 1.3,
    'Mercedes': 1.35,
    'Audi': 1.25,
    'Lexus': 1.2,
    'Ford': 0.9,
    'Chevrolet': 0.85,
    'Nissan': 0.95,
    'Hyundai': 0.8,
    'Kia': 0.75
  };
  
  return factors[make] || 1.0;
}

// Mileage adjustment calculation
function calculateMileageAdjustment(mileage: number, year: number): AdjustmentFactor {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;
  const expectedMileage = vehicleAge * 12000; // 12k miles per year average
  const mileageDifference = mileage - expectedMileage;
  
  // $0.10 per mile difference, with diminishing returns
  const baseImpact = mileageDifference * -0.10;
  const adjustedImpact = baseImpact * (1 - Math.abs(mileageDifference) / 200000);
  
  return {
    factor: 'Mileage',
    impact: Math.round(adjustedImpact),
    description: mileage > expectedMileage 
      ? `Higher than average mileage (${mileage.toLocaleString()} vs ${expectedMileage.toLocaleString()} expected)`
      : `Lower than average mileage (${mileage.toLocaleString()} vs ${expectedMileage.toLocaleString()} expected)`,
    percentAdjustment: (adjustedImpact / 25000) * 100
  };
}

// Condition adjustment calculation
function calculateConditionAdjustment(condition: string, basePrice: number): AdjustmentFactor {
  const conditionFactors: Record<string, number> = {
    'Excellent': 0.15,
    'Good': 0,
    'Fair': -0.15,
    'Poor': -0.35
  };
  
  const factor = conditionFactors[condition] || 0;
  const impact = Math.round(basePrice * factor);
  
  return {
    factor: 'Condition',
    impact,
    description: `Vehicle condition rated as ${condition}`,
    percentAdjustment: factor * 100
  };
}

// Market analysis calculation
function calculateMarketAnalysis(zipCode: string, make: string, model: string): MarketAnalysis {
  // Simplified market analysis
  const demandLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const demandLevel = demandLevels[Math.floor(Math.random() * 3)];
  
  const seasonalFactor = getSeasonalFactor();
  const regionalMultiplier = getRegionalMultiplier(zipCode);
  
  return {
    demandLevel,
    seasonalFactor,
    regionalMultiplier,
    competitorAverage: Math.round(20000 + Math.random() * 10000),
    marketTrend: Math.random() > 0.5 ? 'up' : 'down'
  };
}

// Seasonal factor calculation
function getSeasonalFactor(): number {
  const month = new Date().getMonth() + 1;
  const seasonalFactors: Record<number, number> = {
    1: 0.95, 2: 0.92, 3: 1.02, 4: 1.05, 5: 1.08, 6: 1.10,
    7: 1.08, 8: 1.05, 9: 1.02, 10: 0.98, 11: 0.95, 12: 0.90
  };
  
  return seasonalFactors[month] || 1.0;
}

// Regional multiplier calculation
function getRegionalMultiplier(zipCode: string): number {
  // Simplified regional factors based on ZIP code ranges
  const zip = parseInt(zipCode);
  
  if (zip >= 90000 && zip <= 96999) return 1.2; // California
  if (zip >= 10000 && zip <= 19999) return 1.15; // Northeast
  if (zip >= 20000 && zip <= 29999) return 1.1; // Mid-Atlantic
  if (zip >= 60000 && zip <= 69999) return 0.95; // Midwest
  if (zip >= 70000 && zip <= 79999) return 0.9; // South
  
  return 1.0; // Default
}

// Main valuation function
export async function calculateValuation(input: ValuationInput): Promise<ValuationResult> {
  try {
    // Calculate base price
    const basePrice = calculateBasePrice(input.vehicle);
    
    // Calculate adjustments
    const adjustments: AdjustmentFactor[] = [];
    
    // Mileage adjustment
    adjustments.push(calculateMileageAdjustment(input.mileage, input.vehicle.year));
    
    // Condition adjustment
    adjustments.push(calculateConditionAdjustment(input.condition, basePrice));
    
    // Calculate market analysis
    const marketAnalysis = calculateMarketAnalysis(input.zipCode, input.vehicle.make, input.vehicle.model);
    
    // Apply adjustments
    const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.impact, 0);
    const adjustedPrice = basePrice + totalAdjustment;
    
    // Apply market factors
    const estimatedValue = Math.round(adjustedPrice * marketAnalysis.seasonalFactor * marketAnalysis.regionalMultiplier);
    
    // Calculate price range (±10%)
    const priceRange: [number, number] = [
      Math.round(estimatedValue * 0.9),
      Math.round(estimatedValue * 1.1)
    ];
    
    // Calculate confidence score
    const confidenceScore = calculateConfidenceScore(input, adjustments);
    
    return {
      estimatedValue,
      basePrice,
      adjustments,
      priceRange,
      confidenceScore,
      marketAnalysis
    };
  } catch (error) {
    throw new Error(`Valuation calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Confidence score calculation
function calculateConfidenceScore(input: ValuationInput, adjustments: AdjustmentFactor[]): number {
  let score = 75; // Base confidence
  
  // Increase confidence for complete data
  if (input.vehicle.vin) score += 10;
  if (input.serviceHistory && input.serviceHistory !== 'unknown') score += 5;
  if (input.features && input.features.length > 0) score += 5;
  
  // Decrease confidence for high adjustments
  const totalAdjustmentPercent = Math.abs(adjustments.reduce((sum, adj) => sum + (adj.percentAdjustment || 0), 0));
  if (totalAdjustmentPercent > 20) score -= 10;
  if (totalAdjustmentPercent > 30) score -= 10;
  
  return Math.max(50, Math.min(95, score));
}

// Convert valuation result to report data format
export function convertToReportData(
  valuationResult: ValuationResult,
  vehicleInput: ValuationInput
): ReportData {
  return {
    id: Date.now().toString(),
    make: vehicleInput.vehicle.make,
    model: vehicleInput.vehicle.model,
    year: vehicleInput.vehicle.year,
    mileage: vehicleInput.mileage,
    condition: vehicleInput.condition,
    estimatedValue: valuationResult.estimatedValue,
    price: valuationResult.estimatedValue,
    confidenceScore: valuationResult.confidenceScore,
    vin: vehicleInput.vehicle.vin,
    zipCode: vehicleInput.zipCode,
    adjustments: valuationResult.adjustments,
    generatedAt: new Date().toISOString(),
    priceRange: valuationResult.priceRange,
    isPremium: false,
    basePrice: valuationResult.basePrice,
    competitorAverage: valuationResult.marketAnalysis.competitorAverage
  };
}

// Legacy exports for backward compatibility
export const getValuation = calculateValuation;
export const processValuation = calculateValuation;
