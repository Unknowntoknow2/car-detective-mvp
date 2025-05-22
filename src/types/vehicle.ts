
export interface DecodedVehicleInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodyType?: string;
  fuelType?: string;
  color?: string;
  exteriorColor?: string; 
  interiorColor?: string;
  features?: string[];
  mileage?: number;
  valuationId?: string;
  status?: 'active' | 'sold' | 'pending' | 'draft' | 'available';
  listingPrice?: number;
}

export interface VinDecoderResponse {
  success: boolean;
  data?: DecodedVehicleInfo;
  error?: string;
}

export interface PlateLookupResponse {
  success: boolean;
  data?: DecodedVehicleInfo;
  error?: string;
}

export interface ValuationResponse {
  estimatedValue: number;
  confidenceScore: number;
  valuationId: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  vin?: string;
  plate?: string;
  state?: string;
  zipCode?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  trim?: string;
  color?: string;
  price_range?: any;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}

export interface VehicleIdentifier {
  type: 'vin' | 'plate' | 'manual';
  value: string;
  state?: string;
}

export interface DealerInventoryItem {
  id: string;
  dealerId: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  price: number;
  listingPrice?: number;
  mileage: number;
  condition: string;
  exteriorColor?: string;
  interiorColor?: string;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  features?: string[];
  photos?: string[];
  created_at?: string;
  updated_at?: string;
  description?: string;
  listingUrl?: string;
  status?: 'active' | 'sold' | 'pending' | 'draft' | 'available';
}
