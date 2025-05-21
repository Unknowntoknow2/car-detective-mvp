
export interface DealerVehicle {
  id: string;
  dealer_id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  status: "available" | "pending" | "sold";
  photos?: string[];
  transmission?: "Automatic" | "Manual" | "CVT";
  fuel_type?: "Gasoline" | "Diesel" | "Hybrid" | "Electric";
  zip_code?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  vin?: string;
}

export type DealerVehicleStatus = "available" | "pending" | "sold";

export interface DealerVehicleFormData {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number | null;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  status: "available" | "pending" | "sold";
  photos?: string[];
  transmission?: "Automatic" | "Manual" | "CVT";
  fuel_type?: "Gasoline" | "Diesel" | "Hybrid" | "Electric";
  zip_code?: string;
  description?: string;
  vin?: string;
}

export interface DeleteVehicleResult {
  success: boolean;
  error?: string;
}
