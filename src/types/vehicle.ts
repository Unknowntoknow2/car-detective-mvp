
export type VehicleStatus = 'available' | 'sold' | 'pending';

export interface Vehicle {
  id: string;
  dealer_id?: string;
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  price: number;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
}

export interface VehicleFormData {
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  price: number;
  status: VehicleStatus;
}

export interface DecodedVehicleInfo {
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  trim?: string;
  bodyType?: string;
  bodyStyle?: string; // Adding this for compatibility
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  color?: string;
  mileage?: number;
  condition?: string;
  fuelType?: string;
  zipCode?: string;
}

// Dealer Vehicle Types - consolidated from dealerVehicle.ts and dealerVehicle.d.ts
export type DealerVehicleStatus = 'available' | 'sold' | 'pending';

export interface DealerVehicle {
  id: string;
  dealer_id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number | null;
  condition?: string;
  fuel_type?: string | null;
  transmission?: string | null;
  description?: string;
  status: DealerVehicleStatus;
  vin?: string;
  color?: string;
  zip_code?: string | null;
  created_at: string;
  updated_at?: string;
  features?: string[];
  photos?: string[];
  vehicleId?: string; // For backward compatibility
}

export interface DealerVehicleFormData {
  vehicleId?: string; // Used for updates, optional for new vehicles
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number | null;
  condition?: string;
  fuel_type?: string | null;
  transmission?: string | null;
  description?: string;
  status: DealerVehicleStatus;
  vin?: string;
  color?: string;
  zip_code?: string | null;
  features?: string[];
  photos?: string[];
}
