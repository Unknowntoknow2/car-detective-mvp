
export interface DecodedVehicleInfo {
  make: string;
  model: string;
  year: number;
  vin: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodyType?: string;
  exteriorColor?: string;
  color?: string; // Adding color property for compatibility
  fuelType?: string;
  features?: string[];
  condition?: string; 
  zipCode?: string; 
  mileage?: number;
  valuationId?: string;
  interiorColor?: string;
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
  price_range?: {
    low: number;
    high: number;
  };
  [key: string]: any;
}

// Renamed to avoid conflict with the interface in vehicle.d.ts
export interface DealerVehicleItem {
  id: string;
  dealerId: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  listingPrice: number;
  price: number;
  condition: string;
  mileage: number;
  status: 'available' | 'pending' | 'sold';
  trim?: string;
  exteriorColor?: string;
  interiorColor?: string;
  transmission?: string;
  drivetrain?: string;
  fuelType?: string;
  bodyType?: string;
  features?: string[];
  images?: string[];
  description?: string;
}
