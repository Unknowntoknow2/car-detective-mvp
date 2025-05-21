
export interface DecodedVehicleInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodyType?: string;
  fuelType?: string;
}

export interface VehicleInfo {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  price?: number;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  vin?: string;
  description?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FoundCarCardProps {
  year: number;
  make: string;
  model: string;
  trim?: string;
  engine?: string;
}
