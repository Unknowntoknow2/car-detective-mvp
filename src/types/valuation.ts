
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
}

export interface ValuationResult {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode?: string;
  estimatedValue: number;
  confidenceScore: number;
  basePrice?: number;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  priceRange?: [number, number];
  features?: string[];
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  bodyStyle?: string;
  createdAt?: string;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    summary: string;
  };
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
