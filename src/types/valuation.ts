
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
  identifierType: 'vin' | 'plate' | 'manual' | 'photo';
  vin?: string;
  plate?: string;
  state?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  zipCode?: string;
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
}

export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
  factor?: string;
  impact?: number;
  adjustment?: number;
  impactPercentage?: number;
}
