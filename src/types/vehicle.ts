
export interface DecodedVehicleInfo {
  vin?: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodyType?: string;
  fuelType?: string;
  exteriorColor?: string;
  interiorColor?: string;
  color?: string;
  features?: string[];
  photos?: string[];
  estimatedValue?: number;
  confidenceScore?: number;
  valuationId?: string;
  // Additional properties for compatibility
  primaryPhoto?: string;
  seats?: number;
  condition?: string;
  zipCode?: string;
}

export interface VehicleSearchResult {
  id: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodyType?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
  estimatedValue?: number;
}

export interface VehiclePhoto {
  id: string;
  url: string;
  caption?: string;
  type: 'exterior' | 'interior' | 'engine' | 'other';
}

export interface VehicleFeature {
  id: string;
  name: string;
  category: string;
  valueImpact: number;
}

export interface DealerInventoryItem {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  vin: string;
  status: 'available' | 'sold' | 'pending';
  condition?: string;
  photos?: string[];
  created_at?: string;
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
  adjustments?: any[];
  aiCondition?: any;
  userId?: string;
  [key: string]: any;
}
