
export interface DecodedVehicleInfo {
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  engine?: string;
  color?: string;
  zipCode?: string;
  vin?: string;
}

export interface PlateLookupInfo extends DecodedVehicleInfo {
  plate: string;
  state: string;
  estimatedValue?: number;
  registration?: {
    expires: string;
    status: string;
  };
}
