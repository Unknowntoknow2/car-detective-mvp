export interface ValuationResult {
  id: string;
  vin?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  estimatedValue?: number;
  accident_count?: number;
  titleStatus?: string;
  manual_entry?: boolean;
  created_at?: string;
  updated_at?: string;

  confidenceScore?: number;
  features?: string[];
  pdfUrl?: string;
  gptExplanation?: string;
  priceRange?: [number, number];
  adjustments?: Array<{ factor: string; impact: number; description?: string }>;
  photoUrl?: string;
  isPremium?: boolean;
  premium_unlocked?: boolean;
  basePrice?: number;
  photoScore?: number;
  bestPhotoUrl?: string;
  valuationId?: string;
  userId?: string;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    summary?: string;
    aiSummary?: string;
  } | null;
}

<<<<<<< HEAD
export interface ValuationResponse {
  success: boolean;
  data?: ValuationResult;
  message?: string;
  error?: any;
=======
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
  color?: string; // Added for compatibility with other usages
}

export interface ValuationInput {
  identifierType?: "vin" | "plate" | "manual" | "photo";
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
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}
