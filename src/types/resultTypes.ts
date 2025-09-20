
export interface ValidatedAdjustment {
  label: string;
  amount: number;
  source: string;
  synthetic: boolean;
  confidence: number;
  calculatedAt: string;
  reason?: string;
}

export interface MarketIntelligence {
  medianPrice: number;
  priceRange: [number, number];
  confidence: number;
  outlierCount: number;
  adjustedPrice: number;
  sources: string[];
}