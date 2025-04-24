
/**
 * Types for price adjustment calculations
 */
export type VehicleCondition = 'excellent' | 'good' | 'fair' | 'poor';

interface ZipTier {
  zips: string[];
  adjustment: number;
}

// New feature adjustment types
export interface VehicleFeature {
  name: string;
  value: number;
  description: string;
}

export interface TrimAdjustment {
  trim: string;
  value: number;
}

/**
 * Calculates price adjustment based on vehicle mileage
 * @param mileage - Vehicle mileage in miles
 * @param basePrice - Base price of the vehicle
 * @returns Adjustment amount (positive or negative)
 */
export function getMileageAdjustment(mileage: number, basePrice: number): number {
  if (mileage < 30000) {
    return basePrice * 0.025; // +2.5% for low mileage
  } else if (mileage <= 60000) {
    return 0; // No adjustment for average mileage
  } else if (mileage <= 100000) {
    return basePrice * -0.05; // -5% for high mileage
  } else if (mileage <= 150000) {
    return basePrice * -0.10; // -10% for very high mileage
  } else {
    return basePrice * -0.15; // -15% for excessive mileage
  }
}

/**
 * Calculates price adjustment based on vehicle condition
 * @param condition - Vehicle condition rating
 * @param basePrice - Base price of the vehicle
 * @returns Adjustment amount (positive or negative)
 */
export function getConditionAdjustment(condition: VehicleCondition, basePrice: number): number {
  const adjustments: Record<VehicleCondition, number> = {
    excellent: 0.05,  // +5% for excellent condition
    good: 0,         // No adjustment for good condition
    fair: -0.075,    // -7.5% for fair condition
    poor: -0.15      // -15% for poor condition
  };

  return basePrice * (adjustments[condition] || 0);
}

/**
 * Determines ZIP code-based price adjustment
 * @param zip - Vehicle location ZIP code
 * @param basePrice - Base price of the vehicle
 * @returns Adjustment amount (positive or negative)
 */
export function getZipAdjustment(zip: string, basePrice: number): number {
  const zipTiers: ZipTier[] = [
    {
      zips: ['90210', '10001', '60611', '94102', '98101'],
      adjustment: 0.03 // +3% for high-demand areas
    },
    {
      zips: ['78572', '30401', '63115', '35203', '59101'],
      adjustment: -0.02 // -2% for low-demand areas
    }
  ];

  const tier = zipTiers.find(t => t.zips.includes(zip));
  return tier ? basePrice * tier.adjustment : 0;
}

/**
 * Calculate adjustment based on vehicle trim level
 * @param make - Vehicle make
 * @param model - Vehicle model
 * @param trim - Vehicle trim level
 * @param basePrice - Base price of the vehicle
 * @returns Adjustment amount (positive or negative)
 */
export function getTrimAdjustment(make: string, model: string, trim: string, basePrice: number): number {
  // Sample data for trim adjustments
  const trimData: Record<string, Record<string, TrimAdjustment[]>> = {
    'Toyota': {
      'Camry': [
        { trim: 'LE', value: -0.05 },
        { trim: 'SE', value: 0 },
        { trim: 'XLE', value: 0.07 },
        { trim: 'XSE', value: 0.10 }
      ],
      'RAV4': [
        { trim: 'LE', value: -0.05 },
        { trim: 'XLE', value: 0 },
        { trim: 'Adventure', value: 0.07 },
        { trim: 'Limited', value: 0.10 },
        { trim: 'TRD Off-Road', value: 0.15 }
      ]
    },
    'Honda': {
      'Civic': [
        { trim: 'LX', value: -0.03 },
        { trim: 'Sport', value: 0 },
        { trim: 'EX', value: 0.05 },
        { trim: 'Touring', value: 0.10 }
      ]
    }
  };

  // Find the relevant trim adjustment
  const modelTrimData = trimData[make]?.[model];
  if (!modelTrimData) return 0;
  
  const trimAdjustment = modelTrimData.find(t => t.trim.toLowerCase() === trim.toLowerCase());
  return trimAdjustment ? basePrice * trimAdjustment.value : 0;
}

/**
 * Calculate adjustment based on accident history
 * @param accidentCount - Number of reported accidents
 * @param basePrice - Base price of the vehicle
 * @returns Adjustment amount (negative)
 */
export function getAccidentHistoryAdjustment(accidentCount: number, basePrice: number): number {
  if (accidentCount === 0) return 0;
  
  // Progressive negative adjustment based on number of accidents
  if (accidentCount === 1) {
    return basePrice * -0.05; // -5% for one accident
  } else if (accidentCount === 2) {
    return basePrice * -0.12; // -12% for two accidents
  } else {
    // More than 2 accidents is a significant concern
    return basePrice * -0.20; // -20% for 3+ accidents
  }
}

/**
 * Calculate adjustment based on premium features
 * @param features - Array of premium feature names
 * @param basePrice - Base price of the vehicle
 * @returns Adjustment amount (positive)
 */
