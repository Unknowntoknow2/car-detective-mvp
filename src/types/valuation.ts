
export interface ValuationResult {
  id: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  estimated_value?: number;
  estimatedValue?: number;
  confidence_score?: number;
  confidenceScore?: number;
  mileage?: number;
  condition?: string;
  created_at: string;
  adjustments?: Array<{
    label?: string;
    factor: string;
    value?: number;
    impact: number;
    description?: string;
  }>;
  price_range?: { low: number; high: number; min: number; max: number };
  priceRange?: [number, number];
  features?: string[];
  pdfUrl?: string;
  gptExplanation?: string;
  explanation?: string;
  // Additional properties for compatibility
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  zipCode?: string;
  basePrice?: number;
  base_price?: number;
  isPremium?: boolean;
  premium_unlocked?: boolean;
  bestPhotoUrl?: string;
  photo_url?: string;
  photoScore?: number;
  userId?: string;
  trim?: string;
  aiCondition?: any;
}

export interface ValuationAdjustment {
  label?: string;
  factor: string;
  value?: number;
  impact: number;
  description?: string;
}

export interface ValuationFactor {
  name: string;
  impact: number;
  description?: string;
}
