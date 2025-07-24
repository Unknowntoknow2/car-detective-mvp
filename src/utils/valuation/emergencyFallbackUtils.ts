/**
 * Emergency fallback utilities for valuation system
 * Used when primary valuation methods fail or return invalid results
 */

interface VehicleData {
  make?: string;
  model?: string;
  year?: number;
  trim?: string;
  fuelType?: string;
}

/**
 * Generate emergency fallback value when primary valuation fails
 */
export function generateEmergencyFallbackValue(
  vehicleData: VehicleData,
  mileage: number,
  condition: string
): number {
  console.log('🚨 Generating emergency fallback valuation for:', vehicleData);
  
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - (vehicleData.year || currentYear);
  
  // Base value estimation by make/model with comprehensive coverage
  const makeModelBase: { [key: string]: { [key: string]: number } } = {
    'dodge': {
      'charger': 28000,
      'challenger': 32000,
      'durango': 35000,
      'journey': 22000,
      'grand caravan': 25000,
      'avenger': 20000,
      'dart': 18000,
      'ram': 35000
    },
    'toyota': { 
      'camry': 28000, 
      'corolla': 22000, 
      'rav4': 30000, 
      'prius': 26000,
      'highlander': 38000,
      'sienna': 35000,
      'tacoma': 32000,
      'tundra': 45000,
      'yaris': 18000,
      'avalon': 35000
    },
    'honda': { 
      'accord': 28000, 
      'civic': 24000, 
      'crv': 29000, 
      'pilot': 36000,
      'ridgeline': 38000,
      'odyssey': 34000,
      'fit': 18000,
      'insight': 24000,
      'passport': 35000
    },
    'ford': { 
      'f150': 35000, 
      'escape': 27000, 
      'fusion': 25000, 
      'explorer': 36000,
      'edge': 32000,
      'expedition': 55000,
      'mustang': 30000,
      'focus': 20000,
      'fiesta': 16000,
      'ranger': 28000
    },
    'chevrolet': { 
      'silverado': 32000, 
      'equinox': 27000, 
      'malibu': 25000, 
      'tahoe': 55000,
      'suburban': 58000,
      'cruze': 20000,
      'impala': 28000,
      'traverse': 33000,
      'colorado': 28000,
      'camaro': 28000
    },
    'nissan': { 
      'altima': 26000, 
      'sentra': 20000, 
      'rogue': 28000, 
      'pathfinder': 34000,
      'murano': 32000,
      'titan': 35000,
      'versa': 16000,
      'maxima': 35000,
      'armada': 50000,
      'frontier': 28000
    },
    'hyundai': {
      'elantra': 21000,
      'sonata': 25000,
      'tucson': 26000,
      'santa fe': 30000,
      'accent': 17000,
      'genesis': 40000,
      'palisade': 35000,
      'kona': 23000
    },
    'kia': {
      'optima': 24000,
      'forte': 20000,
      'sportage': 26000,
      'sorento': 30000,
      'rio': 17000,
      'stinger': 35000,
      'telluride': 35000,
      'soul': 20000
    },
    'subaru': {
      'outback': 28000,
      'forester': 26000,
      'impreza': 22000,
      'legacy': 25000,
      'crosstrek': 24000,
      'ascent': 33000,
      'wrx': 30000,
      'brz': 28000
    },
    'mazda': {
      'mazda3': 22000,
      'mazda6': 26000,
      'cx5': 28000,
      'cx9': 35000,
      'cx3': 21000,
      'miata': 28000
    },
    'volkswagen': {
      'jetta': 22000,
      'passat': 26000,
      'tiguan': 28000,
      'atlas': 35000,
      'golf': 23000,
      'beetle': 22000
    },
    'bmw': {
      '3 series': 40000,
      '5 series': 55000,
      'x3': 45000,
      'x5': 60000,
      '1 series': 35000,
      '7 series': 85000
    },
    'mercedes-benz': {
      'c-class': 42000,
      'e-class': 58000,
      'glc': 45000,
      'gle': 60000,
      'a-class': 35000,
      's-class': 95000
    },
    'audi': {
      'a3': 35000,
      'a4': 40000,
      'a6': 55000,
      'q3': 35000,
      'q5': 45000,
      'q7': 60000
    },
    'lexus': {
      'rx': 45000,
      'es': 42000,
      'is': 38000,
      'gx': 55000,
      'lx': 85000,
      'nx': 38000
    },
    'acura': {
      'tlx': 35000,
      'mdx': 45000,
      'rdx': 40000,
      'ilx': 28000,
      'tsx': 30000
    },
    'infiniti': {
      'q50': 38000,
      'qx60': 42000,
      'qx80': 65000,
      'q60': 42000
    },
    'cadillac': {
      'ats': 35000,
      'cts': 45000,
      'escalade': 75000,
      'srx': 40000,
      'xt5': 42000
    },
    'lincoln': {
      'mkz': 38000,
      'navigator': 75000,
      'mkx': 42000,
      'continental': 48000
    },
    'jeep': {
      'wrangler': 32000,
      'grand cherokee': 35000,
      'cherokee': 28000,
      'compass': 24000,
      'renegade': 22000,
      'gladiator': 35000
    },
    'ram': {
      '1500': 35000,
      '2500': 42000,
      '3500': 48000,
      'promaster': 35000
    },
    'chrysler': {
      '300': 32000,
      'pacifica': 35000,
      '200': 22000
    },
    'buick': {
      'enclave': 42000,
      'encore': 24000,
      'envision': 35000,
      'lacrosse': 35000
    },
    'gmc': {
      'sierra': 35000,
      'acadia': 35000,
      'terrain': 28000,
      'yukon': 55000,
      'canyon': 28000
    },
    'volvo': {
      'xc90': 50000,
      'xc60': 42000,
      's60': 38000,
      'v60': 40000,
      'xc40': 35000
    },
    'land rover': {
      'discovery': 55000,
      'range rover': 90000,
      'range rover sport': 70000,
      'evoque': 42000
    },
    'porsche': {
      'cayenne': 70000,
      'macan': 55000,
      '911': 100000,
      'panamera': 85000
    },
    'tesla': {
      'model 3': 40000,
      'model s': 80000,
      'model x': 85000,
      'model y': 50000
    },
    'genesis': {
      'g90': 70000,
      'g80': 50000,
      'gv70': 42000,
      'gv80': 55000
    }
  };
  
  const makeLower = vehicleData.make?.toLowerCase() || 'unknown';
  const modelLower = vehicleData.model?.toLowerCase() || 'unknown';
  
  let baseValue = 25000; // Conservative default fallback
  
  if (makeModelBase[makeLower]?.[modelLower]) {
    baseValue = makeModelBase[makeLower][modelLower];
  } else if (makeModelBase[makeLower]) {
    // Use average for make if specific model not found
    const makeValues = Object.values(makeModelBase[makeLower]);
    baseValue = makeValues.reduce((sum, val) => sum + val, 0) / makeValues.length;
  } else {
    // Use vehicle year to estimate base value for unknown makes
    const yearEstimate = vehicleData.year || currentYear;
    if (yearEstimate >= 2020) {
      baseValue = 30000;
    } else if (yearEstimate >= 2015) {
      baseValue = 25000;
    } else if (yearEstimate >= 2010) {
      baseValue = 20000;
    } else {
      baseValue = 15000;
    }
  }
  
  // Apply depreciation
  let finalValue = baseValue;
  
  // First year depreciation (20%)
  if (vehicleAge > 0) {
    finalValue *= 0.80;
    
    // Subsequent years (12% per year for first 5 years, 8% after)
    for (let i = 1; i < vehicleAge; i++) {
      if (i <= 5) {
        finalValue *= 0.88; // 12% per year
      } else {
        finalValue *= 0.92; // 8% per year after 5 years
      }
    }
  }
  
  // Mileage adjustment
  const expectedMiles = vehicleAge * 12000;
  const excessMiles = Math.max(0, mileage - expectedMiles);
  const mileagePenalty = (excessMiles / 1000) * 50; // $50 per 1000 excess miles
  
  finalValue -= mileagePenalty;
  
  // Condition adjustment
  const conditionMultipliers: { [key: string]: number } = {
    'excellent': 1.05,
    'very good': 1.02,
    'good': 1.0,
    'fair': 0.85,
    'poor': 0.70
  };
  
  const conditionLower = condition?.toLowerCase() || 'good';
  finalValue *= conditionMultipliers[conditionLower] || 1.0;
  
  // Fuel type bonus for hybrid/electric
  if (vehicleData.fuelType?.toLowerCase().includes('hybrid')) {
    finalValue *= 1.03; // 3% bonus for hybrid
  } else if (vehicleData.fuelType?.toLowerCase().includes('electric')) {
    finalValue *= 1.05; // 5% bonus for electric
  }
  
  // Ensure minimum reasonable value
  const minimumValue = Math.max(8000, vehicleAge > 15 ? 5000 : 8000);
  finalValue = Math.max(Math.round(finalValue), minimumValue);
  
  console.log('✅ Generated emergency fallback valuation:', {
    originalBase: baseValue,
    afterDepreciation: Math.round(baseValue * (vehicleAge > 0 ? 0.80 : 1.0)),
    afterMileage: Math.round(finalValue + mileagePenalty),
    afterCondition: Math.round(finalValue / (conditionMultipliers[conditionLower] || 1.0)),
    finalValue: finalValue,
    vehicleAge: vehicleAge,
    mileage: mileage,
    condition: condition
  });
  
  return finalValue;
}

/**
 * Track when emergency fallback is used for monitoring
 */
export async function trackValuationFallback(
  vin: string,
  originalValue: number,
  fallbackValue: number,
  reason: string
): Promise<void> {
  try {
    console.warn('📊 Tracking valuation fallback:', {
      vin,
      originalValue,
      fallbackValue,
      reason,
      timestamp: new Date().toISOString()
    });
    
    // Could log to analytics or monitoring system here
    // For now, just console logging for visibility
  } catch (error) {
    console.error('Failed to track valuation fallback:', error);
  }
}