
import { useState } from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { fetchVehicleByVin, fetchVehicleByPlate } from '@/services/vehicleLookupService';
import { toast } from 'sonner';

interface UseVinLookupResult {
  isLoading: boolean;
  error: string | null;
  vehicle: DecodedVehicleInfo | null;
  lookupByVin: (vin: string) => Promise<DecodedVehicleInfo | null>;
  lookupByPlate: (plate: string, state: string) => Promise<DecodedVehicleInfo | null>;
  lookupVehicle: (type: string, id: string, additionalData?: any, manualData?: any) => void;
  reset: () => void;
}

export const useVinLookup = (): UseVinLookupResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<DecodedVehicleInfo | null>(null);
  
  const reset = () => {
    setVehicle(null);
    setError(null);
  };
  
  const lookupByVin = async (vin: string): Promise<DecodedVehicleInfo | null> => {
    console.log('🔍 Real VIN lookup started for:', vin);
    setIsLoading(true);
    setError(null);
    setVehicle(null);
    
    try {
      const result = await fetchVehicleByVin(vin);
      
      if (!result.make || !result.model || !result.year) {
        throw new Error('Incomplete vehicle data received from VIN decode');
      }
      
      console.log('✅ Real VIN lookup successful:', result);
      setVehicle(result);
      toast.success(`Vehicle found: ${result.year} ${result.make} ${result.model}`);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'VIN lookup failed';
      console.error('❌ VIN lookup error:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const lookupByPlate = async (plate: string, state: string): Promise<DecodedVehicleInfo | null> => {
    console.log('🔍 Real plate lookup started for:', plate, state);
    setIsLoading(true);
    setError(null);
    setVehicle(null);
    
    try {
      const result = await fetchVehicleByPlate(plate, state);
      
      if (!result.make || !result.model || !result.year) {
        throw new Error('Incomplete vehicle data received from plate lookup');
      }
      
      console.log('✅ Real plate lookup successful:', result);
      setVehicle(result);
      toast.success(`Vehicle found: ${result.year} ${result.make} ${result.model}`);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'License plate lookup failed';
      console.error('❌ Plate lookup error:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const lookupVehicle = (type: string, id: string, additionalData?: any, manualData?: any) => {
    if (manualData) {
      // Only allow manual entry if user explicitly provides complete data
      const requiredFields = ['make', 'model', 'year'];
      const missingFields = requiredFields.filter(field => !manualData[field]);
      
      if (missingFields.length > 0) {
        const errorMsg = `Manual entry requires: ${missingFields.join(', ')}`;
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      const manualVehicle: DecodedVehicleInfo = {
        make: manualData.make,
        model: manualData.model,
        year: Number(manualData.year),
        vin: manualData.vin || undefined,
        trim: manualData.trim || undefined,
        engine: manualData.engine || undefined,
        transmission: manualData.transmission || undefined,
        drivetrain: manualData.drivetrain || undefined,
        bodyType: manualData.bodyType || undefined,
        exteriorColor: manualData.color || undefined,
        fuelType: manualData.fuelType || undefined,
        // Only real photos allowed
        photos: []
      };
      
      console.log('✅ Manual vehicle entry accepted:', manualVehicle);
      setVehicle(manualVehicle);
      toast.success('Manual vehicle data accepted');
    }
  };
  
  return {
    isLoading,
    error,
    vehicle,
    lookupByVin,
    lookupByPlate,
    lookupVehicle,
    reset
  };
};
