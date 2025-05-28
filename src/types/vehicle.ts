
export interface DecodedVehicleInfo {
  vin?: string;
  plate?: string;
  state?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  bodyType?: string;
  fuelType?: string;
  drivetrain?: string;
  exteriorColor?: string;
  interiorColor?: string;
  doors?: string;
  seats?: string;
  displacement?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  mileage?: number;
  condition?: string;
  valuationId?: string;
  
  // Enhanced photo support
  photos?: string[];
  primaryPhoto?: string;
  
  // Additional properties that were missing
  features?: string[];
  color?: string;
  zipCode?: string;
}

export interface DealerInventoryItem {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  vin: string;
  status: 'available' | 'pending' | 'sold';
  photos?: string[];
  createdAt: string;
  condition?: string;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  color?: string;
  trim?: string;
  dealer_id?: string;
  zip_code?: string;
  updated_at?: string;
}

export interface ValuationResponse {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition: string;
  estimatedValue: number;
  confidenceScore?: number;
  valuationId: string;
  zipCode?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  bodyStyle?: string;
  color?: string;
  accidents?: number;
  trim?: string;
  vin?: string;
  isPremium?: boolean;
  price_range?: {
    low: number;
    high: number;
  };
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    summary?: string;
  };
  userId?: string;
  [key: string]: any;
}