export function getPremiumFeaturesAdjustment(features: string[], basePrice: number): number {
  // Sample data for premium features
  const premiumFeatures: VehicleFeature[] = [
    { name: 'leather seats', value: 0.02, description: 'Leather upholstery' },
    { name: 'sunroof', value: 0.015, description: 'Sunroof or moonroof' },
    { name: 'navigation', value: 0.01, description: 'Built-in navigation system' },
    { name: 'premium audio', value: 0.02, description: 'Premium audio system' },
    { name: 'adaptive cruise', value: 0.02, description: 'Adaptive cruise control' },
    { name: 'blind spot', value: 0.01, description: 'Blind spot monitoring' },
    { name: 'heated seats', value: 0.01, description: 'Heated seats' },
    { name: '360 camera', value: 0.02, description: '360-degree camera system' }
  ];

  let totalAdjustment = 0;
  
  // Calculate cumulative value of all premium features
  features.forEach(feature => {
    const featureData = premiumFeatures.find(f => 
      f.name.toLowerCase() === feature.toLowerCase()
    );
    
    if (featureData) {
      totalAdjustment += basePrice * featureData.value;
    }
  });
  
  // Cap total premium feature adjustment at 15% of base price
  return Math.min(totalAdjustment, basePrice * 0.15);
}

/**
 * Calculates total price adjustment based on all factors
 * @param params - Vehicle parameters for adjustment calculation
 * @returns Total adjustment amount
 */
export function calculateTotalAdjustment(params: {
  mileage: number;
  condition: VehicleCondition;
  zipCode?: string;
  basePrice: number;
  trim?: string;
  accidentCount?: number;
  premiumFeatures?: string[];
  make?: string;
  model?: string;
}): number {
  const mileageAdj = getMileageAdjustment(params.mileage, params.basePrice);
  const conditionAdj = getConditionAdjustment(params.condition, params.basePrice);
  const zipAdj = params.zipCode ? getZipAdjustment(params.zipCode, params.basePrice) : 0;
  
  // Advanced feature-based adjustments
  let trimAdj = 0;
  let accidentAdj = 0;
  let featuresAdj = 0;
  
  // Apply trim adjustment if make, model, and trim are provided
  if (params.trim && params.make && params.model) {
    trimAdj = getTrimAdjustment(params.make, params.model, params.trim, params.basePrice);
  }
  
  // Apply accident history adjustment if provided
  if (typeof params.accidentCount === 'number') {
    accidentAdj = getAccidentHistoryAdjustment(params.accidentCount, params.basePrice);
  }
  
  // Apply premium features adjustment if provided
  if (params.premiumFeatures && params.premiumFeatures.length > 0) {
    featuresAdj = getPremiumFeaturesAdjustment(params.premiumFeatures, params.basePrice);
  }

  return mileageAdj + conditionAdj + zipAdj + trimAdj + accidentAdj + featuresAdj;
}

/**
 * Get detailed breakdown of all adjustments
 * @param params - Vehicle parameters for adjustment calculation
 * @returns Array of labeled adjustments with values
 */
export function getAdjustmentBreakdown(params: {
  mileage: number;
  condition: VehicleCondition;
  zipCode?: string;
  basePrice: number;
  trim?: string;
  accidentCount?: number;
  premiumFeatures?: string[];
  make?: string;
  model?: string;
}): { label: string; value: number; description?: string }[] {
  const breakdown = [];
  
  // Calculate each adjustment
  const mileageAdj = getMileageAdjustment(params.mileage, params.basePrice);
  breakdown.push({
    label: 'Mileage Impact',
    value: Math.round(mileageAdj),
    description: getMileageDescription(params.mileage)
  });
  
  const conditionAdj = getConditionAdjustment(params.condition, params.basePrice);
  breakdown.push({
    label: 'Condition Impact',
    value: Math.round(conditionAdj),
    description: `Vehicle in ${params.condition} condition`
  });
  
  if (params.zipCode) {
    const zipAdj = getZipAdjustment(params.zipCode, params.basePrice);
    breakdown.push({
      label: 'Location Impact',
      value: Math.round(zipAdj),
      description: `Based on market demand in ${params.zipCode}`
    });
  }
  
  // Advanced feature-based adjustments
  if (params.trim && params.make && params.model) {
    const trimAdj = getTrimAdjustment(params.make, params.model, params.trim, params.basePrice);
    if (trimAdj !== 0) {
      breakdown.push({
        label: 'Trim Level',
        value: Math.round(trimAdj),
        description: `${params.make} ${params.model} ${params.trim} trim package`
      });
    }
  }
  
  if (typeof params.accidentCount === 'number' && params.accidentCount > 0) {
    const accidentAdj = getAccidentHistoryAdjustment(params.accidentCount, params.basePrice);
    breakdown.push({
      label: 'Accident History',
      value: Math.round(accidentAdj),
      description: `Vehicle has ${params.accidentCount} reported accident${params.accidentCount > 1 ? 's' : ''}`
    });
  }
  
  if (params.premiumFeatures && params.premiumFeatures.length > 0) {
    const featuresAdj = getPremiumFeaturesAdjustment(params.premiumFeatures, params.basePrice);
    if (featuresAdj > 0) {
      breakdown.push({
        label: 'Premium Features',
        value: Math.round(featuresAdj),
        description: `Vehicle has ${params.premiumFeatures.length} premium features`
      });
    }
  }
  
  return breakdown;
}

/**
 * Helper function to get a description of mileage impact
 */
function getMileageDescription(mileage: number): string {
  if (mileage < 30000) {
    return "Vehicle has low mileage (below 30,000 miles)";
  } else if (mileage <= 60000) {
    return "Vehicle has average mileage";
  } else if (mileage <= 100000) {
    return "Vehicle has high mileage (above 60,000 miles)";
  } else if (mileage <= 150000) {
    return "Vehicle has very high mileage (above 100,000 miles)";
  } else {
    return "Vehicle has excessive mileage (above 150,000 miles)";
  }
}
