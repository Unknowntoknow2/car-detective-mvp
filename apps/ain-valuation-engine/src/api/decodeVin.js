/**
 * Unified VIN decoding API endpoint
 * Uses the consolidated unifiedVinDecoder service
 * @deprecated Use decodeVin from unifiedVinDecoder.ts directly instead
 */
import { decodeVin as unifiedDecodeVin, extractLegacyVehicleInfo, isVinDecodeSuccessful } from '../services/unifiedVinDecoder';
/**
 * @deprecated Use decodeVin from unifiedVinDecoder.ts directly instead
 * This API wrapper is maintained for backward compatibility only
 */
export async function decodeVin(vin) {
    console.warn('⚠️ src/api/decodeVin.ts is DEPRECATED. Use unifiedVinDecoder.decodeVin directly.');
    try {
        const result = await unifiedDecodeVin(vin);
        if (!isVinDecodeSuccessful(result)) {
            throw new Error(result.metadata.errorText || 'VIN decode failed');
        }
        // Extract vehicle info for backward compatibility
        const vehicleInfo = extractLegacyVehicleInfo(result);
        return {
            success: true,
            data: vehicleInfo,
            raw: result.raw,
            metadata: result.metadata
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: null
        };
    }
}
