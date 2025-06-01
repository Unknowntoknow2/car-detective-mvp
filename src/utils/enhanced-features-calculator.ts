
import { ENHANCED_FEATURES, MAX_FEATURE_ADJUSTMENT, type EnhancedFeature } from '@/data/enhanced-features-database';

export interface FeatureCalculationResult {
  totalAdjustment: number;
  percentageAdjustment: number;
  fixedAdjustment: number;
  cappedAdjustment: number;
  featureBreakdown: {
    id: string;
    name: string;
    percentValue: number;
    fixedValue: number;
    calculatedValue: number;
    impact: string;
    rarity: string;
  }[];
}

/**
 * Calculate the total value adjustment from selected features
 * Uses both percentage and fixed value adjustments with maximum caps
 */
export function calculateEnhancedFeatureValue(
  selectedFeatureIds: string[],
  baseValue: number
): FeatureCalculationResult {
  if (!selectedFeatureIds || selectedFeatureIds.length === 0 || !baseValue) {
    return {
      totalAdjustment: 0,
      percentageAdjustment: 0,
      fixedAdjustment: 0,
      cappedAdjustment: 0,
      featureBreakdown: []
    };
  }

  let totalPercentAdjustment = 0;
  let totalFixedAdjustment = 0;
  const featureBreakdown: FeatureCalculationResult['featureBreakdown'] = [];

  // Calculate adjustments for each selected feature
  selectedFeatureIds.forEach(featureId => {
    const feature = ENHANCED_FEATURES.find(f => f.id === featureId);
    if (feature) {
      const percentValue = baseValue * feature.percentValue;
      const calculatedValue = percentValue + feature.fixedValue;
      
      totalPercentAdjustment += feature.percentValue;
      totalFixedAdjustment += feature.fixedValue;
      
      featureBreakdown.push({
        id: feature.id,
        name: feature.name,
        percentValue: feature.percentValue,
        fixedValue: feature.fixedValue,
        calculatedValue,
        impact: feature.impact,
        rarity: feature.rarity
      });
    }
  });

  // Apply maximum adjustment cap
  const cappedPercentAdjustment = Math.min(totalPercentAdjustment, MAX_FEATURE_ADJUSTMENT);
  const percentageAdjustmentValue = baseValue * cappedPercentAdjustment;
  const cappedTotalAdjustment = percentageAdjustmentValue + totalFixedAdjustment;

  return {
    totalAdjustment: cappedTotalAdjustment,
    percentageAdjustment: percentageAdjustmentValue,
    fixedAdjustment: totalFixedAdjustment,
    cappedAdjustment: cappedTotalAdjustment,
    featureBreakdown
  };
}

/**
 * Get feature information by ID
 */
export function getFeatureById(featureId: string): EnhancedFeature | undefined {
  return ENHANCED_FEATURES.find(f => f.id === featureId);
}

/**
 * Get features by category
 */
export function getFeaturesByCategory(categoryId: string): EnhancedFeature[] {
  return ENHANCED_FEATURES.filter(f => f.category === categoryId);
}

/**
 * Calculate impact level for display purposes
 */
export function getImpactColor(impact: string): string {
  switch (impact) {
    case 'high':
      return 'text-green-600 bg-green-50';
    case 'medium':
      return 'text-blue-600 bg-blue-50';
    case 'low':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

/**
 * Calculate rarity badge styling
 */
export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'luxury':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'premium':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'common':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}
