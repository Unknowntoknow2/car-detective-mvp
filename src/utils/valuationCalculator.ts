
import { mileageAdjustmentCurve } from './adjustments/mileageAdjustments';
import { getConditionMultiplier } from './adjustments/conditionAdjustments';
import { getRegionalMarketMultiplier } from './adjustments/locationAdjustments';
import { getFeatureAdjustments } from './adjustments/featureAdjustments';

export interface ValuationParams {
  baseMarketValue?: number;
  mileage?: number;
  condition?: string;
  zipCode: string;
  features?: string[];
  make?: string;
  model?: string;
  mileage?: number;
  condition?: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  zipCode?: string;
  features?: string[];
}

export interface ValuationResult {
  estimatedValue: number;
  confidenceScore: number;
  baseValue: number;
  estimatedValue?: number;
  priceRange?: [number, number];
}

export function calculateFinalValuation(params: ValuationParams): ValuationResult {
  if (params.baseMarketValue === undefined || params.baseMarketValue <= 0) {
    throw new Error('Base market value is required and must be greater than zero');
  }

  const baseValue = params.baseMarketValue;
  const adjustments: ValuationResult['adjustments'] = [];
  let confidenceScore = 85;
  let totalAdjustment = 0;

  if (params.mileage !== undefined && params.mileage >= 0) {
    const mileageImpact = calculateMileageImpact(params.mileage, baseValue);
    adjustments.push({
      name: 'Mileage',
      description: getMileageAdjustmentDescription(params.mileage),
      impact: mileageImpact,
      percentage: (mileageImpact / baseValue) * 100,
      factor: 'Mileage'
    });
    totalAdjustment += mileageImpact;
    confidenceScore += 3;
  }

  if (params.condition) {
    const conditionMultiplier = getConditionMultiplier(params.condition);
    const conditionImpact = baseValue * conditionMultiplier;
    adjustments.push({
      name: 'Condition',
      description: `Vehicle in ${params.condition} condition`,
      impact: conditionImpact,
      percentage: conditionMultiplier * 100,
      factor: 'Condition'
    });
    totalAdjustment += conditionImpact;
    confidenceScore += 2;
  }

  if (params.zipCode) {
    const regionalMultiplier = getRegionalMarketMultiplier(params.zipCode);
    const regionalImpact = baseValue * regionalMultiplier;
    adjustments.push({
      name: 'Regional Market',
      description: getRegionalMarketDescription(params.zipCode, regionalMultiplier),
      impact: regionalImpact,
      percentage: regionalMultiplier * 100,
      factor: 'Regional Market'
    });
    totalAdjustment += regionalImpact;
    confidenceScore += 3;
  }

  if (params.features && params.features.length > 0) {
    // Update: Pass proper object structure that matches what getFeatureAdjustments accepts
    const featureResult = getFeatureAdjustments({
      features: params.features,
      basePrice: baseValue
    });
    
    const featureImpact = featureResult.totalAdjustment;
    
    adjustments.push({
      name: 'Premium Features',
      description: `${params.features.length} premium features including ${params.features.slice(0, 2).join(', ')}${params.features.length > 2 ? '...' : ''}`,
      impact: featureImpact,
      percentage: (featureImpact / baseValue) * 100,
      factor: 'Premium Features'
    });
    totalAdjustment += featureImpact;
    confidenceScore += 2;
  }

  if (params.make && params.model && (params.vehicleYear || params.year)) {
    const year = params.year || params.vehicleYear || 0;
    const marketTrendImpact = calculateMakeModelTrend(params.make, params.model, year, baseValue);
    if (marketTrendImpact !== 0) {
      adjustments.push({
        name: 'Market Trends',
        description: `Current market trends for ${year} ${params.make} ${params.model}`,
        impact: marketTrendImpact,
        percentage: (marketTrendImpact / baseValue) * 100,
        factor: 'Market Trends'
      });
      totalAdjustment += marketTrendImpact;
      confidenceScore += 2;
    }
  }

  const finalValue = Math.round(baseValue + totalAdjustment);
  confidenceScore = Math.min(98, Math.max(75, confidenceScore));

  const estimatedValue = finalValue;
  const margin = ((100 - confidenceScore) / 100) * 0.15 * estimatedValue;
  const priceRange: [number, number] = [
    Math.floor(estimatedValue - margin),
    Math.ceil(estimatedValue + margin)
  ];
  
  return {
    estimatedValue,
    confidenceScore,
    priceRange,
    basePrice: baseValue,
    baseValue,
    estimatedValue,
    priceRange
  };
}

function calculateMileageImpact(mileage: number, baseValue: number): number {
  const multiplier = mileageAdjustmentCurve(mileage);
  return baseValue * multiplier;
}

function getMileageAdjustmentDescription(mileage: number): string {
  if (mileage < 15000) return 'Very low mileage, significantly above average value';
  if (mileage < 40000) return 'Below average mileage, positively impacts value';
  if (mileage < 75000) return 'Average mileage for vehicle age';
  if (mileage < 120000) return 'Above average mileage, slightly reduces value';
  return 'High mileage, significantly reduces value';
}

function getRegionalMarketDescription(zipCode: string, multiplier: number): string {
  if (multiplier > 0.03) return `High demand in ${zipCode} region, significantly increases value`;
  if (multiplier > 0) return `Slightly above average demand in ${zipCode} region`;
  if (multiplier > -0.03) return `Slightly below average demand in ${zipCode} region`;
  return `Lower demand in ${zipCode} region, decreases value`;
}

function calculateMakeModelTrend(make: string, model: string, year: number, baseValue: number): number {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;

  const luxuryBrands = ['BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Porsche'];
  const electricModels = ['Model 3', 'Model Y', 'Leaf', 'Bolt', 'ID.4', 'Ioniq'];
  const classicModels = ['Mustang', 'Corvette', 'Bronco', 'Defender', 'Wrangler'];

  let trendMultiplier = 0;
  if (luxuryBrands.includes(make) && vehicleAge < 5) trendMultiplier -= 0.02;
  if (electricModels.includes(model) || make === 'Tesla') trendMultiplier += 0.04;
  if (classicModels.includes(model)) trendMultiplier += 0.02;
  if (['Toyota', 'Honda', 'Lexus'].includes(make)) trendMultiplier += 0.015;

  return baseValue * trendMultiplier;
}

// --- Add compatibility exports ---
import {
  ValuationParams as EnterpriseValuationParams,
  ValuationResult as EnterpriseValuationResult,
} from './valuation/types';

export type ValuationInput = ValuationParams;
export type FinalValuationResult = ValuationResult;
export type EnterpriseValuationInput = EnterpriseValuationParams;
export type EnterpriseValuationOutput = EnterpriseValuationResult;

export { calculateFinalValuation as enterpriseCalculateFinalValuation };
