
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

export interface DealerVehicleFormData {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  vin?: string;
  condition: string;
  transmission?: string;
  fuel_type?: string;
  fuelType?: string;
  bodyType?: string;
  color?: string;
  trim?: string;
  status: 'available' | 'pending' | 'sold';
  photos?: string[];
  zip_code?: string;
}

export interface DeleteVehicleResult {
  success: boolean;
  error?: string;
}

export type DealerVehicleStatus = 'available' | 'pending' | 'sold';

export type DealerInventoryItem = DealerVehicle;
