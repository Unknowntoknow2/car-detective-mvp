
import { DecodedVehicleInfo } from '@/types/vehicle';
import { ReportData } from './types';

interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  description?: string;
}

/**
 * Convert vehicle information to report data format
 * @param vehicleInfo Basic vehicle information
 * @param additionalData Additional data needed for the report
 * @returns Report data object
 */
export function vehicleInfoToReportData(vehicleInfo: DecodedVehicleInfo, additionalData: {
  mileage: number;
  estimatedValue: number;
  confidenceScore?: number;
  condition: string;
  zipCode: string;
  adjustments: AdjustmentBreakdown[];
  isPremium?: boolean;
}): ReportData {
  // Process adjustments to ensure all have descriptions
  const processedAdjustments = additionalData.adjustments.map(adj => ({
    factor: adj.factor,
    impact: adj.impact,
    description: adj.description || `Adjustment for ${adj.factor}`
  }));

  return {
    // Use crypto.randomUUID() since DecodedVehicleInfo doesn't have an id property
    id: crypto.randomUUID(),
    make: vehicleInfo.make,
    model: vehicleInfo.model,
    year: vehicleInfo.year,
    mileage: additionalData.mileage,
    condition: additionalData.condition,
    // Use estimated value as price when generating report
    price: additionalData.estimatedValue,
    estimatedValue: additionalData.estimatedValue,
    confidenceScore: additionalData.confidenceScore || 75,
    vin: vehicleInfo.vin,
    zipCode: additionalData.zipCode,
    trim: vehicleInfo.trim,
    fuelType: vehicleInfo.fuelType,
    transmission: vehicleInfo.transmission,
    color: vehicleInfo.color,
    bodyType: vehicleInfo.bodyType,
    isPremium: additionalData.isPremium || false,
    priceRange: [
      Math.round(additionalData.estimatedValue * 0.90), 
      Math.round(additionalData.estimatedValue * 1.10)
    ],
    adjustments: processedAdjustments,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Convert a valuation result to report data format
 * @param valuation Valuation result object
 * @returns Report data object
 */
export function convertValuationToReportData(valuation: any): ReportData {
  // Extract adjustments or create empty array
  const adjustments = valuation.adjustments?.map((adj: any) => ({
    factor: adj.factor || adj.name || '',
    impact: adj.impact || adj.value || 0,
    description: adj.description || `Adjustment for ${adj.factor || adj.name || 'unknown factor'}`
  })) || [];

  // Calculate price range if not provided
  const priceRange = valuation.priceRange || [
    Math.round((valuation.estimatedValue || valuation.valuation || 0) * 0.9),
    Math.round((valuation.estimatedValue || valuation.valuation || 0) * 1.1)
  ];

  // Use estimated value as price when price is not provided
  const price = valuation.price || valuation.estimatedValue || valuation.valuation || 0;

  return {
    id: valuation.id || crypto.randomUUID(),
    make: valuation.make || '',
    model: valuation.model || '',
    year: valuation.year || 0,
    mileage: valuation.mileage || 0,
    condition: valuation.condition || 'Good',
    price: price,
    estimatedValue: valuation.estimatedValue || valuation.valuation || 0,
    priceRange: priceRange,
    adjustments: adjustments,
    bestPhotoUrl: valuation.bestPhotoUrl || valuation.photoUrl || '',
    explanation: valuation.explanation || valuation.gptExplanation || '',
    generatedAt: valuation.created_at || new Date().toISOString(),
    confidenceScore: valuation.confidenceScore || 75,
    photoScore: valuation.photoScore || 0,
    isPremium: valuation.isPremium || false,
    aiCondition: valuation.aiCondition || null,
    vin: valuation.vin || '',
    zipCode: valuation.zipCode || valuation.zip || '',
    trim: valuation.trim || '',
    color: valuation.color || '',
    bodyType: valuation.bodyType || valuation.bodyStyle || '',
    fuelType: valuation.fuelType || valuation.fuel_type || '',
    transmission: valuation.transmission || ''
  };
}
