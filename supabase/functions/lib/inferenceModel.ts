
export interface ValuationFeatures {
  basePrice: number;
  conditionScore: number;
  mileage: number;
  accidentCount: number;
  zipDemandFactor: number;
  dealerAvgPrice: number;
  auctionAvgPrice: number;
  featureValueTotal: number;
}

export function predictValuation(features: ValuationFeatures): number {
  const {
    basePrice,
    conditionScore,
    mileage,
    accidentCount,
    zipDemandFactor,
    dealerAvgPrice,
    auctionAvgPrice,
    featureValueTotal
  } = features;

  const conditionFactor = 1 + (conditionScore - 50) / 1000;
  const mileageFactor = 1 - mileage / 300000;
  const accidentFactor = 1 - accidentCount * 0.02;

  const raw =
    basePrice * conditionFactor * mileageFactor * accidentFactor * zipDemandFactor +
    dealerAvgPrice * 0.1 +
    auctionAvgPrice * 0.1 +
    featureValueTotal;

  return Math.max(0, Math.round(raw));
}
