
// Simple valuation model based on key features

export interface ValuationFeatures {
  basePrice: number;
  conditionScore: number;
  mileage: number;
  accidentCount: number;
  zipDemandFactor: number;
  dealerAvgPrice?: number;
  auctionAvgPrice?: number;
  featureValueTotal?: number;
}

// Simplified predictive model
export function predictValuation(features: ValuationFeatures): number {
  let basePrice = features.basePrice;
  
  // Apply condition adjustment
  // Convert condition to a 0-1 scale
  const conditionFactor = features.conditionScore / 100;
  let conditionAdjustment = 0;
  
  if (conditionFactor > 0.8) {
    conditionAdjustment = basePrice * 0.1; // Up to 10% premium for excellent condition
  } else if (conditionFactor > 0.6) {
    conditionAdjustment = basePrice * 0.05; // 5% premium for good condition
  } else if (conditionFactor > 0.4) {
    conditionAdjustment = 0; // No adjustment for average condition
  } else if (conditionFactor > 0.2) {
    conditionAdjustment = -basePrice * 0.1; // -10% for poor condition
  } else {
    conditionAdjustment = -basePrice * 0.2; // -20% for very poor condition
  }
  
  // Apply mileage adjustment
  // Assuming average mileage is 12K per year, and car is approximately 5 years old (60K miles)
  const expectedMileage = 60000;
  const mileageDiff = features.mileage - expectedMileage;
  const mileageAdjustment = mileageDiff > 0 
    ? -Math.min(basePrice * 0.15, (mileageDiff / 20000) * basePrice * 0.05) // Penalty for high mileage
    : Math.min(basePrice * 0.1, (-mileageDiff / 20000) * basePrice * 0.025); // Bonus for low mileage
  
  // Apply accident history adjustment
  const accidentAdjustment = features.accidentCount > 0 
    ? -Math.min(basePrice * 0.2, features.accidentCount * basePrice * 0.1) // Each accident reduces value 
    : 0;
  
  // Apply market demand factor
  const marketAdjustment = (features.zipDemandFactor - 1) * basePrice;
  
  // Apply feature value
  const featureAdjustment = features.featureValueTotal || 0;
  
  // Calculate total adjustment
  const totalAdjustment = 
    conditionAdjustment + 
    mileageAdjustment + 
    accidentAdjustment + 
    marketAdjustment + 
    featureAdjustment;
  
  // Apply final price
  const predictedPrice = Math.max(basePrice + totalAdjustment, basePrice * 0.5);
  
  // Round to nearest hundred
  return Math.round(predictedPrice / 100) * 100;
}
