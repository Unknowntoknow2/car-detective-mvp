
export interface VpicVehicleData {
  vin: string;
  make: string | null;
  model: string | null;
  modelYear: number | null;  // This is what's used instead of year
  year?: number;             // Adding this to fix compatibility issues
  vehicleType: string | null;
  bodyClass: string | null;
  driveType: string | null;
  fuelType: string | null;
  engineSize: number | null;
  engineCylinders: number | null;
  transmissionStyle: string | null;
  manufacturer: string | null;
  plantCountry: string | null;
  plantState: string | null;
  plantCity: string | null;
  errorCode: string | null;
  errorText: string | null;
  series: string | null;
  trim: string | null;
  doors: number | null;
  grossVehicleWeight: string | null;
  note: string | null;
  basePrice: string | null;
  steeringLocation: string | null;
}

export interface VpicResponse {
  data: VpicVehicleData;
  source: 'api' | 'cache';
  fetched_at: string;
}

export interface VpicError {
  error: string;
}
