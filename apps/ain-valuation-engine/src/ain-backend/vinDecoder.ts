import { decodeVin, extractLegacyVehicleInfo, isVinDecodeSuccessful } from '../services/unifiedVinDecoder.js';

export async function decodeVIN(vin: string) {
  const result = await decodeVin(vin);
  
  if (!isVinDecodeSuccessful(result)) {
    return [];
  }
  
  // Return in legacy array format for backward compatibility
  const legacyData = extractLegacyVehicleInfo(result);
  return [legacyData];
}
