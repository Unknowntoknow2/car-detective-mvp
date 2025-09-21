
import { UnifiedVehicleData } from "@/types/unified-lookup";
import { UnifiedLookupService } from "./UnifiedLookupService";

// Legacy service - now redirects to unified service
export class VinLookupService {
  static lookupVin = async (vin: string): Promise<any> => {
    const result = await UnifiedLookupService.lookupByVin(vin, { tier: 'free' });
    return { success: result.success, data: result.vehicle };
  };

  static startPremiumValuation = (vehicleData: UnifiedVehicleData): void => {
    return UnifiedLookupService.startPremiumValuation(vehicleData);
  };
}

// Export the unified interface as well for new code
export { UnifiedLookupService };

// Legacy exports for backward compatibility
export interface VinServiceResponse {
  success: boolean;
  data?: UnifiedVehicleData;
  error?: string;
  vin: string;
}

export const vinService = {
  async decodeVin(vin: string): Promise<VinServiceResponse> {
    const result = await UnifiedLookupService.lookupByVin(vin, { tier: 'free' });
    return {
      success: result.success,
      vin,
      data: result.vehicle,
      error: result.error
    };
  }
};

export const decodeVin = vinService.decodeVin;
export default vinService;
