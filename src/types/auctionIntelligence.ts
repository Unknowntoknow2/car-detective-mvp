
export interface AuctionIntelligencePriceTrend {
  prices: Array<{
    price: number;
    date: string;
    source: string;
  }>;
  direction: 'upward' | 'downward' | 'stable';
  volatility: number;
}

export interface AuctionIntelligenceFlipFlags {
  detected: boolean;
  count: number;
  alerts: Array<{
    type: 'rapid_resale' | 'price_drop' | 'damage_escalation';
    description: string;
    days_between: number;
  }>;
}

export interface AuctionIntelligenceData {
  vin: string;
  price_trend: AuctionIntelligencePriceTrend;
  flip_flags: AuctionIntelligenceFlipFlags;
  auction_conflict: boolean;
  latest_sale: any;
  risk_score: number;
  created_at: string;
  updated_at: string;
}
