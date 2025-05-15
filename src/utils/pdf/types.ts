
export interface ReportData {
  id: string;
  userId?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  confidenceScore?: number;
  priceRange?: [number, number];
  generatedAt?: string;
  features?: string[];
  photoUrl?: string;
  bodyType?: string;
  transmission?: string;
  fuelType?: string;
  color?: string;
  vin?: string;
}

export interface ReportOptions {
  isPremium: boolean;
  includeBranding: boolean;
  includeAIScore: boolean;
  includeFooter: boolean;
  includeTimestamp: boolean;
  includePhotoAssessment: boolean;
  includeMarketComparison: boolean;
  includeDealerOffers: boolean;
}
