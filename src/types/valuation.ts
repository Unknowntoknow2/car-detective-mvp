export interface ValuationResult {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore?: number;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  explanation?: string;
  fuelType?: string;
  transmission?: string;
  bestPhotoUrl?: string;
  photoScore?: number;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected?: string[];
    summary?: string;
  } | null;
  priceRange?: [number, number];
  isPremium?: boolean;
  pdfUrl?: string;
  gptExplanation?: string;
  vin?: string;
  features?: string[];
  // Additional fields to match database column names
  fuel_type?: string;
  photo_url?: string;
  zip?: string;
  created_at?: string; // Add this to match MyValuationsPage usage
  premium_unlocked?: boolean; // Add premium_unlocked field
}

export interface ValuationResultProps {
  valuationId?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  location?: string;
  valuation?: number;
  isManualValuation?: boolean;
  features?: string[];
}

export interface ValuationInput {
  identifierType?: 'vin' | 'plate' | 'manual' | 'photo';
  vin?: string;
  plate?: string;
  state?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  zipCode: string; // Make required to match expectation in buildValuationReport
  bodyType?: string;
  trim?: string;
  transmission?: string;
  fuelType?: string;
  accidentCount?: number;
  photos?: File[];
  features?: string[];
  mpg?: number | null;
  userId?: string;
  valuationId?: string;
  isPremium?: boolean;
  isTestMode?: boolean;
  notifyDealers?: boolean;
  baseMarketValue?: number; // Add this property for compatibility
  aiConditionOverride?: any; // Add this property for AI condition
}

export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
  factor: string;
  impact: number;
  adjustment?: number;
  impactPercentage?: number;
}
