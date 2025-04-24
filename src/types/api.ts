
import { PlateLookupInfo } from './lookup';

export interface VinDecoderResponse {
  data?: DecodedVehicleInfo;
  error?: string;
}

export interface DecodedVehicleInfo {
  vin: string;
  make: string | null;
  model: string | null;
  year: number | null;
  trim: string | null;
  engine: string | null;
  transmission: string | null;
  drivetrain: string | null;
  bodyType: string | null;
  timestamp?: string;
}

export interface PlateLookupResponse {
  data?: PlateLookupInfo;
  error?: string;
}
