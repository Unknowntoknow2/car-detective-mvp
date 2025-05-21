export interface ValuationResult {
  id: string;
  vin?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  body_type?: string;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  zip_code?: string; // For backward compatibility
  estimatedValue?: number;
  estimated_value?: number;
  accident_count?: number;
  manual_entry?: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Updated properties
  confidenceScore?: number;
  confidence_score?: number;
  features?: string[];
  pdfUrl?: string;
  pdf_url?: string; // For backward compatibility
  gptExplanation?: string;
  explanation?: string;
  price_range?: any;
  priceRange?: any;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  photoUrl?: string;
  photo_url?: string;
  isPremium?: boolean;
  premium_unlocked?: boolean;
  basePrice?: number;
  base_price?: number;
  photoScore?: number;
  bestPhotoUrl?: string;
  valuationId?: string;
  userId?: string; // Added userId
  aiCondition?: { // Added aiCondition type
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    summary?: string;
    aiSummary?: string;
  } | null;
  priceRange?: [number, number];
  isPremium?: boolean;
  pdfUrl?: string;
  gptExplanation?: string;
  vin?: string;
  features?: string[];
  color?: string;
  bodyType?: string;
  bodyStyle?: string;
  trim?: string;
  // Additional fields to match database column names
  fuel_type?: string;
  photo_url?: string;
  zip?: string;
  created_at?: string; 
  createdAt?: string; // Add this for compatibility
  premium_unlocked?: boolean; // Add this property for premium features
  accident_count?: number; // Add this property for compatibility
  titleStatus?: string; // Add this property for compatibility
}

export interface ValuationResponse {
  success: boolean;
  data?: ValuationResult;
  message?: string;
  error?: any;
}
