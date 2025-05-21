
export interface ValuationResult {
  id: string;
  // Support both naming conventions for backward compatibility
  make?: string;
  model?: string;
  year?: number;
  estimated_value?: number;
  estimatedValue?: number;
  confidence_score?: number;
  confidenceScore?: number;
  condition_score?: number;
  conditionScore?: number;
  mileage?: number;
  vin?: string;
  zip_code?: string;
  zipCode?: string;
  created_at?: string;
  premium_unlocked?: boolean;
  
  // Additional properties needed by components
  condition?: string;
  features?: string[];
  pdfUrl?: string;
  gptExplanation?: string;
  explanation?: string;
  trim?: string;
  color?: string;
  bodyType?: string;
  bodyStyle?: string;
  fuelType?: string;
  fuel_type?: string;
  transmission?: string;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  priceRange?: [number, number];
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: any[];
    summary: string;
    aiSummary?: string;
  };
  bestPhotoUrl?: string;
  photo_url?: string;
  zip?: string;
}
