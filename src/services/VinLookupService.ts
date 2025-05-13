
import { DecodedVehicleInfo } from '@/types/vehicle';
import { decodeVin } from '@/services/vinService';
import { toast } from 'sonner';

export class VinLookupService {
  // Handles VIN lookup and stores results in localStorage for consistent experience
  static async lookupVin(vin: string): Promise<DecodedVehicleInfo | null> {
    try {
      console.log(`VIN LOOKUP SERVICE: Looking up VIN: ${vin}`);
      
      // Use the existing vinService to decode the VIN
      const result = await decodeVin(vin);
      
      if (result) {
        // Save to localStorage for reuse across the app
        localStorage.setItem('last_vin_lookup', JSON.stringify({
          timestamp: new Date().toISOString(),
          data: result
        }));
        
        console.log('VIN LOOKUP SERVICE: Successfully decoded VIN:', result);
        return result;
      }
      
      return null;
    } catch (error) {
      console.error('VIN LOOKUP SERVICE: Error looking up VIN:', error);
      toast.error('Error looking up VIN. Please try again.');
      return null;
    }
  }
  
  // Gets the cached VIN lookup result if available
  static getCachedVinLookup(): DecodedVehicleInfo | null {
    try {
      const cached = localStorage.getItem('last_vin_lookup');
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        
        // Check if the cache is still valid (less than 15 minutes old)
        const cacheTime = new Date(timestamp);
        const now = new Date();
        const diffMinutes = (now.getTime() - cacheTime.getTime()) / (1000 * 60);
        
        if (diffMinutes < 15) {
          console.log('VIN LOOKUP SERVICE: Using cached VIN result');
          return data;
        }
        
        console.log('VIN LOOKUP SERVICE: Cached VIN result expired');
      }
      
      return null;
    } catch (error) {
      console.error('VIN LOOKUP SERVICE: Error retrieving cached VIN lookup:', error);
      return null;
    }
  }
  
  // Transition from VIN lookup to premium valuation
  static startPremiumValuation(vinData: DecodedVehicleInfo): void {
    // Store the vehicle data for the premium valuation flow
    localStorage.setItem('premium_vehicle', JSON.stringify({
      identifierType: 'vin',
      identifier: vinData.vin,
      make: vinData.make,
      model: vinData.model,
      year: vinData.year,
      trim: vinData.trim || "Standard"
    }));
    
    console.log('VIN LOOKUP SERVICE: Stored vehicle data for premium valuation');
  }
}
