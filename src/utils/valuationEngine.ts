import { getMileageAdjustment } from './adjustments/mileageAdjustments';
import { getConditionAdjustment } from './adjustments/conditionAdjustments';
import { getZipAdjustment } from './adjustments/locationAdjustments';
import { getTrimAdjustment } from './adjustments/trimAdjustments';
import { getAccidentHistoryAdjustment } from './adjustments/accidentAdjustments';
import { getPremiumFeaturesAdjustment } from './adjustments/featureAdjustments';
import { getTitleStatusAdjustment } from './adjustments/titleStatusAdjustments';
import { AdjustmentBreakdown } from './rules/types';

// New import for EPA MPG adjustment
export function getMpgAdjustment(mpg: number | null, basePrice: number): number {
  if (mpg === null) return 0;
  
  if (mpg >= 30) {
    return basePrice * 0.03; // +3% for high MPG
  } 
  else if (mpg < 20) {
    return basePrice * -0.03; // -3% for low MPG
  }
  
  return 0; // No adjustment for average MPG
}

// New import for location density adjustment based on OSM data
export function getLocationDensityAdjustment(osmData: any, basePrice: number): number {
  if (!osmData || !Array.isArray(osmData) || osmData.length === 0) {
    return 0;
  }
  
  const location = osmData[0];
  
  // Check if it's a high-density area based on the location type and class
  const isUrban = location.type === 'city' || 
                 location.type === 'town' || 
                 location.display_name.toLowerCase().includes('new york') ||
                 location.display_name.toLowerCase().includes('los angeles') ||
                 location.display_name.toLowerCase().includes('chicago') ||
                 location.display_name.toLowerCase().includes('san francisco');
  
  if (isUrban) {
    return basePrice * 0.04; // +4% for urban areas
  }
  
  const isSuburban = location.type === 'suburb' || 
                    location.type === 'residential' ||
                    location.display_name.toLowerCase().includes('county');
  
  if (isSuburban) {
    return basePrice * 0.02; // +2% for suburban areas
  }
  
  return 0; // No adjustment for rural areas
}

// New import for income-based adjustment from Census data
export function getIncomeAdjustment(censusData: any, basePrice: number): number {
  if (!censusData || !censusData.medianIncome) {
    return 0;
  }
  
  const medianIncome = censusData.medianIncome;
  
  if (medianIncome > 120000) {
    return basePrice * 0.03; // +3% for high-income areas
  }
  else if (medianIncome > 90000) {
    return basePrice * 0.02; // +2% for above-average income areas
  }
  else if (medianIncome < 50000) {
    return basePrice * -0.01; // -1% for below-average income areas
  }
  
  return 0; // No adjustment for average income areas
}

export interface ValuationParams {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zip?: string;
  trim?: string;
  accidentCount?: number;
  titleStatus?: string;
  premiumFeatures?: string[];
  mpg?: number | null;
  osmData?: any;
  censusData?: any;
}

export interface ValuationResult {
  estimatedValue: number;
  basePrice: number;
  adjustments: AdjustmentBreakdown[];
  priceRange: [number, number];
  confidenceScore: number;
}

