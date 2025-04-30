
import { calculateConfidenceScore, getConfidenceLevel } from './confidenceCalculator';
import rulesEngine, { AdjustmentBreakdown } from './rulesEngine';
import { ValuationAuditTrail } from './rules/RulesEngine';
import type { VehicleCondition } from './adjustments/types';
import { CarfaxData } from './carfax/mockCarfaxService';

// Sample base prices for testing - in production this would come from a database
const SAMPLE_BASE_PRICES: Record<string, Record<string, number>> = {
  'Toyota': {
    'Camry': 25000,
    'Corolla': 20000,
    'RAV4': 28000
  },
  'Honda': {
    'Civic': 22000,
    'Accord': 27000,
    'CR-V': 29000
  }
};

const DEFAULT_BASE_PRICE = 20000;

export interface ValuationInput {
  make: string;
  model: string;
  year: number;
  mileage: number;
  zip?: string;
  condition: string;
  vin?: string;
  trim?: string;
  accidentCount?: number;
  titleStatus?: string;
  premiumFeatures?: string[];
  hasCarfax?: boolean;
  carfaxData?: CarfaxData;
  photoScore?: number;
  equipmentIds?: number[];
  equipmentMultiplier?: number;
  equipmentValueAdd?: number;
  exteriorColor?: string;
  colorMultiplier?: number;
  fuelType?: string;
  fuelTypeMultiplier?: number;
  transmissionType?: string;
  transmissionMultiplier?: number;
}

export interface ValuationResult {
  basePrice: number;
  adjustments: AdjustmentBreakdown[];
  estimatedValue: number;
  confidenceScore: number;
  confidenceLevel: string;
  priceRange: [number, number];
  carfaxData?: CarfaxData;
  auditTrail: ValuationAuditTrail;
  photoScore?: number;
  equipmentInfo?: {
    ids: number[];
    multiplier: number;
    valueAdd: number;
  };
  colorInfo?: {
    color: string;
    multiplier: number;
  };
  fuelTypeInfo?: {
    type: string;
    multiplier: number;
  };
  transmissionInfo?: {
    type: string;
    multiplier: number;
  };
}

function getBasePrice(make: string, model: string): number {
  return SAMPLE_BASE_PRICES[make]?.[model] || DEFAULT_BASE_PRICE;
}

export async function calculateValuation(input: ValuationInput): Promise<ValuationResult> {
  // Get base price from our sample data
  const basePrice = getBasePrice(input.make, input.model);
  
  // Calculate adjustments using the rules engine
  const adjustments = await rulesEngine.calculateAdjustments({
    make: input.make,
    model: input.model,
    year: input.year,
    mileage: input.mileage,
    condition: input.condition,
    zipCode: input.zip,
    trim: input.trim,
    accidentCount: input.accidentCount,
    titleStatus: input.titleStatus,
    premiumFeatures: input.premiumFeatures,
    basePrice: basePrice,
    carfaxData: input.carfaxData,
    photoScore: input.photoScore,
    equipmentIds: input.equipmentIds,
    equipmentMultiplier: input.equipmentMultiplier,
    equipmentValueAdd: input.equipmentValueAdd,
    exteriorColor: input.exteriorColor,
    colorMultiplier: input.colorMultiplier,
    fuelType: input.fuelType,
    fuelTypeMultiplier: input.fuelTypeMultiplier,
    transmissionType: input.transmissionType,
    transmissionMultiplier: input.transmissionMultiplier
  });
  
  // Calculate total adjustment
  const totalAdjustment = rulesEngine.calculateTotalAdjustment(adjustments);

  // Apply color multiplier to the estimated value if provided
  let estimatedValue = Math.round(basePrice + totalAdjustment);
  
  // Apply color multiplier if present
  if (input.colorMultiplier && input.colorMultiplier !== 1) {
    estimatedValue = Math.round(estimatedValue * input.colorMultiplier);
  }
  
  // Apply fuel type multiplier if present
  if (input.fuelTypeMultiplier && input.fuelTypeMultiplier !== 1) {
    estimatedValue = Math.round(estimatedValue * input.fuelTypeMultiplier);
  }
  
  // Apply transmission multiplier if present
  if (input.transmissionMultiplier && input.transmissionMultiplier !== 1) {
    estimatedValue = Math.round(estimatedValue * input.transmissionMultiplier);
  }

  // Create an audit trail
  const auditTrail = rulesEngine.createAuditTrail(
    {
      make: input.make,
      model: input.model,
      year: input.year,
      mileage: input.mileage,
      condition: input.condition,
      zipCode: input.zip,
      trim: input.trim,
      accidentCount: input.accidentCount,
      titleStatus: input.titleStatus,
      premiumFeatures: input.premiumFeatures,
      basePrice: basePrice,
      carfaxData: input.carfaxData,
      photoScore: input.photoScore,
      equipmentIds: input.equipmentIds,
      exteriorColor: input.exteriorColor,
      colorMultiplier: input.colorMultiplier,
      fuelType: input.fuelType,
      fuelTypeMultiplier: input.fuelTypeMultiplier,
      transmissionType: input.transmissionType,
      transmissionMultiplier: input.transmissionMultiplier
    },
    adjustments,
    totalAdjustment
  );

  // Calculate confidence score and level
  const confidenceScore = calculateConfidenceScore({
    vin: input.vin,
    zip: input.zip,
    mileage: input.mileage,
    year: input.year,
    make: input.make,
    model: input.model,
    condition: input.condition,
    hasCarfax: input.hasCarfax || !!input.carfaxData,
    hasPhotoScore: !!input.photoScore,
    hasTitleStatus: input.titleStatus !== undefined && input.titleStatus !== 'Clean',
    hasEquipment: input.equipmentIds !== undefined && input.equipmentIds.length > 0,
    hasTransmission: input.transmissionType !== undefined
  });

  // Calculate price range (±$500 or ±2.5% of estimated value, whichever is greater)
  const variation = Math.max(500, estimatedValue * 0.025);
  const priceRange: [number, number] = [
    Math.round(estimatedValue - variation),
    Math.round(estimatedValue + variation)
  ];

  // Prepare the result object
  const result: ValuationResult = {
    basePrice,
    adjustments,
    estimatedValue,
    confidenceScore,
    confidenceLevel: getConfidenceLevel(confidenceScore),
    priceRange,
    carfaxData: input.carfaxData,
    auditTrail,
    photoScore: input.photoScore
  };
  
  // Add equipment info if present
  if (input.equipmentIds && input.equipmentIds.length > 0) {
    result.equipmentInfo = {
      ids: input.equipmentIds,
      multiplier: input.equipmentMultiplier || 1,
      valueAdd: input.equipmentValueAdd || 0
    };
  }

  // Add color info if present
  if (input.exteriorColor && input.colorMultiplier) {
    result.colorInfo = {
      color: input.exteriorColor,
      multiplier: input.colorMultiplier
    };
  }
  
  // Add fuel type info if present
  if (input.fuelType && input.fuelTypeMultiplier) {
    result.fuelTypeInfo = {
      type: input.fuelType,
      multiplier: input.fuelTypeMultiplier
    };
  }
  
  // Add transmission info if present
  if (input.transmissionType && input.transmissionMultiplier) {
    result.transmissionInfo = {
      type: input.transmissionType,
      multiplier: input.transmissionMultiplier
    };
  }

  return result;
}
