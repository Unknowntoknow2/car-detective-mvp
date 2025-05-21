
export interface ValuationInput {
  identifierType: 'vin' | 'plate' | 'manual';
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  vin?: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  features?: string[];
  hasAccident?: boolean | string;
  accidentDescription?: string;
}

export interface ValuationResult {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode?: string;
  zip_code?: string; // For backward compatibility
  zip?: string; // For backward compatibility
  estimatedValue: number;
  estimated_value?: number; // For backward compatibility
  confidenceScore: number;
  confidence_score?: number; // For backward compatibility
  basePrice?: number;
  base_price?: number; // For backward compatibility
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  priceRange?: [number, number];
  price_range?: [number, number]; // For backward compatibility
  features?: string[];
  fuelType?: string;
  fuel_type?: string; // For backward compatibility
  transmission?: string;
  bodyType?: string;
  body_type?: string; // For backward compatibility
  bodyStyle?: string;
  body_style?: string; // For backward compatibility
  createdAt?: string;
  created_at?: string; // For backward compatibility
  pdfUrl?: string; // Added for PDF downloads
  gptExplanation?: string; // Added for AI explanations
  explanation?: string; // Alternative field for explanations
  bestPhotoUrl?: string; // For photo-based valuations
  photo_url?: string; // For backward compatibility
  photoScore?: number; // Added for photo scoring
  vin?: string; // Vehicle identification number
  trim?: string; // Vehicle trim
  color?: string; // Vehicle color
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    summary: string;
  };
  isPremium?: boolean; // Added for premium status
  premium_unlocked?: boolean; // For backward compatibility
}

export interface RulesEngineInput {
  baseValue: number;
  basePrice: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  zipCode?: string;
  photoScore?: number;
  accidentCount?: number;
  premiumFeatures?: string[];
  mpg?: number;
  aiConditionData?: any;
  exteriorColor?: string;
  colorMultiplier?: number;
  saleDate?: string;
  bodyStyle?: string;
  carfaxData?: any;
}
