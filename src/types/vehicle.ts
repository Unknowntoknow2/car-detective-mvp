export interface DecodedVehicleInfo {
  make: string;              // human readable
  makeId: string;            // UUID from Supabase
  model: string;
  modelId?: string;          // optional for now
  year: number;
  trim?: string;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  mpg?: number | null;
  vin?: string;
}
