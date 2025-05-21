
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
  mileage?: number;
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
  vin?: string; // Added vin property
}

export interface DealerVehicleFormData {
  make: string;
  model: string;
  year: number;
  price?: number;
  mileage?: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  status: string;
  fuelType?: 'Gasoline' | 'Diesel' | 'Hybrid' | 'Electric';
  transmission?: 'Automatic' | 'Manual';
  color?: string;
  description?: string;
  vehicleId?: string;
  photos: File[];
  onSuccess?: () => void; // Add onSuccess prop
}

export enum DealerVehicleStatus {
  AVAILABLE = 'Available',
  SOLD = 'Sold',
  PENDING = 'Pending',
  RESERVED = 'Reserved'
}
