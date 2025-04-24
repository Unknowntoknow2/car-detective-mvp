
import { DecodedVehicleInfo } from './vehicle';
import { PlateLookupInfo } from './lookup';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export type VinDecoderResponse = ApiResponse<DecodedVehicleInfo>;
export type PlateLookupResponse = ApiResponse<PlateLookupInfo>;
