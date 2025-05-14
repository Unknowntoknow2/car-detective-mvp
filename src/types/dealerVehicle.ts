
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
  photos?: string[]; // Added photos property as an optional array of strings
}

export interface DealerVehicleFormData {
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  price: number;
  status: DealerVehicleStatus;
}
