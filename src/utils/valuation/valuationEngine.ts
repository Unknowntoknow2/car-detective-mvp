import { getMileageAdjustment } from '../adjustments/mileageAdjustments';
import { getConditionAdjustment } from '../adjustments/conditionAdjustments';
import { getZipAdjustment } from '../adjustments/locationAdjustments';
import { getTrimAdjustment } from '../adjustments/trimAdjustments';
import { getAccidentHistoryAdjustment } from '../adjustments/accidentAdjustments';
import { getFeatureAdjustments } from '../adjustments/featureAdjustments';
import { getTitleStatusAdjustment } from '../adjustments/titleStatusAdjustments';
import { AdjustmentBreakdown } from '../rules/types';
import { 
  getMpgAdjustment, 
  getLocationDensityAdjustment, 
  getIncomeAdjustment 
} from './specializedAdjustments';
import { supabase } from '@/lib/supabaseClient';
import { ValuationParams, ValuationResult } from './types';

/**
 * Calculate a complete valuation for a vehicle based on various parameters
 * @param params Vehicle parameters used for valuation
 * @returns Complete valuation result with adjustments and confidence score
 */
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
  
  // Add zip code adjustment if available - now using Supabase lookup
  if (params.zip) {
    try {
      // Fetch market multiplier from Supabase
      const { data, error } = await supabase
        .from('market_adjustments')
        .select('market_multiplier')
        .eq('zip_code', params.zip)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching market multiplier:', error);
      } else {
        const multiplier = data?.market_multiplier || 0;
        const zipAdj = basePrice * (multiplier / 100);
        
        adjustments.push({
          name: 'Location',
          value: Math.round(zipAdj),
          description: `Based on market demand in ${params.zip}`,
          percentAdjustment: multiplier
        });
        
        console.log(`Applied market multiplier for ${params.zip}: ${multiplier}%`);
      }
    } catch (error) {
      console.error('Exception fetching market multiplier:', error);
    }
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
    const featuresAdj = getFeatureAdjustments(params.premiumFeatures, basePrice);
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
