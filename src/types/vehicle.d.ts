
export interface DealerInventoryItem {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  status: string;
  photos: string[]; 
  vin: string;
  description?: string;
  trim?: string;
  bodyType?: string;
  color?: string;
  fuelType?: string;
  transmission?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DecodedVehicleInfo {
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodyType?: string;
  color?: string;
  fuelType?: string;
}

export interface VehicleValuation {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  estimatedValue: number;
  confidenceScore: number;
  createdAt: string;
  isPremium?: boolean;
}
