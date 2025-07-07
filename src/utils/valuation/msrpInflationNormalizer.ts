/**
 * MSRP Inflation Normalizer
 * Adjusts historical MSRP values to account for inflation and market changes
 */

interface InflationData {
  year: number;
  cpi: number; // Consumer Price Index
  automotiveInflation: number; // Automotive-specific inflation rate
}

// Historical automotive inflation data (simplified for demo)
const INFLATION_DATA: InflationData[] = [
  { year: 2015, cpi: 237.0, automotiveInflation: 1.02 },
  { year: 2016, cpi: 240.0, automotiveInflation: 1.03 },
  { year: 2017, cpi: 245.1, automotiveInflation: 1.04 },
  { year: 2018, cpi: 251.1, automotiveInflation: 1.06 },
  { year: 2019, cpi: 255.7, automotiveInflation: 1.02 },
  { year: 2020, cpi: 258.8, automotiveInflation: 0.98 }, // COVID impact
  { year: 2021, cpi: 271.0, automotiveInflation: 1.12 }, // Supply chain issues
  { year: 2022, cpi: 292.7, automotiveInflation: 1.15 }, // Chip shortage
  { year: 2023, cpi: 307.0, automotiveInflation: 1.08 },
  { year: 2024, cpi: 315.0, automotiveInflation: 1.05 },
  { year: 2025, cpi: 322.0, automotiveInflation: 1.03 }
];

interface NormalizationResult {
  originalMsrp: number;
  normalizedMsrp: number;
  inflationFactor: number;
  adjustmentReason: string;
  confidence: number;
}

/**
 * Normalizes MSRP to current year values accounting for inflation
 */
export function normalizeMsrpForInflation(
  originalMsrp: number,
  vehicleYear: number,
  targetYear: number = new Date().getFullYear()
): NormalizationResult {
  
  // Find inflation data for both years
  const vehicleYearData = INFLATION_DATA.find(d => d.year === vehicleYear);
  const targetYearData = INFLATION_DATA.find(d => d.year === targetYear);
  
  if (!vehicleYearData || !targetYearData) {
    // Fallback to basic inflation estimate
    const yearDiff = targetYear - vehicleYear;
    const estimatedInflation = Math.pow(1.04, yearDiff); // 4% annual inflation
    
    return {
      originalMsrp,
      normalizedMsrp: originalMsrp * estimatedInflation,
      inflationFactor: estimatedInflation,
      adjustmentReason: `Estimated inflation adjustment (${yearDiff} years)`,
      confidence: 70
    };
  }
  
  // Calculate cumulative inflation from vehicle year to target year
  let cumulativeInflation = 1.0;
  let adjustmentDetails: string[] = [];
  
  for (let year = vehicleYear + 1; year <= targetYear; year++) {
    const yearData = INFLATION_DATA.find(d => d.year === year);
    if (yearData) {
      cumulativeInflation *= yearData.automotiveInflation;
      
      // Track significant adjustments
      if (yearData.automotiveInflation > 1.10) {
        adjustmentDetails.push(`${year}: High inflation (+${((yearData.automotiveInflation - 1) * 100).toFixed(1)}%)`);
      } else if (yearData.automotiveInflation < 0.95) {
        adjustmentDetails.push(`${year}: Market decline (${((yearData.automotiveInflation - 1) * 100).toFixed(1)}%)`);
      }
    }
  }
  
  const normalizedMsrp = originalMsrp * cumulativeInflation;
  
  // Calculate confidence based on data availability and time span
  let confidence = 95;
  const yearSpan = targetYear - vehicleYear;
  if (yearSpan > 10) confidence -= 10;
  if (yearSpan > 15) confidence -= 10;
  if (adjustmentDetails.length > 2) confidence -= 5; // Market volatility
  
  return {
    originalMsrp,
    normalizedMsrp: Math.round(normalizedMsrp),
    inflationFactor: cumulativeInflation,
    adjustmentReason: adjustmentDetails.length > 0 
      ? `Inflation-adjusted: ${adjustmentDetails.join(', ')}`
      : `Standard inflation adjustment (${yearSpan} years)`,
    confidence: Math.max(confidence, 60)
  };
}

/**
 * Applies market-specific adjustments beyond inflation
 */
export function applyMarketAdjustments(
  normalizedMsrp: number,
  make: string,
  model: string,
  year: number
): {
  adjustedMsrp: number;
  marketFactors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
} {
  const marketFactors = [];
  let adjustedMsrp = normalizedMsrp;
  
  // Luxury brand premium adjustment
  const luxuryBrands = ['BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Acura', 'Infiniti', 'Cadillac'];
  if (luxuryBrands.includes(make)) {
    const luxuryPremium = 1.08; // 8% premium for luxury depreciation patterns
    adjustedMsrp *= luxuryPremium;
    marketFactors.push({
      factor: 'Luxury Brand Premium',
      impact: (luxuryPremium - 1) * 100,
      description: 'Luxury vehicles have different depreciation curves'
    });
  }
  
  // Electric vehicle adjustment (recent years)
  const evKeywords = ['electric', 'ev', 'hybrid', 'tesla', 'prius', 'leaf', 'bolt'];
  const isEV = evKeywords.some(keyword => 
    model.toLowerCase().includes(keyword) || make.toLowerCase() === 'tesla'
  );
  
  if (isEV && year >= 2020) {
    const evAdjustment = 1.12; // 12% premium for EV market dynamics
    adjustedMsrp *= evAdjustment;
    marketFactors.push({
      factor: 'Electric Vehicle Premium',
      impact: (evAdjustment - 1) * 100,
      description: 'EV market has unique pricing dynamics and incentives'
    });
  }
  
  // Chip shortage adjustment (2021-2023)
  if (year >= 2021 && year <= 2023) {
    const chipShortageAdjustment = 1.15; // 15% for supply chain impact
    adjustedMsrp *= chipShortageAdjustment;
    marketFactors.push({
      factor: 'Supply Chain Impact',
      impact: (chipShortageAdjustment - 1) * 100,
      description: 'Semiconductor shortage affected vehicle pricing 2021-2023'
    });
  }
  
  return {
    adjustedMsrp: Math.round(adjustedMsrp),
    marketFactors
  };
}

/**
 * Complete MSRP normalization with inflation and market adjustments
 */
export function getFullyNormalizedMsrp(
  originalMsrp: number,
  make: string,
  model: string,
  year: number,
  targetYear: number = new Date().getFullYear()
) {
  // Step 1: Normalize for inflation
  const inflationResult = normalizeMsrpForInflation(originalMsrp, year, targetYear);
  
  // Step 2: Apply market adjustments
  const marketResult = applyMarketAdjustments(
    inflationResult.normalizedMsrp,
    make,
    model,
    year
  );
  
  return {
    ...inflationResult,
    finalMsrp: marketResult.adjustedMsrp,
    marketFactors: marketResult.marketFactors,
    totalAdjustment: marketResult.adjustedMsrp / originalMsrp,
    methodology: 'inflation_plus_market_factors'
  };
}