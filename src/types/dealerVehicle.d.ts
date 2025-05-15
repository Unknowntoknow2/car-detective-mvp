
// Dealer Vehicle Types
export type DealerVehicleStatus = 'available' | 'pending' | 'sold';

export interface DealerVehicle {
  id: string;
  dealer_id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: string;
  fuel_type: string;
  transmission: string;
  description: string;
  status: DealerVehicleStatus;
  vin: string;
  color: string;
  zip_code: string;
  created_at: string;
  features: string[];
  photos: string[];
}

export interface DealerVehicleFormData {
  vehicleId?: string; // Used for updates, optional for new vehicles
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: string;
  fuel_type: string;
  transmission: string;
  description: string;
  status: DealerVehicleStatus;
  vin: string;
  color: string;
  zip_code: string;
  features: string[];
  photos: string[];
}
