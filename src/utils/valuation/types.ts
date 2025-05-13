
// Define the base ValuationAdjustment interface
export interface ValuationAdjustment {
  factor: string;
  impact: number;
  description: string; // Making description required
  name?: string;
  value?: number;
  percentAdjustment?: number;
  adjustment?: number; // Add this property
  impactPercentage?: number;
}

// Define ValuationParams interface
export interface ValuationParams {
  baseMarketValue?: number;
  mileage?: number;
  condition?: string;
  zipCode: string;
  features?: string[];
  make?: string;
  model?: string;
  year?: number;
  vehicleYear?: number; // Added vehicleYear property for compatibility
  accidentCount?: number;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  titleStatus?: string;
  exteriorColor?: string;
  colorMultiplier?: number;
  saleDate?: string;
  mpg?: number;
  aiConditionOverride?: any; // Added aiConditionOverride property
  photoScore?: number; // Added photoScore property to fix the error
}

// Define ValuationResult interface
export interface ValuationResult {
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  basePrice?: number;
  baseValue?: number;
  finalValue?: number;
  adjustments: ValuationAdjustment[];
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  vin?: string;
  isPremium?: boolean;
  features?: string[];
  color?: string;
  bodyStyle?: string;
  bodyType?: string;
  fuelType?: string;
  explanation?: string;
  transmission?: string;
  bestPhotoUrl?: string;
  photoScore?: number;
  photoExplanation?: string;
}

// Define EnhancedValuationParams interface
export interface EnhancedValuationParams extends ValuationParams {
  identifierType?: 'vin' | 'plate' | 'manual' | 'photo';
  vin?: string;
  plate?: string;
  state?: string;
  photos?: File[];
  userId?: string;
  valuationId?: string;
  isPremium?: boolean;
  isTestMode?: boolean;
  notifyDealers?: boolean;
  aiConditionData?: any;
  aiConditionOverride?: any;
  photoScore?: number;
  premiumFeatures?: string[];
  zip?: string;
  carfaxData?: any;
  accidentDescription?: string;
}

// Define FinalValuationResult interface
export interface FinalValuationResult extends ValuationResult {
  baseValue: number;
  finalValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  estimatedValue: number;
  explanation?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  features?: string[];
  pdfUrl?: string; // Add pdfUrl property for test files
  aiCondition?: any; // Add aiCondition property for test files
}

// Define ValuationInput interface for compatibility
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
  zipCode: string;
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
  baseMarketValue?: number;
  aiConditionOverride?: any;
}
