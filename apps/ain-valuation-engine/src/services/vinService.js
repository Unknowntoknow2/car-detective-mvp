import { decodeVin, extractVehicleInfo, isVinDecodeSuccessful } from './unifiedVinDecoder';

// Updated VIN service using unified decoder
export async function decodeVIN(vin) {
    try {
        const result = await decodeVin(vin);
        
        if (!isVinDecodeSuccessful(result)) {
            throw new Error('VIN decode failed: ' + result.metadata.errorText);
        }
        
        const vehicleInfo = extractVehicleInfo(result);
        
        // Return legacy format for backward compatibility
        return { 
            year: vehicleInfo.modelYear,
            make: vehicleInfo.make,
            model: vehicleInfo.model,
            trim: vehicleInfo.trim,
            // Include full vehicle info for enhanced usage
            ...vehicleInfo
        };
    } catch (error) {
        console.error('VIN decode failed:', error);
        throw error;
    }
}
