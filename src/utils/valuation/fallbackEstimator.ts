/**
 * Fallback estimator utility for valuation system
 * Provides robust depreciation-based algorithm when market listings are insufficient
 */

interface VehicleAttributes {
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage: number;
  condition: string;
  fuelType?: string;
  bodyType?: string;
  baseMsrp?: number;
}

export interface FallbackValuationResult {
  estimated_value: number;
  confidence_score: number;
  explanation: string;
  source: 'fallback_algorithm';
  value_breakdown: {
    base_value: number;
    depreciation: number;
    mileage: number;
    condition: number;
    fuel_type: number;
    regional: number;
  };
}

/**
 * Main fallback estimation function using depreciation-based algorithm
 */
export function estimateFallbackValue(vehicleAttributes: VehicleAttributes): FallbackValuationResult {
  console.log('🔄 Generating fallback valuation using depreciation algorithm for:', {
    year: vehicleAttributes.year,
    make: vehicleAttributes.make,
    model: vehicleAttributes.model,
    mileage: vehicleAttributes.mileage,
    condition: vehicleAttributes.condition
  });

  const currentYear = new Date().getFullYear();
  const vehicleAge = Math.max(0, currentYear - vehicleAttributes.year);
  
  // Step 1: Determine base value (MSRP or estimated)
  const baseValue = determineBaseValue(vehicleAttributes);
  
  // Step 2: Apply depreciation algorithm
  const depreciationAdjustment = calculateDepreciationAdjustment(baseValue, vehicleAge, vehicleAttributes.make);
  
  // Step 3: Apply mileage adjustment
  const mileageAdjustment = calculateMileageAdjustment(vehicleAttributes.mileage, vehicleAge);
  
  // Step 4: Apply condition adjustment
  const conditionAdjustment = calculateConditionAdjustment(vehicleAttributes.condition, baseValue);
  
  // Step 5: Apply fuel type adjustment
  const fuelTypeAdjustment = calculateFuelTypeAdjustment(vehicleAttributes.fuelType, baseValue);
  
  // Step 6: Apply regional adjustment (minimal for fallback)
  const regionalAdjustment = 0; // Could be enhanced with ZIP-based data
  
  // Calculate final estimated value
  const estimatedValue = Math.max(
    baseValue + depreciationAdjustment + mileageAdjustment + conditionAdjustment + fuelTypeAdjustment + regionalAdjustment,
    5000 // Minimum reasonable value
  );

  // Calculate confidence score based on data availability
  const confidenceScore = calculateFallbackConfidence(vehicleAttributes, baseValue);

  // Generate explanation
  const explanation = generateFallbackExplanation(vehicleAttributes, {
    baseValue,
    depreciationAdjustment,
    mileageAdjustment,
    conditionAdjustment,
    fuelTypeAdjustment,
    regionalAdjustment,
    estimatedValue,
    confidenceScore
  });

  const result: FallbackValuationResult = {
    estimated_value: Math.round(estimatedValue),
    confidence_score: confidenceScore,
    explanation,
    source: 'fallback_algorithm',
    value_breakdown: {
      base_value: baseValue,
      depreciation: depreciationAdjustment,
      mileage: mileageAdjustment,
      condition: conditionAdjustment,
      fuel_type: fuelTypeAdjustment,
      regional: regionalAdjustment
    }
  };

  console.log('✅ Fallback valuation calculated:', {
    estimatedValue: result.estimated_value,
    confidenceScore: result.confidence_score,
    breakdown: result.value_breakdown
  });

  return result;
}

/**
 * Determine base vehicle value using MSRP or make/model estimates
 */
