export interface DealerVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  condition: string;
  zip_code: string;
  dealer_id: string;
  created_at: string;
  updated_at: string;
}

export interface DealerVehicleFormData {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  price: number;
  condition: string;
  transmission?: string;
  fuel_type?: string;
  zip_code?: string;
  photos?: string[];
}
