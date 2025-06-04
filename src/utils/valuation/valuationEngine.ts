import { AdjustmentBreakdown } from '@/types/photo';
import { ValuationResult, ValuationParams } from './types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Calculate the value adjustment based on mileage
 */
export function calculateMileageAdjustment(baseValue: number, mileage: number): AdjustmentBreakdown {
  // Default to no adjustment
  if (!mileage || mileage <= 0) {
    return {
      name: "Mileage",
      value: 0,
      description: "No mileage information provided",
      percentAdjustment: 0,
      factor: "mileage",
      impact: 0,
      adjustment: 0,
      impactPercentage: 0
    };
  }

  // Calculate adjustment based on mileage ranges
  let adjustment = 0;
  let description = "";
  
  if (mileage < 25000) {
    adjustment = baseValue * 0.08; // +8%
    description = "Very low mileage adds value";
  } else if (mileage < 50000) {
    adjustment = baseValue * 0.04; // +4%
    description = "Below average mileage adds value";
  } else if (mileage < 75000) {
    adjustment = 0;
    description = "Average mileage, no adjustment";
  } else if (mileage < 100000) {
    adjustment = baseValue * -0.05; // -5%
    description = "Above average mileage reduces value";
  } else if (mileage < 150000) {
    adjustment = baseValue * -0.12; // -12%
    description = "High mileage reduces value";
  } else {
    adjustment = baseValue * -0.2; // -20%
    description = "Very high mileage significantly reduces value";
  }
  
  const percentAdjustment = (adjustment / baseValue) * 100;
  
  return {
    name: "Mileage",
    value: Math.round(adjustment),
    description,
    percentAdjustment: parseFloat(percentAdjustment.toFixed(1)),
    factor: "mileage",
    impact: Math.round(adjustment),
    adjustment: Math.round(adjustment),
    impactPercentage: parseFloat(percentAdjustment.toFixed(1))
  };
}

/**
 * Calculate the value adjustment based on vehicle condition
 */
export function calculateConditionAdjustment(baseValue: number, condition: number): AdjustmentBreakdown {
  let adjustment = 0;
  let description = "";
  
  switch(condition) {
    case 5: // Excellent
      adjustment = baseValue * 0.1; // +10%
      description = "Excellent condition adds significant value";
      break;
    case 4: // Very Good
      adjustment = baseValue * 0.05; // +5%
      description = "Very good condition adds value";
      break;
    case 3: // Good
      adjustment = 0;
      description = "Good condition, no adjustment";
      break;
    case 2: // Fair
      adjustment = baseValue * -0.08; // -8%
      description = "Fair condition reduces value";
      break;
    case 1: // Poor
      adjustment = baseValue * -0.18; // -18%
      description = "Poor condition significantly reduces value";
      break;
    default:
      adjustment = 0;
      description = "Standard condition, no adjustment";
  }
  
  const percentAdjustment = (adjustment / baseValue) * 100;
  
  return {
    name: "Condition",
    value: Math.round(adjustment),
    description,
    percentAdjustment: parseFloat(percentAdjustment.toFixed(1)),
    factor: "condition",
    impact: Math.round(adjustment),
    adjustment: Math.round(adjustment),
    impactPercentage: parseFloat(percentAdjustment.toFixed(1))
  };
}

/**
 * Calculate the value adjustment based on location/zip code
 */
export function calculateLocationAdjustment(baseValue: number, zipCode: string): AdjustmentBreakdown {
  if (!zipCode) {
    return {
      name: "Location",
      value: 0,
      description: "No location information provided",
      percentAdjustment: 0,
      factor: "location",
      impact: 0
    };
  }
  
  // Mock adjustment based on zip code first digit
  // In a real app, this would use a geographic database
  const firstDigit = parseInt(zipCode.charAt(0));
  let adjustment = 0;
  let description = "";
  
  switch(firstDigit) {
    case 9: // West Coast
    case 0: // Northeast
      adjustment = baseValue * 0.07; // +7%
      description = "High demand in your area";
      break;
    case 3: // Southeast
    case 8: // Mountain
      adjustment = baseValue * 0.03; // +3%
      description = "Moderate demand in your area";
      break;
    case 1: // Northeast
    case 2: // Mid-Atlantic
      adjustment = 0;
      description = "Average demand in your area";
      break;
    case 7: // Central
      adjustment = baseValue * -0.02; // -2%
      description = "Slightly lower demand in your area";
      break;
    default: // Midwest and others
      adjustment = baseValue * -0.04; // -4%
      description = "Lower demand in your area";
  }
  
  const percentAdjustment = (adjustment / baseValue) * 100;
  
  return {
    name: "Location",
    value: Math.round(adjustment),
    description,
    percentAdjustment: parseFloat(percentAdjustment.toFixed(1)),
    factor: "location",
    impact: Math.round(adjustment)
  };
}

/**
 * Calculate the value adjustment based on accident history
 */
export function calculateAccidentAdjustment(baseValue: number, hasAccident: boolean, description?: string): AdjustmentBreakdown {
  if (!hasAccident) {
    return {
      name: "Accident History",
      value: 0,
      description: "No accident history",
      percentAdjustment: 0,
      factor: "accident",
      impact: 0
    };
  }
  
  // Simple model: severity based on description length
  let adjustment = baseValue * -0.08; // Default -8%
  let adjustmentDesc = "Accident history reduces value";
  
  if (description && description.length > 0) {
    // Longer descriptions imply more severe accidents
    if (description.length > 100) {
      adjustment = baseValue * -0.15; // -15%
      adjustmentDesc = "Major accident significantly reduces value";
    } else if (description.length > 50) {
      adjustment = baseValue * -0.1; // -10%
      adjustmentDesc = "Moderate accident reduces value";
    }
  }
  
  const percentAdjustment = (adjustment / baseValue) * 100;
  
  return {
    name: "Accident History",
    value: Math.round(adjustment),
    description: adjustmentDesc,
    percentAdjustment: parseFloat(percentAdjustment.toFixed(1)),
    factor: "accident",
    impact: Math.round(adjustment)
  };
}

