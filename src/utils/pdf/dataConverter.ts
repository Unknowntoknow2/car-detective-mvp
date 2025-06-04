<<<<<<< HEAD

// utils/pdf/dataConverter.ts
=======
import { DecodedVehicleInfo } from "@/types/vehicle";
import { ReportData } from "./types";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

import { ValuationResult } from '@/types/valuation';

<<<<<<< HEAD
export const buildValuationReport = (result: ValuationResult | null, includeCarfax: boolean = false, templateType: 'basic' | 'premium' = 'basic') => {
  if (!result) {
    return {
      id: 'N/A',
      make: 'N/A',
      model: 'N/A',
      year: 0,
      mileage: 0,
      condition: 'N/A',
      price: 0,
      zipCode: 'N/A',
      vin: 'N/A',
      fuelType: 'N/A',
      transmission: 'N/A',
      color: 'N/A',
      bodyType: 'N/A',
      confidenceScore: 0,
      isPremium: false,
      priceRange: [0, 0] as [number, number],
      adjustments: [],
      generatedAt: new Date().toISOString(),
      explanation: 'N/A',
      userId: 'N/A',
    };
  }

  // Handle different price range formats
  let formattedPriceRange: [number, number] = [0, 0];
  if (Array.isArray(result.priceRange)) {
    if (result.priceRange.length >= 2) {
      formattedPriceRange = [result.priceRange[0], result.priceRange[1]];
    } else if (result.priceRange.length === 1) {
      formattedPriceRange = [result.priceRange[0], result.priceRange[0]];
    }
  } else if (result.priceRange && typeof result.priceRange === 'object' && 'min' in result.priceRange && 'max' in result.priceRange) {
    formattedPriceRange = [result.priceRange.min, result.priceRange.max];
  } else if (result.price_range) {
    if (Array.isArray(result.price_range)) {
      formattedPriceRange = [result.price_range[0], result.price_range[1]];
    } else if ('low' in result.price_range && 'high' in result.price_range) {
      formattedPriceRange = [result.price_range.low, result.price_range.high];
    }
  }

  const vehicleCondition = result.aiCondition?.condition || result.condition || 'Unknown';
  const conditionConfidence = result.aiCondition?.confidenceScore || result.confidenceScore || 0;
  const detectedIssues = result.aiCondition?.issuesDetected || [];
  const conditionSummary = result.aiCondition?.summary || `Vehicle is in ${vehicleCondition} condition.`;

  return {
    id: result.id || 'N/A',
    make: result.make || 'N/A',
    model: result.model || 'N/A',
    year: result.year || 0,
    mileage: result.mileage || 0,
    condition: result.condition || 'N/A',
    price: result.estimatedValue || result.estimated_value || 0,
    zipCode: result.zipCode || 'N/A',
    vin: result.vin || 'N/A',
    fuelType: result.fuelType || result.fuel_type || 'N/A',
    transmission: result.transmission || 'N/A',
    color: result.color || 'N/A',
    bodyType: result.bodyType || result.body_type || 'N/A',
    confidenceScore: result.confidenceScore || result.confidence_score || 0,
    isPremium: result.isPremium || result.premium_unlocked || false,
    priceRange: formattedPriceRange,
    adjustments: result.adjustments || [],
    generatedAt: new Date().toISOString(),
    explanation: result.explanation || result.gptExplanation || 'N/A',
    userId: result.userId || 'N/A',
    trim: result.trim || 'N/A',
    aiCondition: {
      condition: vehicleCondition,
      confidenceScore: conditionConfidence,
      issuesDetected: detectedIssues,
      summary: conditionSummary
    }
=======
/**
 * Convert vehicle information to report data format
 * @param vehicleInfo Basic vehicle information
 * @param additionalData Additional data needed for the report
 * @returns Report data object
 */
export function vehicleInfoToReportData(
  vehicleInfo: DecodedVehicleInfo,
  additionalData: {
    mileage: number;
    estimatedValue: number;
    confidenceScore?: number;
    condition: string;
    zipCode: string;
    adjustments: AdjustmentBreakdown[];
    isPremium?: boolean;
  },
): ReportData {
  // Process adjustments to ensure all have descriptions
  const processedAdjustments = additionalData.adjustments.map((adj) => ({
    factor: adj.factor,
    impact: adj.impact,
    description: adj.description || `Adjustment for ${adj.factor}`,
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
      Math.round(additionalData.estimatedValue * 1.10),
    ],
    adjustments: processedAdjustments,
    generatedAt: new Date().toISOString(),
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
};

<<<<<<< HEAD
export default buildValuationReport;
=======
/**
 * Convert a valuation result to report data format
 * @param valuation Valuation result object
 * @returns Report data object
 */
export function convertValuationToReportData(valuation: any): ReportData {
  // Extract adjustments or create empty array
  const adjustments = valuation.adjustments?.map((adj: any) => ({
    factor: adj.factor || adj.name || "",
    impact: adj.impact || adj.value || 0,
    description: adj.description ||
      `Adjustment for ${adj.factor || adj.name || "unknown factor"}`,
  })) || [];

  // Calculate price range if not provided
  const priceRange = valuation.priceRange || [
    Math.round((valuation.estimatedValue || valuation.valuation || 0) * 0.9),
    Math.round((valuation.estimatedValue || valuation.valuation || 0) * 1.1),
  ];

  // Use estimated value as price when price is not provided
  const price = valuation.price || valuation.estimatedValue ||
    valuation.valuation || 0;

  return {
    id: valuation.id || crypto.randomUUID(),
    make: valuation.make || "",
    model: valuation.model || "",
    year: valuation.year || 0,
    mileage: valuation.mileage || 0,
    condition: valuation.condition || "Good",
    price: price,
    estimatedValue: valuation.estimatedValue || valuation.valuation || 0,
    priceRange: priceRange,
    adjustments: adjustments,
    bestPhotoUrl: valuation.bestPhotoUrl || valuation.photoUrl || "",
    explanation: valuation.explanation || valuation.gptExplanation || "",
    generatedAt: valuation.created_at || new Date().toISOString(),
    confidenceScore: valuation.confidenceScore || 75,
    photoScore: valuation.photoScore || 0,
    isPremium: valuation.isPremium || false,
    aiCondition: valuation.aiCondition || null,
    vin: valuation.vin || "",
    zipCode: valuation.zipCode || valuation.zip || "",
    trim: valuation.trim || "",
    color: valuation.color || "",
    bodyType: valuation.bodyType || valuation.bodyStyle || "",
    fuelType: valuation.fuelType || valuation.fuel_type || "",
    transmission: valuation.transmission || "",
  };
}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