function determineBaseValue(vehicle: VehicleAttributes): number {
  // If MSRP is provided, use it as base
  if (vehicle.baseMsrp && vehicle.baseMsrp > 0) {
    return vehicle.baseMsrp;
  }

  // Otherwise, use make/model estimation database
  const makeModelEstimates: Record<string, Record<string, number>> = {
    'toyota': {
      'camry': 28000, 'corolla': 22000, 'rav4': 30000, 'prius': 26000,
      'highlander': 38000, 'sienna': 35000, 'tacoma': 32000, 'tundra': 45000,
      'yaris': 18000, 'avalon': 35000, 'venza': 33000, '4runner': 38000
    },
    'honda': {
      'accord': 28000, 'civic': 24000, 'cr-v': 29000, 'pilot': 36000,
      'ridgeline': 38000, 'odyssey': 34000, 'fit': 18000, 'insight': 24000,
      'passport': 35000, 'hr-v': 23000
    },
    'ford': {
      'f-150': 35000, 'escape': 27000, 'fusion': 25000, 'explorer': 36000,
      'edge': 32000, 'expedition': 55000, 'mustang': 30000, 'focus': 20000,
      'fiesta': 16000, 'ranger': 28000, 'bronco': 35000
    },
    'chevrolet': {
      'silverado': 32000, 'equinox': 27000, 'malibu': 25000, 'tahoe': 55000,
      'suburban': 58000, 'cruze': 20000, 'impala': 28000, 'traverse': 33000,
      'colorado': 28000, 'camaro': 28000, 'corvette': 65000
    },
    'nissan': {
      'altima': 26000, 'sentra': 20000, 'rogue': 28000, 'pathfinder': 34000,
      'murano': 32000, 'titan': 35000, 'versa': 16000, 'maxima': 35000,
      'armada': 50000, 'frontier': 28000, 'leaf': 32000
    },
    'bmw': {
      '3 series': 40000, '5 series': 55000, 'x3': 45000, 'x5': 60000,
      '1 series': 35000, '7 series': 85000, 'x1': 35000, 'x7': 75000
    },
    'mercedes-benz': {
      'c-class': 42000, 'e-class': 58000, 'glc': 45000, 'gle': 60000,
      'a-class': 35000, 's-class': 95000, 'gla': 38000, 'gls': 75000
    },
    'audi': {
      'a3': 35000, 'a4': 40000, 'a6': 55000, 'q3': 35000,
      'q5': 45000, 'q7': 60000, 'a8': 85000, 'q8': 70000
    },
    'lexus': {
      'rx': 45000, 'es': 42000, 'is': 38000, 'gx': 55000,
      'lx': 85000, 'nx': 38000, 'ls': 75000, 'ux': 35000
    },
    'tesla': {
      'model 3': 40000, 'model s': 80000, 'model x': 85000, 'model y': 50000
    }
  };

  const makeLower = vehicle.make.toLowerCase();
  const modelLower = vehicle.model.toLowerCase();

  // Try exact make/model match
  if (makeModelEstimates[makeLower]?.[modelLower]) {
    return makeModelEstimates[makeLower][modelLower];
  }

  // Try partial model matching
  if (makeModelEstimates[makeLower]) {
    for (const [estimateModel, value] of Object.entries(makeModelEstimates[makeLower])) {
      if (modelLower.includes(estimateModel) || estimateModel.includes(modelLower)) {
        return value;
      }
    }
    
    // Use average for make if no model match
    const makeValues = Object.values(makeModelEstimates[makeLower]);
    return makeValues.reduce((sum, val) => sum + val, 0) / makeValues.length;
  }

  // Fallback to year-based estimation for unknown makes
  if (vehicle.year >= 2020) return 30000;
  if (vehicle.year >= 2015) return 25000;
  if (vehicle.year >= 2010) return 20000;
  return 15000;
}

/**
 * Calculate depreciation adjustment using industry-standard rates
 */
function calculateDepreciationAdjustment(baseValue: number, vehicleAge: number, make: string): number {
  if (vehicleAge === 0) return 0;

  const makeLower = make.toLowerCase();
  
  // Luxury brands depreciate faster initially but hold value better long-term
  const isLuxury = ['bmw', 'mercedes-benz', 'audi', 'lexus', 'acura', 'infiniti', 'cadillac', 'lincoln'].includes(makeLower);
  
  // High-retention brands
  const isHighRetention = ['toyota', 'honda', 'subaru', 'porsche', 'tesla'].includes(makeLower);

  let totalDepreciation = 0;
  let currentValue = baseValue;

  for (let year = 1; year <= vehicleAge; year++) {
    let yearlyRate;
    
    if (year === 1) {
      // First year depreciation
      yearlyRate = isLuxury ? 0.25 : 0.20; // 25% for luxury, 20% for others
    } else if (year <= 5) {
      // Years 2-5
      if (isLuxury) {
        yearlyRate = 0.12; // 12% per year
      } else if (isHighRetention) {
        yearlyRate = 0.08; // 8% per year for high-retention brands
      } else {
        yearlyRate = 0.10; // 10% per year for standard brands
      }
    } else {
      // After 5 years, depreciation slows
      yearlyRate = isHighRetention ? 0.05 : 0.07;
    }

    const yearlyDepreciation = currentValue * yearlyRate;
    totalDepreciation += yearlyDepreciation;
    currentValue -= yearlyDepreciation;
  }

  return -Math.round(totalDepreciation);
}

/**
 * Calculate mileage adjustment based on expected vs actual mileage
 */
function calculateMileageAdjustment(actualMileage: number, vehicleAge: number): number {
  const expectedMileage = vehicleAge * 12000; // 12k miles per year average
  const excessMiles = actualMileage - expectedMileage;

  if (excessMiles <= 0) {
    // Lower than average mileage is a bonus
    return Math.min(Math.abs(excessMiles) * 0.15, 3000); // Cap bonus at $3000
  } else {
    // Higher than average mileage is a penalty
    return -Math.round(excessMiles * 0.20); // $0.20 per excess mile
  }
}

/**
 * Calculate condition adjustment based on vehicle condition
 */
