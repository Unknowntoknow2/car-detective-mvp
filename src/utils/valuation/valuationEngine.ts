
// src/utils/valuation/valuationEngine.ts

import { getFeatureAdjustments } from '../adjustments/featureAdjustments';
import { getConditionMultiplier } from '../adjustments/conditionAdjustments';
import { getRegionalMarketMultiplier } from '../adjustments/locationAdjustments';
import { mileageAdjustmentCurve } from '../adjustments/mileageAdjustments';
import type { AICondition } from '@/types/photo';
import type { AdjustmentBreakdown } from '@/types/photo';
import type { EnhancedValuationParams, FinalValuationResult } from './types';

// Use our own internal types without importing conflicting ones
// We'll make sure our return types match what's expected

export function calculateFinalValuation(params: EnhancedValuationParams): FinalValuationResult {
  if (!params.baseMarketValue) {
    throw new Error('Base market value is required');
  }

  const baseValue = params.baseMarketValue || 25000;
  const adjustments: AdjustmentBreakdown[] = [];
  let confidenceScore = 85;
  let totalAdjustment = 0;

  // Add mileage adjustment
  if (params.mileage !== undefined && params.mileage >= 0) {
    const mileageImpact = baseValue * mileageAdjustmentCurve(params.mileage);
    adjustments.push({
      name: 'Mileage',
      description: getMileageAdjustmentDescription(params.mileage),
      impact: mileageImpact,
      value: mileageImpact,
      percentAdjustment: (mileageImpact / baseValue) * 100,
      factor: 'Mileage'
    });
    totalAdjustment += mileageImpact;
    confidenceScore += 3;
  }

  // Add condition adjustment
  if (params.condition) {
    const multiplier = getConditionMultiplier(params.condition);
    const impact = baseValue * multiplier;
    adjustments.push({
      name: 'Condition',
      description: `Vehicle in ${params.condition} condition`,
      impact,
      value: impact,
      percentAdjustment: multiplier * 100,
      factor: 'Condition'
    });
    totalAdjustment += impact;
    confidenceScore += 2;
  }

  // Add regional market adjustment
  if (params.zipCode || params.zip) {
    const zipCode = params.zipCode || params.zip || '90210';
    const multiplier = getRegionalMarketMultiplier(zipCode);
    const impact = baseValue * multiplier;
    adjustments.push({
      name: 'Regional Market',
      description: getRegionalMarketDescription(zipCode, multiplier),
      impact,
      value: impact,
      percentAdjustment: multiplier * 100,
      factor: 'Regional Market'
    });
    totalAdjustment += impact;
    confidenceScore += 3;
  }

  // Add features adjustment
  if (params.features && params.features.length > 0) {
    // Fix: Pass only one argument to getFeatureAdjustments
    const featureResult = getFeatureAdjustments(params.features, baseValue);
    let featureImpact: number;
    
    if (typeof featureResult === 'number') {
      featureImpact = featureResult;
    } else if (featureResult && typeof featureResult === 'object' && 'totalAdjustment' in featureResult) {
      featureImpact = featureResult.totalAdjustment;
    } else {
      featureImpact = 0;
    }
    
    adjustments.push({
      name: 'Premium Features',
      description: `${params.features.length} premium features including ${params.features.slice(0, 2).join(', ')}${params.features.length > 2 ? '...' : ''}`,
      impact: featureImpact,
      value: featureImpact,
      percentAdjustment: (featureImpact / baseValue) * 100,
      factor: 'Premium Features'
    });
    totalAdjustment += featureImpact;
    confidenceScore += 2;
  }

  // Add make/model trend adjustment
  if (params.make && params.model && (params.year)) {
    const year = params.year;
    const trendImpact = calculateMakeModelTrend(params.make, params.model, year, baseValue);
    if (trendImpact !== 0) {
      adjustments.push({
        name: 'Market Trends',
        description: `Current market trends for ${year} ${params.make} ${params.model}`,
        impact: trendImpact,
        value: trendImpact,
        percentAdjustment: (trendImpact / baseValue) * 100,
        factor: 'Market Trends'
      });
      totalAdjustment += trendImpact;
      confidenceScore += 2;
    }
  }

  const finalValue = Math.round(baseValue + totalAdjustment);
  confidenceScore = Math.max(75, Math.min(98, confidenceScore));

  // Return with all required properties
  return {
    finalValue,
    baseValue,
    adjustments,
    confidenceScore,
    estimatedValue: finalValue,
    priceRange: [
      Math.floor(finalValue * 0.9),
      Math.ceil(finalValue * 1.1)
    ],
    basePrice: baseValue
  };
}

// Helper functions
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

// Export with consistent names
export { calculateFinalValuation as enterpriseCalculateFinalValuation };
export const calculateValuation = calculateFinalValuation;
export const getBaseValue = (params: any) => params.baseMarketValue || 0;
