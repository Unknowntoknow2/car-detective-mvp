import { mileageAdjustmentCurve } from './adjustments/mileageAdjustments';
import { getConditionMultiplier } from './adjustments/conditionAdjustments';
import { getRegionalMarketMultiplier } from './adjustments/locationAdjustments';
import { getFeatureAdjustments } from './adjustments/featureAdjustments';

export interface ValuationParams {
  baseMarketValue: number;
  vehicleYear?: number;
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
  condition?: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  zipCode?: string;
  features?: string[];
}

export interface ValuationResult {
  finalValue: number;
  adjustments: {
    name: string;
    description: string;
    impact: number;
    percentage: number;
  }[];
  confidenceScore: number;
  baseValue: number;
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
    });
    totalAdjustment += regionalImpact;
    confidenceScore += 3;
  }

  if (params.features && params.features.length > 0) {
    const featureAdjustments = getFeatureAdjustments(params.features, baseValue);
    adjustments.push({
      name: 'Premium Features',
      description: `${params.features.length} premium features including ${params.features.slice(0, 2).join(', ')}${params.features.length > 2 ? '...' : ''}`,
      impact: featureAdjustments,
      percentage: (featureAdjustments / baseValue) * 100,
    });
    totalAdjustment += featureAdjustments;
    confidenceScore += 2;
  }

  if (params.make && params.model && params.vehicleYear) {
    const marketTrendImpact = calculateMakeModelTrend(params.make, params.model, params.vehicleYear, baseValue);
    if (marketTrendImpact !== 0) {
      adjustments.push({
        name: 'Market Trends',
        description: `Current market trends for ${params.vehicleYear} ${params.make} ${params.model}`,
        impact: marketTrendImpact,
        percentage: (marketTrendImpact / baseValue) * 100,
      });
      totalAdjustment += marketTrendImpact;
      confidenceScore += 2;
    }
  }

  const finalValue = Math.round(baseValue + totalAdjustment);
  confidenceScore = Math.min(98, confidenceScore);
  confidenceScore = Math.max(75, confidenceScore);

  return {
    finalValue,
    adjustments,
    confidenceScore,
    baseValue,
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

import {
  calculateFinalValuation as enterpriseCalculateFinalValuation,
} from './valuation/calculateFinalValuation';
import type {
  ValuationInput as EnterpriseValuationInput,
  FinalValuationResult as EnterpriseValuationOutput
} from './valuation/calculateFinalValuation';

export { enterpriseCalculateFinalValuation };
export type { EnterpriseValuationInput, EnterpriseValuationOutput };
