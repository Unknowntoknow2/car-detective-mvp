// src/types/vehicle.ts

<<<<<<< HEAD
=======
// ---- Global Vehicle Status Type ----
>>>>>>> 1f281f57 (Save local changes before pull)
export type VehicleStatus = 'available' | 'sold' | 'pending';

// ---- Marketplace Vehicle Table (DB) ----
export interface Vehicle {
  id: string;
  dealer_id?: string;
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  price: number;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
}

// ---- Marketplace Vehicle Creation/Edit Form ----
export interface VehicleFormData {
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  price: number;
  status: VehicleStatus;
}

// ---- Decoded Vehicle Info (for VIN, Plate, Manual) ----
export interface DecodedVehicleInfo {
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  trim?: string;
<<<<<<< HEAD
  bodyType?: string;
  bodyStyle?: string; // Adding this for compatibility
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  color?: string;
  mileage?: number;
  condition?: string;
  fuelType?: string;
  zipCode?: string;
=======
  bodyType?: string;        // "Sedan", "SUV", etc
  engine?: string;          // "2.5L I4", "V6", etc
  transmission?: string;    // "Automatic", "CVT", etc
  drivetrain?: string;      // "FWD", "AWD", etc
  color?: string;           // Main/primary color
  mileage?: number;         // Optionally pulled from odometer reading
  condition?: string;       // "Excellent", "Good", etc
  fuelType?: string;        // "Gasoline", "Electric", etc
  zipCode?: string;         // User's zip/location
>>>>>>> 1f281f57 (Save local changes before pull)
}

// Dealer Vehicle Types - consolidated from dealerVehicle.ts and dealerVehicle.d.ts
export type DealerVehicleStatus = 'available' | 'sold' | 'pending';

export interface DealerVehicle {
  id: string;
  dealer_id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number | null;
  condition?: string;
  fuel_type?: string | null;
  transmission?: string | null;
  description?: string;
  status: DealerVehicleStatus;
  vin?: string;
  color?: string;
  zip_code?: string | null;
  created_at: string;
  updated_at?: string;
  features?: string[];
  photos?: string[];
  vehicleId?: string; // For backward compatibility
}

export interface DealerVehicleFormData {
  vehicleId?: string; // Used for updates, optional for new vehicles
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number | null;
  condition?: string;
  fuel_type?: string | null;
  transmission?: string | null;
  description?: string;
  status: DealerVehicleStatus;
  vin?: string;
  color?: string;
  zip_code?: string | null;
  features?: string[];
  photos?: string[];
}
