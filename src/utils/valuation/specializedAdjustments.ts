
/**
 * Specialized adjustment calculators for vehicle valuation
 */

// EPA MPG adjustment calculation
export function getMpgAdjustment(mpg: number | null, basePrice: number): number {
  if (mpg === null) return 0;
  
  if (mpg >= 30) {
    return basePrice * 0.03; // +3% for high MPG
  } 
  else if (mpg < 20) {
    return basePrice * -0.03; // -3% for low MPG
  }
  
  return 0; // No adjustment for average MPG
}

// Location density adjustment based on OSM data
export function getLocationDensityAdjustment(osmData: any, basePrice: number): number {
  if (!osmData || !Array.isArray(osmData) || osmData.length === 0) {
    return 0;
  }
  
  const location = osmData[0];
  
  // Check if it's a high-density area based on the location type and class
  const isUrban = location.type === 'city' || 
                 location.type === 'town' || 
                 location.display_name.toLowerCase().includes('new york') ||
                 location.display_name.toLowerCase().includes('los angeles') ||
                 location.display_name.toLowerCase().includes('chicago') ||
                 location.display_name.toLowerCase().includes('san francisco');
  
  if (isUrban) {
    return basePrice * 0.04; // +4% for urban areas
  }
  
  const isSuburban = location.type === 'suburb' || 
                    location.type === 'residential' ||
                    location.display_name.toLowerCase().includes('county');
  
  if (isSuburban) {
    return basePrice * 0.02; // +2% for suburban areas
  }
  
  return 0; // No adjustment for rural areas
}

// Income-based adjustment from Census data
export function getIncomeAdjustment(censusData: any, basePrice: number): number {
  if (!censusData || !censusData.medianIncome) {
    return 0;
  }
  
  const medianIncome = censusData.medianIncome;
  
  if (medianIncome > 120000) {
    return basePrice * 0.03; // +3% for high-income areas
  }
  else if (medianIncome > 90000) {
    return basePrice * 0.02; // +2% for above-average income areas
  }
  else if (medianIncome < 50000) {
    return basePrice * -0.01; // -1% for below-average income areas
  }
  
  return 0; // No adjustment for average income areas
}
