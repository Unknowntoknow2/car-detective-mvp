
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
  fuelType?: string;
  features?: string[];
  mpg?: string;
  msrp?: number;
  zipCode?: string;
  mileage?: number;
  color?: string;
}

export interface VehicleDTO {
  id?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  condition?: string;
  sellingPrice?: number;
  listingPrice?: number;
  vin?: string;
  color?: string;
  dealerId?: string;
  photos?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface DealerInventoryItem extends VehicleDTO {
  id: string;
  status: 'available' | 'pending' | 'sold';
}

export type ConditionLevel = 'excellent' | 'good' | 'fair' | 'poor';

export interface DealerVehicleFormData {
  make: string;
  model: string;
  year: number;
  condition: string;
  status: string;
  price?: number;
  mileage?: number;
  color?: string;
  vehicleId?: string;
  photos?: File[];
  fuelType?: string;
  transmission?: string;
  description?: string;
  zipCode?: string;
}

export interface ManualVehicleInfo {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  trim?: string;
  // Replace makeId and modelId with proper fields
  features?: string[];
}

export interface PlateLookupInfo {
  plate: string;
  state: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
}
