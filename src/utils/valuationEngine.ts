import { calculateConfidenceScore, getConfidenceLevel } from './confidenceCalculator';
import rulesEngine, { AdjustmentBreakdown } from './rulesEngine';
import { ValuationAuditTrail } from './rules/RulesEngine';
import type { VehicleCondition } from './adjustments/types';
import { CarfaxData } from './carfax/mockCarfaxService';
import { supabase } from '@/integrations/supabase/client';

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
  hasOpenRecall?: boolean;
  recallMultiplier?: number;
  warrantyStatus?: string;
  warrantyMultiplier?: number;
  marketFactor?: number;
  marketDemand?: string;
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
  recallInfo?: {
    hasOpenRecall: boolean;
    multiplier: number;
  };
  warrantyInfo?: {
    status: string;
    multiplier: number;
  };
  marketInfo?: {
    factor: number;
    demand: string;
    zipCode: string;
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
    transmissionMultiplier: input.transmissionMultiplier,
    hasOpenRecall: input.hasOpenRecall,
    warrantyStatus: input.warrantyStatus
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
  
  // Get recall multiplier if there's an open recall
  let recallMultiplier = 1.0;
  if (input.hasOpenRecall) {
    try {
      if (input.recallMultiplier) {
        recallMultiplier = input.recallMultiplier;
      } else {
        // Fetch recall multiplier from the database
        const { data: recallData } = await supabase
          .from('recall_factor')
          .select('multiplier')
          .eq('has_open_recall', true)
          .single();
          
        if (recallData && recallData.multiplier) {
          recallMultiplier = recallData.multiplier;
        } else {
          // Default if not found in the database
          recallMultiplier = 0.9; // 10% reduction
        }
      }
      // Apply recall multiplier
      estimatedValue = Math.round(estimatedValue * recallMultiplier);
    } catch (error) {
      console.error('Error fetching recall multiplier:', error);
      // Apply default multiplier if fetch fails
      estimatedValue = Math.round(estimatedValue * 0.9);
    }
  }
  
  // Get warranty multiplier if warranty status is provided
  let warrantyMultiplier = 1.0;
  if (input.warrantyStatus && input.warrantyStatus !== 'None') {
    try {
      if (input.warrantyMultiplier) {
        warrantyMultiplier = input.warrantyMultiplier;
      } else {
        // Fetch warranty multiplier from the database
        const { data: warrantyData } = await supabase
          .from('warranty_options')
          .select('multiplier')
          .eq('status', input.warrantyStatus)
          .single();
          
        if (warrantyData && warrantyData.multiplier) {
          warrantyMultiplier = warrantyData.multiplier;
        } else {
          // Default based on warranty type
          warrantyMultiplier = input.warrantyStatus === 'Factory' ? 1.02 : 1.04;
        }
      }
      // Apply warranty multiplier
      estimatedValue = Math.round(estimatedValue * warrantyMultiplier);
    } catch (error) {
      console.error('Error fetching warranty multiplier:', error);
      // Apply default multiplier if fetch fails
      const defaultMultiplier = input.warrantyStatus === 'Factory' ? 1.02 : 1.04;
      estimatedValue = Math.round(estimatedValue * defaultMultiplier);
    }
  }

  // Apply market factor if present
  let marketMultiplier = 1.0;
  if (input.marketFactor && input.marketFactor !== 1) {
    marketMultiplier = input.marketFactor;
    estimatedValue = Math.round(estimatedValue * marketMultiplier);
  } else if (input.zip) {
    // If no explicit market factor but we have a ZIP code, calculate one
    const zipSum = input.zip.split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
    
    // Simple algorithm to determine market factor based on ZIP
    if (zipSum % 5 === 0) {
      marketMultiplier = 1.035; // High demand area (+3.5%)
    } else if (zipSum % 5 === 1) {
      marketMultiplier = 1.015; // Above average demand (+1.5%)
    } else if (zipSum % 5 === 3) {
      marketMultiplier = 0.985; // Below average demand (-1.5%)
    } else if (zipSum % 5 === 4) {
      marketMultiplier = 0.975; // Low demand area (-2.5%)
    }
    
    if (marketMultiplier !== 1.0) {
      estimatedValue = Math.round(estimatedValue * marketMultiplier);
    }
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
      transmissionMultiplier: input.transmissionMultiplier,
      hasOpenRecall: input.hasOpenRecall,
      recallMultiplier: recallMultiplier,
      warrantyStatus: input.warrantyStatus,
      warrantyMultiplier: warrantyMultiplier
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
    hasTransmission: input.transmissionType !== undefined,
    hasOpenRecall: input.hasOpenRecall
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
  
  // Add recall info if present
  if (input.hasOpenRecall !== undefined) {
    result.recallInfo = {
      hasOpenRecall: input.hasOpenRecall,
      multiplier: recallMultiplier
    };
  }
  
  // Add warranty info if present
  if (input.warrantyStatus !== undefined) {
    result.warrantyInfo = {
      status: input.warrantyStatus,
      multiplier: warrantyMultiplier
    };
  }

  // Add market info if available
  if (input.zip && marketMultiplier !== 1.0) {
    let demandLevel = "Average";
    
    if (marketMultiplier >= 1.03) {
      demandLevel = "High";
    } else if (marketMultiplier >= 1.01) {
      demandLevel = "Above Average";
    } else if (marketMultiplier <= 0.97) {
      demandLevel = "Low";
    } else if (marketMultiplier <= 0.99) {
      demandLevel = "Below Average";
    }
    
    result.marketInfo = {
      factor: marketMultiplier,
      demand: input.marketDemand || demandLevel,
      zipCode: input.zip
    };
  }

  return result;
}
