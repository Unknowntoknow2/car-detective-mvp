

export type VehicleStatus = 'available' | 'sold' | 'pending';

export interface Vehicle {
  id: string;
  dealer_id: string;
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
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  color?: string;
  mileage?: number;
  condition?: string;
}
