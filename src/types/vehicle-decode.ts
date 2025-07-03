
import type { DecodedVehicleInfo } from './vehicle';

// Re-export for backward compatibility
export type { DecodedVehicleInfo };

export interface VehicleDecodeResponse {
  success: boolean;
  vin: string;
  source: 'nhtsa' | 'autoapi' | 'cache' | 'failed';
  decoded?: DecodedVehicleInfo;
  error?: string;
}
