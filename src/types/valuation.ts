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

export interface ValuationResponse {
  success: boolean;
  data?: ValuationResult;
  message?: string;
  error?: any;
}
