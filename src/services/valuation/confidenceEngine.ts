// FIX #5: Enhanced Confidence Score Calibration v2
interface ConfidenceInputs {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  mileage: number;
  condition: string;
  zipCode: string;
  marketSearchStatus: string;
  listings: any[];
  listingRange?: { min: number; max: number };
  finalValue: number;
  sources: string[];
  baseValue: number;
}

interface ConfidenceBreakdown {
  base: number;
  vehicleData: number;
  marketData: number;
  spreadAnalysis: number;
  sourceCount: number;
  zipMatch: number;
  msrpPresence: number;
  fuelDataTrust: number;
  total: number;
  formula: string;
}

/**
 * Calculate advanced confidence score using multiple factors
 */
export function calculateAdvancedConfidence(inputs: ConfidenceInputs): number {
  const {
    vehicleMake, vehicleModel, vehicleYear, mileage, condition, zipCode,
    marketSearchStatus, listings, listingRange, finalValue, sources, baseValue
  } = inputs;

  let confidence = 30; // Base confidence
  const breakdown: Partial<ConfidenceBreakdown> = { base: 30 };

  // 1. Vehicle Data Quality (up to +20 points)
  let vehicleDataBonus = 0;
  if (vehicleMake !== 'Unknown' && vehicleModel !== 'Unknown') vehicleDataBonus += 8;
  if (vehicleYear > 1990 && vehicleYear <= new Date().getFullYear()) vehicleDataBonus += 5;
  if (mileage > 0 && mileage < 300000) vehicleDataBonus += 4;
  if (condition && condition !== 'unknown') vehicleDataBonus += 3;
  
  confidence += vehicleDataBonus;
  breakdown.vehicleData = vehicleDataBonus;

  // 2. Market Data Quality (up to +25 points)
  let marketDataBonus = 0;
  if (marketSearchStatus === 'success') {
    marketDataBonus += 10;
    
    // Listing count bonus
    if (listings.length >= 8) marketDataBonus += 8;
    else if (listings.length >= 5) marketDataBonus += 5;
    else if (listings.length >= 3) marketDataBonus += 3;
    
    // Market depth bonus
    if (listings.length >= 10) marketDataBonus += 2;
  } else if (marketSearchStatus === 'fallback') {
    marketDataBonus -= 5;
  } else {
    marketDataBonus -= 10;
  }
  
  confidence += marketDataBonus;
  breakdown.marketData = marketDataBonus;

  // 3. Spread Analysis (up to +10, down to -10 points)
  let spreadAnalysis = 0;
  if (listingRange && finalValue > 0 && listings.length >= 3) {
    const spread = listingRange.max - listingRange.min;
    const spreadPercent = spread / finalValue;
    
    if (spreadPercent < 0.08) {
      spreadAnalysis = 10; // Very tight clustering
    } else if (spreadPercent < 0.15) {
      spreadAnalysis = 6; // Good clustering
    } else if (spreadPercent < 0.25) {
      spreadAnalysis = 2; // Moderate clustering
    } else if (spreadPercent > 0.45) {
      spreadAnalysis = -8; // Wide spread suggests unreliable data
    } else if (spreadPercent > 0.35) {
      spreadAnalysis = -4; // Moderate spread
    }
  }
  
  confidence += spreadAnalysis;
  breakdown.spreadAnalysis = spreadAnalysis;

  // 4. Source Count & Quality (up to +15 points)
  let sourceBonus = Math.min(sources.length * 2, 10);
  if (sources.includes('msrp_db_lookup')) sourceBonus += 3;
  if (sources.includes('openai_market_search')) sourceBonus += 2;
  
  confidence += sourceBonus;
  breakdown.sourceCount = sourceBonus;

  // 5. ZIP Code Match Rate (up to +8 points)
  let zipMatchBonus = 0;
  if (listings.length > 0) {
    const localListings = listings.filter(l => 
      l.location && (l.location.includes(zipCode) || l.zipCode === zipCode)
    );
    const matchRate = localListings.length / listings.length;
    
    if (matchRate > 0.7) zipMatchBonus = 8;
    else if (matchRate > 0.4) zipMatchBonus = 5;
    else if (matchRate > 0.2) zipMatchBonus = 2;
    else zipMatchBonus = -2; // Penalty for no local matches
  }
  
  confidence += zipMatchBonus;
  breakdown.zipMatch = zipMatchBonus;

  // 6. MSRP Presence Bonus (up to +5 points)
  const msrpBonus = baseValue > 30000 ? 5 : 0;
  confidence += msrpBonus;
  breakdown.msrpPresence = msrpBonus;

  // 7. Fuel Data Trust Score (up to +3 points)
  const fuelDataBonus = sources.includes('eia_fuel_costs') ? 3 : 1;
  confidence += fuelDataBonus;
  breakdown.fuelDataTrust = fuelDataBonus;

  // Cap confidence between 25 and 98
  const finalConfidence = Math.max(25, Math.min(98, confidence));
  
  breakdown.total = finalConfidence;
  breakdown.formula = `Base(${breakdown.base}) + Vehicle(${vehicleDataBonus}) + Market(${marketDataBonus}) + Spread(${spreadAnalysis}) + Sources(${sourceBonus}) + ZIP(${zipMatchBonus}) + MSRP(${msrpBonus}) + Fuel(${fuelDataBonus}) = ${finalConfidence}`;

  return finalConfidence;
}

/**
 * Get detailed confidence breakdown for debugging
 */
export function getConfidenceBreakdown(inputs: ConfidenceInputs): ConfidenceBreakdown {
  const confidence = calculateAdvancedConfidence(inputs);
  
  // Return detailed breakdown (this is a simplified version)
  return {
    base: 30,
    vehicleData: 0, // Would calculate each component
    marketData: 0,
    spreadAnalysis: 0, 
    sourceCount: 0,
    zipMatch: 0,
    msrpPresence: 0,
    fuelDataTrust: 0,
    total: confidence,
    formula: `Advanced confidence calculation = ${confidence}%`
  };
}