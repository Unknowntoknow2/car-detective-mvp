
export interface DecodedVehicleInfo {
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodyType?: string;
  engine?: string;
  fuelType?: string;
  transmission?: string;
  vin?: string;
  exteriorColor?: string;
  interiorColor?: string;
  drivetrain?: string;
  features?: string[];
  // Add required properties to resolve errors
  mileage?: number;
  condition?: string;
  zipCode?: string;
  color?: string;
}

export interface VehicleDetails extends DecodedVehicleInfo {
  mileage?: number;
  condition?: string;
  price?: number;
  zipCode?: string;
  state?: string;
}

export interface ValuationResponse {
  estimatedValue: number;
  confidenceScore: number;
  conditionScore?: number;
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage?: number;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  color?: string;
  // Add aliases for backward compatibility
  estimated_value?: number;
  confidence_score?: number;
  price_range?: { low: number; high: number } | [number, number];
}

export interface VinDecoderResponse {
  success: boolean;
  data?: DecodedVehicleInfo;
  error?: string;
}

export interface PlateLookupResponse {
  success: boolean;
  data?: {
    make: string;
    model: string;
    year: number;
    color?: string;
    vin?: string;
  };
  error?: string;
}

export interface ManualValuationResponse {
  success: boolean;
  data?: ValuationResponse;
  error?: string;
}

// Update the DealerInventoryItem interface
export interface DealerInventoryItem {
  id: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  condition: string;
  listingPrice: number;
  sellingPrice?: number;
  status: string;
  mileage?: number;
  price?: number; // For backward compatibility
}

// Update the DealerVehicleFormData interface
export interface DealerVehicleFormData {
  make: string;
  model: string;
  year: number;
  trim?: string;
  condition: string;
  price: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  zipCode?: string;
  photos?: string[] | File[];
  status?: string;
  color?: string;
  description?: string;
}
