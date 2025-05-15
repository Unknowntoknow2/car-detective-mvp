
export type DealerVehicleStatus = 'available' | 'sold' | 'pending';

export interface DealerVehicle {
  id: string;
  dealer_id: string;
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  price: number;
  status: DealerVehicleStatus;
  created_at: string;
  updated_at: string;
  photos?: string[]; 
  condition?: string;
  fuel_type?: string | null;
  transmission?: string | null;
  zip_code?: string | null;
  description?: string;
  vin?: string;
  color?: string;
  vehicleId?: string;
  features?: string[];
}

export interface DealerVehicleFormData {
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  price: number;
  status: DealerVehicleStatus;
  photos?: string[];
  condition?: string;
  fuel_type?: string | null;
  transmission?: string | null;
  zip_code?: string | null;
  description?: string;
  vin?: string;
  color?: string;
  vehicleId?: string;
  features?: string[];
}
