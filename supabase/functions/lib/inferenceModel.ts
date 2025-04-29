
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

// Simple prediction model based on input features
export function predictValuation(features: ValuationFeatures): number {
  // Base price adjustment
  let predictedPrice = features.basePrice;
  
  // Apply condition-based adjustment
  const conditionFactor = features.conditionScore / 50; // Normalize to 0-2 range
  predictedPrice *= conditionFactor;
  
  // Apply mileage adjustment (more miles = lower value)
  // Typical depreciation of around 5-15% per 10k miles
  const mileageAdjustment = 1 - (features.mileage / 100000) * 0.1;
  predictedPrice *= Math.max(0.6, mileageAdjustment); // Don't let it go below 60% of value
  
  // Apply accident adjustment
  const accidentFactor = Math.max(0.7, 1 - (features.accidentCount * 0.1));
  predictedPrice *= accidentFactor;
  
  // Apply zip code demand factor
  predictedPrice *= features.zipDemandFactor;
  
  // Apply feature value additions
  if (features.featureValueTotal) {
    predictedPrice += features.featureValueTotal;
  }
  
  // Adjustments from market data if available
  if (features.dealerAvgPrice && features.auctionAvgPrice) {
    // Blend with market data (60% weight to our prediction, 40% to market)
    const marketBlendedPrice = (
      features.dealerAvgPrice * 0.6 + 
      features.auctionAvgPrice * 0.4
    );
    predictedPrice = predictedPrice * 0.6 + marketBlendedPrice * 0.4;
  }
  
  return Math.round(predictedPrice);
}
