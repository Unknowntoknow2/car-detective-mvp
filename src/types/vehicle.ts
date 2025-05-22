
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
  exteriorColor?: string; // Add missing property
  interiorColor?: string;
  features?: string[];
  mileage?: number; // Add missing property
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
  price_range?: any; // Add missing property
}

export interface VehicleIdentifier {
  type: 'vin' | 'plate' | 'manual';
  value: string;
  state?: string;
}

// Add DealerInventoryItem for missing type import
export interface DealerInventoryItem {
  id: string;
  dealerId: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  price: number;
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
  status?: 'active' | 'sold' | 'pending' | 'draft';
}