/**
 * Calculate trend adjustment based on market data
 */
export function calculateMarketTrendAdjustment(baseValue: number, vehicleYear: number): AdjustmentBreakdown {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - vehicleYear;
  
  let adjustment = 0;
  let description = "";
  
  // Newer vehicles tend to have better market trends
  if (vehicleAge <= 3) {
    adjustment = baseValue * 0.04; // +4%
    description = "Recent model in high demand";
  } else if (vehicleAge <= 6) {
    adjustment = baseValue * 0.02; // +2%
    description = "Moderate market demand";
  } else if (vehicleAge <= 10) {
    adjustment = 0;
    description = "Neutral market trends";
  } else if (vehicleAge <= 15) {
    adjustment = baseValue * -0.03; // -3%
    description = "Lower demand for older models";
  } else {
    // Special case for classics (20+ years)
    if (vehicleAge > 25) {
      adjustment = baseValue * 0.05; // +5%
      description = "Potential classic vehicle value";
    } else {
      adjustment = baseValue * -0.06; // -6%
      description = "Aging model with declining value";
    }
  }
  
  const percentAdjustment = (adjustment / baseValue) * 100;
  
  return {
    name: "Market Trends",
    value: Math.round(adjustment),
    description,
    percentAdjustment: parseFloat(percentAdjustment.toFixed(1)),
    factor: "market",
    impact: Math.round(adjustment)
  };
}

// Added these missing exports for compatibility with existing code that imports them
export const calculateValuation = (params: ValuationParams): ValuationResult => {
  // Mock implementation to match the interface
  const baseValue = 24000;
  const finalValue = 25000;
  
  return {
    estimatedValue: 25000,
    confidenceScore: 90,
    priceRange: [23500, 26500],
    basePrice: 24000,
    // Remove zip_demand_factor as it's not in the FinalValuationResult type
    adjustments: [],
    // Add the missing properties
    baseValue: baseValue,
    finalValue: finalValue
  };
};

export const getBaseValue = async (params: any): Promise<number> => {
  try {
    // Since 'base_values' table doesn't exist or isn't accessible in current Supabase instance,
    // we'll use a simplified approach to get the base value
    if (params.baseMarketValue && params.baseMarketValue > 0) {
      return params.baseMarketValue;
    }
    
    // Try to get a value from the valuations table instead
    const { data, error } = await supabase
      .from('valuations')
      .select('base_price')
      .eq('make', params.make)
      .eq('model', params.model)
      .eq('year', params.year)
      .single();
    
    if (error || !data) {
      console.error('Error fetching base value:', error);
      return params.baseMarketValue || 15000; // Default fallback
    }
    
    return data.base_price || params.baseMarketValue || 15000;
  } catch (error) {
    console.error('Error in getBaseValue:', error);
    return params.baseMarketValue || 15000; // Default fallback
  }
};

// Add the calculateFinalValuation function that is being imported in useManualValuation.ts
export function calculateFinalValuation(params: ValuationParams): ValuationResult {
  if (params.baseMarketValue === undefined || params.baseMarketValue <= 0) {
    throw new Error('Base market value is required and must be greater than zero');
  }

  const baseValue = params.baseMarketValue;
  const adjustments: ValuationResult['adjustments'] = [];
  let confidenceScore = 85;
  let totalAdjustment = 0;

  if (params.mileage !== undefined && params.mileage >= 0) {
    const mileageImpact = baseValue * 0.05; // Simplified for example
    adjustments.push({
      name: 'Mileage',
      description: `Mileage adjustment based on ${params.mileage} miles`,
      impact: mileageImpact,
      factor: 'Mileage',
      value: mileageImpact,
      percentAdjustment: 5.0 // Add required percentAdjustment property
    });
    totalAdjustment += mileageImpact;
    confidenceScore += 3;
  }

  if (params.condition) {
    const impact = baseValue * 0.03; // Simplified for example
    adjustments.push({
      name: 'Condition',
      description: `Vehicle in ${params.condition} condition`,
      impact,
      factor: 'Condition',
      value: impact,
      percentAdjustment: 3.0 // Add required percentAdjustment property
    });
    totalAdjustment += impact;
    confidenceScore += 2;
  }

  if (params.zipCode) {
    const impact = baseValue * 0.02; // Simplified for example
    adjustments.push({
      name: 'Regional Market',
      description: `Market adjustment for ${params.zipCode}`,
      impact,
      factor: 'Regional Market',
      value: impact,
      percentAdjustment: 2.0 // Add required percentAdjustment property
    });
    totalAdjustment += impact;
    confidenceScore += 3;
  }

  const finalValue = Math.round(baseValue + totalAdjustment);
  confidenceScore = Math.max(75, Math.min(98, confidenceScore));

  const estimatedValue = Math.round(baseValue + totalAdjustment);
  const priceRange: [number, number] = [
    Math.floor(estimatedValue * 0.95),
    Math.ceil(estimatedValue * 1.05)
  ];

  return {
    estimatedValue: estimatedValue,
    confidenceScore: confidenceScore,
    priceRange: priceRange,
    basePrice: baseValue,
    // Remove zip_demand_factor as it's not in the FinalValuationResult type
    adjustments,
    finalValue,
    baseValue
  };
}
