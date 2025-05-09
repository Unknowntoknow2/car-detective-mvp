
// src/utils/valuationEngine.ts

import {
  mileageAdjustmentCurve
} from './adjustments/mileageAdjustments';
import {
  getConditionMultiplier
} from './adjustments/conditionAdjustments';
import {
  getRegionalMarketMultiplier
} from './adjustments/locationAdjustments';
import {
  getFeatureAdjustments
} from './adjustments/featureAdjustments';
import type { AICondition } from '@/types/photo';
import type {
  ValuationInput as EnterpriseValuationInput,
  FinalValuationResult as EnterpriseValuationOutput
} from './calculateFinalValuation';

export interface ValuationParams {
  baseMarketValue: number;
  vehicleYear?: number;
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
  condition?: string; // Changed from 'Excellent' | 'Good' | 'Fair' | 'Poor' to allow any string
  zipCode?: string;
  features?: string[];
  trim?: string;
  photoScore?: number;
  aiConditionOverride?: AICondition;
}

export interface ValuationResult {
  finalValue: number;
  adjustments: {
    name: string;
    description: string;
    impact: number;
    percentage: number;
    factor: string;
    value: number;
    percentAdjustment: number;
    adjustment?: number;
    impactPercentage?: number;
  }[];
  confidenceScore: number;
  baseValue: number;
  estimatedValue: number;
  priceRange: [number, number];
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
    const mileageImpact = baseValue * mileageAdjustmentCurve(params.mileage);
    adjustments.push({
      name: 'Mileage',
      description: getMileageAdjustmentDescription(params.mileage),
      impact: mileageImpact,
      percentage: (mileageImpact / baseValue) * 100,
      factor: 'Mileage',
      value: mileageImpact,
      percentAdjustment: (mileageImpact / baseValue) * 100
    });
    totalAdjustment += mileageImpact;
    confidenceScore += 3;
  }

  if (params.condition) {
    const multiplier = getConditionMultiplier(params.condition);
    const impact = baseValue * multiplier;
    adjustments.push({
      name: 'Condition',
      description: `Vehicle in ${params.condition} condition`,
      impact,
      percentage: multiplier * 100,
      factor: 'Condition',
      value: impact,
      percentAdjustment: multiplier * 100
    });
    totalAdjustment += impact;
    confidenceScore += 2;
  }

  if (params.zipCode) {
    const multiplier = getRegionalMarketMultiplier(params.zipCode);
    const impact = baseValue * multiplier;
    adjustments.push({
      name: 'Regional Market',
      description: getRegionalMarketDescription(params.zipCode, multiplier),
      impact,
      percentage: multiplier * 100,
      factor: 'Regional Market',
      value: impact,
      percentAdjustment: multiplier * 100
    });
    totalAdjustment += impact;
    confidenceScore += 3;
  }

  if (params.features && params.features.length > 0) {
    // Fix: Handle getFeatureAdjustments properly, only passing features and baseValue
    const featureImpact = getFeatureAdjustments(params.features, baseValue);
    
    // Handle different return types of getFeatureAdjustments
    let featureAdjustmentValue = 0;
    if (typeof featureImpact === 'number') {
      featureAdjustmentValue = featureImpact;
    } else if (featureImpact && typeof featureImpact === 'object' && 'totalAdjustment' in featureImpact) {
      featureAdjustmentValue = featureImpact.totalAdjustment;
    }
    
    adjustments.push({
      name: 'Premium Features',
      description: `${params.features.length} premium features including ${params.features.slice(0, 2).join(', ')}${params.features.length > 2 ? '...' : ''}`,
      impact: featureAdjustmentValue,
      percentage: (featureAdjustmentValue / baseValue) * 100,
      factor: 'Premium Features',
      value: featureAdjustmentValue,
      percentAdjustment: (featureAdjustmentValue / baseValue) * 100
    });
    totalAdjustment += featureAdjustmentValue;
    confidenceScore += 2;
  }

  if (params.make && params.model && (params.year || params.vehicleYear)) {
    const year = params.year || params.vehicleYear || 0;
    const trendImpact = calculateMakeModelTrend(params.make, params.model, year, baseValue);
    if (trendImpact !== 0) {
      adjustments.push({
        name: 'Market Trends',
        description: `Current market trends for ${year} ${params.make} ${params.model}`,
        impact: trendImpact,
        percentage: (trendImpact / baseValue) * 100,
        factor: 'Market Trends',
        value: trendImpact,
        percentAdjustment: (trendImpact / baseValue) * 100
      });
      totalAdjustment += trendImpact;
      confidenceScore += 2;
    }
  }

  const finalValue = Math.round(baseValue + totalAdjustment);
  confidenceScore = Math.max(75, Math.min(98, confidenceScore));

  const estimatedValue = finalValue;
  const margin = ((100 - confidenceScore) / 100) * 0.15 * estimatedValue;
  const priceRange: [number, number] = [
    Math.floor(estimatedValue - margin),
    Math.ceil(estimatedValue + margin)
  ];

  return {
    finalValue,
    adjustments,
    confidenceScore,
    baseValue,
    estimatedValue,
    priceRange
  };
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
  const age = currentYear - year;
  const luxury = ['BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Porsche'];
  const electric = ['Model 3', 'Model Y', 'Leaf', 'Bolt', 'ID.4', 'Ioniq'];
  const classics = ['Mustang', 'Corvette', 'Bronco', 'Defender', 'Wrangler'];

  let multiplier = 0;
  if (luxury.includes(make) && age < 5) multiplier -= 0.02;
  if (electric.includes(model) || make === 'Tesla') multiplier += 0.04;
  if (classics.includes(model)) multiplier += 0.02;
  if (['Toyota', 'Honda', 'Lexus'].includes(make)) multiplier += 0.015;

  return baseValue * multiplier;
}

export { calculateFinalValuation as enterpriseCalculateFinalValuation };
export type { EnterpriseValuationInput, EnterpriseValuationOutput };

export const calculateValuation = calculateFinalValuation;
export const getBaseValue = (params: any) => params.baseMarketValue || 0;