function calculateConditionAdjustment(condition: string, baseValue: number): number {
  const conditionMultipliers: Record<string, number> = {
    'excellent': 0.05,    // +5%
    'very good': 0.02,    // +2%
    'good': 0,            // baseline
    'fair': -0.15,        // -15%
    'poor': -0.30,        // -30%
    'salvage': -0.60      // -60%
  };

  const conditionLower = condition.toLowerCase();
  const multiplier = conditionMultipliers[conditionLower] || 0;
  
  return Math.round(baseValue * multiplier);
}

/**
 * Calculate fuel type adjustment
 */
function calculateFuelTypeAdjustment(fuelType: string | undefined, baseValue: number): number {
  if (!fuelType) return 0;

  const fuelTypeLower = fuelType.toLowerCase();
  
  if (fuelTypeLower.includes('electric')) {
    return Math.round(baseValue * 0.08); // +8% for electric
  } else if (fuelTypeLower.includes('hybrid')) {
    return Math.round(baseValue * 0.05); // +5% for hybrid
  } else if (fuelTypeLower.includes('diesel')) {
    return Math.round(baseValue * 0.03); // +3% for diesel
  }
  
  return 0; // No adjustment for gasoline
}

/**
 * Calculate confidence score for fallback valuation
 */
function calculateFallbackConfidence(vehicle: VehicleAttributes, baseValue: number): number {
  let confidence = 50; // Start with base confidence for fallback

  // Adjust based on data quality
  if (vehicle.baseMsrp && vehicle.baseMsrp > 0) {
    confidence += 15; // Have actual MSRP
  }

  if (vehicle.trim) {
    confidence += 5; // Have trim information
  }

  if (vehicle.fuelType) {
    confidence += 5; // Have fuel type information
  }

  // Vehicle age affects confidence
  const vehicleAge = new Date().getFullYear() - vehicle.year;
  if (vehicleAge <= 3) {
    confidence += 10; // Newer vehicles more predictable
  } else if (vehicleAge > 10) {
    confidence -= 10; // Older vehicles less predictable
  }

  // Popular makes are more predictable
  const popularMakes = ['toyota', 'honda', 'ford', 'chevrolet', 'nissan'];
  if (popularMakes.includes(vehicle.make.toLowerCase())) {
    confidence += 5;
  }

  // Ensure confidence is within reasonable bounds
  return Math.max(25, Math.min(75, confidence));
}

/**
 * Generate explanation for fallback valuation
 */
function generateFallbackExplanation(
  vehicle: VehicleAttributes,
  breakdown: {
    baseValue: number;
    depreciationAdjustment: number;
    mileageAdjustment: number;
    conditionAdjustment: number;
    fuelTypeAdjustment: number;
    regionalAdjustment: number;
    estimatedValue: number;
    confidenceScore: number;
  }
): string {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - vehicle.year;
  
  let explanation = `This valuation for your ${vehicle.year} ${vehicle.make} ${vehicle.model} `;
  explanation += `was calculated using our depreciation-based algorithm due to insufficient market listing data. `;
  
  explanation += `\n\nBase Value: $${breakdown.baseValue.toLocaleString()}`;
  if (vehicle.baseMsrp) {
    explanation += ` (based on manufacturer MSRP)`;
  } else {
    explanation += ` (estimated from make/model database)`;
  }
  
  if (breakdown.depreciationAdjustment !== 0) {
    explanation += `\n\nDepreciation: ${breakdown.depreciationAdjustment.toLocaleString()} `;
    explanation += `(${vehicleAge} year${vehicleAge !== 1 ? 's' : ''} old, `;
    explanation += `${Math.round(Math.abs(breakdown.depreciationAdjustment) / breakdown.baseValue * 100)}% total depreciation)`;
  }
  
  if (breakdown.mileageAdjustment !== 0) {
    const expectedMileage = vehicleAge * 12000;
    explanation += `\n\nMileage Adjustment: ${breakdown.mileageAdjustment >= 0 ? '+' : ''}${breakdown.mileageAdjustment.toLocaleString()} `;
    explanation += `(${vehicle.mileage.toLocaleString()} miles vs. ${expectedMileage.toLocaleString()} expected)`;
  }
  
  if (breakdown.conditionAdjustment !== 0) {
    explanation += `\n\nCondition Adjustment: ${breakdown.conditionAdjustment >= 0 ? '+' : ''}${breakdown.conditionAdjustment.toLocaleString()} `;
    explanation += `(${vehicle.condition} condition)`;
  }
  
  if (breakdown.fuelTypeAdjustment !== 0) {
    explanation += `\n\nFuel Type Bonus: +${breakdown.fuelTypeAdjustment.toLocaleString()} `;
    explanation += `(${vehicle.fuelType} vehicle)`;
  }
  
  explanation += `\n\nFinal Estimated Value: $${breakdown.estimatedValue.toLocaleString()}`;
  explanation += `\n\nConfidence: ${breakdown.confidenceScore}% (Algorithm-based estimate)`;
  
  explanation += `\n\nNote: This estimate is based on industry-standard depreciation models and vehicle attributes. `;
  explanation += `For a more accurate valuation, we recommend obtaining current market listings or a professional appraisal.`;
  
  return explanation;
}