export async function calculateValuation(params: ValuationParams): Promise<ValuationResult> {
  // This is a simplified implementation
  // In a real app, you would fetch base price from a database or API
  const basePrice = 20000; // Sample base price
  
  const adjustments: AdjustmentBreakdown[] = [];
  
  // Calculate core adjustments
  const mileageAdj = getMileageAdjustment(params.mileage, basePrice);
  adjustments.push({
    name: 'Mileage',
    value: Math.round(mileageAdj),
    description: `Based on ${params.mileage.toLocaleString()} miles`,
    percentAdjustment: (mileageAdj / basePrice) * 100
  });
  
  const conditionAdj = getConditionAdjustment(params.condition as any, basePrice);
  adjustments.push({
    name: 'Condition',
    value: Math.round(conditionAdj),
    description: `Vehicle in ${params.condition} condition`,
    percentAdjustment: (conditionAdj / basePrice) * 100
  });
  
  // Add zip code adjustment if available
  if (params.zip) {
    const zipAdj = getZipAdjustment(params.zip, basePrice);
    adjustments.push({
      name: 'Location',
      value: Math.round(zipAdj),
      description: `Based on market demand in ${params.zip}`,
      percentAdjustment: (zipAdj / basePrice) * 100
    });
  }
  
  // Add trim adjustment if available
  if (params.trim && params.make && params.model) {
    const trimAdj = getTrimAdjustment(params.make, params.model, params.trim, basePrice);
    adjustments.push({
      name: 'Trim Level',
      value: Math.round(trimAdj),
      description: `Adjustment for ${params.trim} trim`,
      percentAdjustment: (trimAdj / basePrice) * 100
    });
  }
  
  // Add accident history adjustment if available
  if (typeof params.accidentCount === 'number') {
    const accidentAdj = getAccidentHistoryAdjustment(params.accidentCount, basePrice);
    adjustments.push({
      name: 'Accident History',
      value: Math.round(accidentAdj),
      description: `Vehicle has ${params.accidentCount} reported accidents`,
      percentAdjustment: (accidentAdj / basePrice) * 100
    });
  }
  
  // Add premium features adjustment if available
  if (params.premiumFeatures && params.premiumFeatures.length > 0) {
    const featuresAdj = getPremiumFeaturesAdjustment(params.premiumFeatures, basePrice);
    adjustments.push({
      name: 'Premium Features',
      value: Math.round(featuresAdj),
      description: `Adjustment for ${params.premiumFeatures.length} premium features`,
      percentAdjustment: (featuresAdj / basePrice) * 100
    });
  }
  
  // Add title status adjustment if available
  if (params.titleStatus) {
    const titleStatusAdj = getTitleStatusAdjustment(params.titleStatus, basePrice);
    adjustments.push({
      name: 'Title Status',
      value: Math.round(titleStatusAdj),
      description: `Vehicle has ${params.titleStatus} title`,
      percentAdjustment: (titleStatusAdj / basePrice) * 100
    });
  }
  
  // Add new EPA MPG adjustment if available
  if (params.mpg !== undefined) {
    const mpgAdj = getMpgAdjustment(params.mpg, basePrice);
    if (mpgAdj !== 0) {
      adjustments.push({
        name: 'Fuel Economy',
        value: Math.round(mpgAdj),
        description: params.mpg ? `Vehicle has ${params.mpg} MPG` : 'MPG data unavailable',
        percentAdjustment: (mpgAdj / basePrice) * 100
      });
    }
  }
  
  // Add new location density adjustment if available
  if (params.osmData) {
    const densityAdj = getLocationDensityAdjustment(params.osmData, basePrice);
    if (densityAdj !== 0) {
      adjustments.push({
        name: 'Urban Density',
        value: Math.round(densityAdj),
        description: 'Adjustment based on neighborhood density',
        percentAdjustment: (densityAdj / basePrice) * 100
      });
    }
  }
  
  // Add new income-based adjustment if available
  if (params.censusData) {
    const incomeAdj = getIncomeAdjustment(params.censusData, basePrice);
    if (incomeAdj !== 0) {
      adjustments.push({
        name: 'Local Market',
        value: Math.round(incomeAdj),
        description: 'Adjustment based on local income levels',
        percentAdjustment: (incomeAdj / basePrice) * 100
      });
    }
  }
  
  // Calculate total adjustments
  const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.value, 0);
  
  // Calculate final estimated value
  const estimatedValue = Math.round(basePrice + totalAdjustment);
  
  // Calculate price range (±5%)
  const priceRange: [number, number] = [
    Math.round(estimatedValue * 0.95),
    Math.round(estimatedValue * 1.05)
  ];
  
  // Calculate confidence score
  // In a real app, this would use more sophisticated logic
  const confidenceScore = Math.min(95, 85 + adjustments.length * 2);
  
  return {
    estimatedValue,
    basePrice,
    adjustments,
    priceRange,
    confidenceScore
  };
}
