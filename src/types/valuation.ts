
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
  isPremium?: boolean;
  
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

export interface ValuationInput {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  vin?: string;
  zipCode: string;
  features?: string[];
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  color?: string;
  trim?: string;
  hasAccident?: boolean | 'yes' | 'no';
  isPremium?: boolean;
}

export interface RulesEngineInput {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  baseValue: number;
  features: string[];
  carfaxData?: any;
  [key: string]: any;
}

export type ValuationStep = 
  | 'vehicle-input'
  | 'condition'
  | 'photos'
  | 'features'
  | 'location'
  | 'result';

export interface ConditionValues {
  exteriorBody: number;
  exteriorPaint: number;
  interiorSeats: number;
  interiorDashboard: number;
  mechanicalEngine: number;
  mechanicalTransmission: number;
  tires: number;
  accidents: number;
  mileage: number;
  year: number;
  titleStatus: string;
}
