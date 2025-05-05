/**
 * Vehicle Valuation Calculator
 * Enterprise-grade implementation for calculating precise vehicle valuations
 * based on multiple factors including market value, mileage, condition, location,
 * and premium features.
 */

import { mileageAdjustmentCurve } from './adjustments/mileageAdjustments';
import { getConditionMultiplier } from './adjustments/conditionAdjustments';
import { getRegionalMarketMultiplier } from './adjustments/locationAdjustments';
import { getFeatureAdjustments } from './adjustments/featureAdjustments';

export interface ValuationParams {
  // Required parameters
  baseMarketValue: number;
  
  // Vehicle details
  vehicleYear?: number;
  year?: number; // Alternative name for vehicleYear for compatibility
  make?: string;
  model?: string;
  mileage?: number;
  condition?: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  
  // Location details
  zipCode?: string;
  
  // Additional features
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

/**
 * Calculates the final valuation of a vehicle based on multiple factors
 * @param params The valuation parameters
 * @returns The final valuation result with breakdown of adjustments
 */
export function calculateFinalValuation(params: ValuationParams): ValuationResult {
  // Validate required inputs
  if (params.baseMarketValue === undefined || params.baseMarketValue <= 0) {
    throw new Error('Base market value is required and must be greater than zero');
  }

  const baseValue = params.baseMarketValue;
  const adjustments: ValuationResult['adjustments'] = [];
  let confidenceScore = 85; // Default confidence score
  
  // Track total adjustments
  let totalAdjustment = 0;

  // 1. Apply mileage adjustment
  if (params.mileage !== undefined && params.mileage >= 0) {
    const mileageImpact = calculateMileageImpact(params.mileage, baseValue);
    
    adjustments.push({
      name: 'Mileage',
      description: getMileageAdjustmentDescription(params.mileage),
      impact: mileageImpact,
      percentage: (mileageImpact / baseValue) * 100
    });
    
    totalAdjustment += mileageImpact;
    confidenceScore += 3; // Increase confidence with mileage data
  }

  // 2. Apply condition adjustment
  if (params.condition) {
    const conditionMultiplier = getConditionMultiplier(params.condition);
    const conditionImpact = baseValue * conditionMultiplier;
    
    adjustments.push({
      name: 'Condition',
      description: `Vehicle in ${params.condition} condition`,
      impact: conditionImpact,
      percentage: conditionMultiplier * 100
    });
    
    totalAdjustment += conditionImpact;
    confidenceScore += 2; // Increase confidence with condition data
  }

  // 3. Apply regional market adjustment
  if (params.zipCode) {
    const regionalMultiplier = getRegionalMarketMultiplier(params.zipCode);
    const regionalImpact = baseValue * regionalMultiplier;
    
    adjustments.push({
      name: 'Regional Market',
      description: getRegionalMarketDescription(params.zipCode, regionalMultiplier),
      impact: regionalImpact,
      percentage: regionalMultiplier * 100
    });
    
    totalAdjustment += regionalImpact;
    confidenceScore += 3; // Increase confidence with location data
  }

  // 4. Apply premium features adjustments
  if (params.features && params.features.length > 0) {
    const featureAdjustments = getFeatureAdjustments(params.features, baseValue);
    
    adjustments.push({
      name: 'Premium Features',
      description: `${params.features.length} premium features including ${params.features.slice(0, 2).join(', ')}${params.features.length > 2 ? '...' : ''}`,
      impact: featureAdjustments,
      percentage: (featureAdjustments / baseValue) * 100
    });
    
    totalAdjustment += featureAdjustments;
    confidenceScore += 2; // Increase confidence with features data
  }

  // 5. Apply make/model specific adjustments if relevant
  if (params.make && params.model && params.vehicleYear) {
    const marketTrendImpact = calculateMakeModelTrend(params.make, params.model, params.vehicleYear, baseValue);
    
    if (marketTrendImpact !== 0) {
      adjustments.push({
        name: 'Market Trends',
        description: `Current market trends for ${params.year} ${params.make} ${params.model}`,
        impact: marketTrendImpact,
        percentage: (marketTrendImpact / baseValue) * 100
      });
      
      totalAdjustment += marketTrendImpact;
      confidenceScore += 2; // Increase confidence with make/model data
    }
  }

  // Calculate final value
  const finalValue = Math.round(baseValue + totalAdjustment);
  
  // Ensure confidence score stays within bounds
  confidenceScore = Math.min(98, confidenceScore);
  confidenceScore = Math.max(75, confidenceScore);

  return {
    finalValue,
    adjustments,
    confidenceScore,
    baseValue
  };
}

/**
 * Calculates the impact of mileage on vehicle value
 * @param mileage The vehicle mileage
 * @param baseValue The base market value
 * @returns The dollar impact of mileage on the vehicle value
 */
function calculateMileageImpact(mileage: number, baseValue: number): number {
  // Use the mileage adjustment curve to determine the multiplier
  const multiplier = mileageAdjustmentCurve(mileage);
  return baseValue * multiplier;
}

/**
 * Provides a description of the mileage adjustment
 * @param mileage The vehicle mileage
 * @returns A descriptive explanation of the mileage impact
 */
function getMileageAdjustmentDescription(mileage: number): string {
  if (mileage < 15000) {
    return 'Very low mileage, significantly above average value';
  } else if (mileage < 40000) {
    return 'Below average mileage, positively impacts value';
  } else if (mileage < 75000) {
    return 'Average mileage for vehicle age';
  } else if (mileage < 120000) {
    return 'Above average mileage, slightly reduces value';
  } else {
    return 'High mileage, significantly reduces value';
  }
}

/**
 * Provides a description of the regional market adjustment
 * @param zipCode The ZIP code
 * @param multiplier The calculated regional multiplier
 * @returns A descriptive explanation of the regional impact
 */
function getRegionalMarketDescription(zipCode: string, multiplier: number): string {
  if (multiplier > 0.03) {
    return `High demand in ${zipCode} region, significantly increases value`;
  } else if (multiplier > 0) {
    return `Slightly above average demand in ${zipCode} region`;
  } else if (multiplier > -0.03) {
    return `Slightly below average demand in ${zipCode} region`;
  } else {
    return `Lower demand in ${zipCode} region, decreases value`;
  }
}

/**
 * Calculates market trend adjustments specific to make and model
 * @param make The vehicle make
 * @param model The vehicle model
 * @param year The vehicle year
 * @param baseValue The base market value
 * @returns The dollar impact of make/model trends on vehicle value
 */
function calculateMakeModelTrend(make: string, model: string, year: number, baseValue: number): number {
  // This is a placeholder for make/model specific trend data
  // In a production environment, this would be populated from a database or API
  
  // Example implementation with mock data
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;
  
  // Special adjustments for certain vehicle types
  const luxuryBrands = ['BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Porsche'];
  const electricModels = ['Model 3', 'Model Y', 'Leaf', 'Bolt', 'ID.4', 'Ioniq'];
  const classicModels = ['Mustang', 'Corvette', 'Bronco', 'Defender', 'Wrangler'];
  
  let trendMultiplier = 0;
  
  // Luxury brands tend to depreciate faster in the first 5 years
  if (luxuryBrands.includes(make) && vehicleAge < 5) {
    trendMultiplier -= 0.02;
  }
  
  // Electric vehicles have strong demand currently
  if (electricModels.includes(model) || make === 'Tesla') {
    trendMultiplier += 0.04;
  }
  
  // Classic/iconic models may hold value better
  if (classicModels.includes(model)) {
    trendMultiplier += 0.02;
  }
  
  // Certain makes have better reliability reputation
  if (['Toyota', 'Honda', 'Lexus'].includes(make)) {
    trendMultiplier += 0.015;
  }
  
  return baseValue * trendMultiplier;
}

/**
 * Enterprise-level valuation system
 */
import { 
  calculateFinalValuation as enterpriseCalculateFinalValuation,
  ValuationInput as EnterpriseValuationInput,
  ValuationOutput as EnterpriseValuationOutput
} from './valuation/calculateFinalValuation';

export { 
  EnterpriseValuationInput, 
  EnterpriseValuationOutput,
  enterpriseCalculateFinalValuation 
};

/**
 * Example usage of the valuation calculator
 */
export function valuationExample(): void {
  const exampleParams: ValuationParams = {
    baseMarketValue: 25000,
    vehicleYear: 2019,
    make: 'Toyota',
    model: 'RAV4',
    mileage: 42000,
    condition: 'Good',
    zipCode: '90210',
    features: ['Leather Seats', 'Sunroof', 'Navigation System']
  };
  
  try {
    const result = calculateFinalValuation(exampleParams);
    console.log('Valuation Result:', result);
    console.log('Final Value:', new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.finalValue));
    console.log('Confidence Score:', result.confidenceScore);
    console.log('Adjustments:');
    result.adjustments.forEach(adj => {
      console.log(`- ${adj.name}: ${adj.impact >= 0 ? '+' : ''}${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(adj.impact)} (${adj.percentage.toFixed(2)}%)`);
      console.log(`  ${adj.description}`);
    });
  } catch (error) {
    console.error('Valuation Error:', error);
  }
}

/**
 * Example usage of the enterprise valuation calculator
 */
export function enterpriseValuationExample(): void {
  const exampleParams: EnterpriseValuationInput = {
    baseMarketValue: 25000,
    vehicleYear: 2019,
    make: 'Toyota',
    model: 'RAV4',
    mileage: 42000,
    condition: 'Good',
    zipCode: '90210',
    features: ['Leather Seats', 'Sunroof', 'Navigation System']
  };
  
  try {
    const result = enterpriseCalculateFinalValuation(exampleParams);
    console.log('Enterprise Valuation Result:', result);
    console.log('Final Value:', new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.finalValuation));
    console.log('Adjustments:');
    console.log(`- Mileage: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.adjustments.mileageAdjustment)}`);
    console.log(`- Condition: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.adjustments.conditionAdjustment)}`);
    console.log(`- Regional Market: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.adjustments.regionalAdjustment)}`);
    console.log('- Feature Adjustments:');
    
    Object.entries(result.adjustments.featureAdjustments).forEach(([feature, value]) => {
      console.log(`  * ${feature}: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}`);
    });
    
    console.log(`Total Adjustments: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.totalAdjustments)}`);
  } catch (error) {
    console.error('Enterprise Valuation Error:', error);
  }
}
