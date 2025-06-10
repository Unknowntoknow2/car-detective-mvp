
export interface DealerVehicle {
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

export interface DecodedVehicleInfo {
  make: string;
  model: string;
  year: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  bodyType?: string;
  fuelType?: string;
  vin: string;
  drivetrain?: string;
}

export interface VehicleTrim {
  id: string;
  trim_name: string;
}

export interface DealerVehicleFormData {
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  price: number;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  status: "available" | "pending" | "sold";
  photos: string[];
  transmission?: "Automatic" | "Manual";
  fuel_type?: "Gasoline" | "Diesel" | "Hybrid" | "Electric";
  zip_code?: string;
  description?: string;
  vin?: string;
}

export type DealerVehicleStatus = 'available' | 'pending' | 'sold';

export interface DeleteVehicleResult {
  success: boolean;
  error?: string;
}

export type DealerInventoryItem = DealerVehicle;
