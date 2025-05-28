
import { useState } from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';

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
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock decoded data
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result: DecodedVehicleInfo = {
        vin,
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        trim: 'LE',
        engine: '2.5L I4',
        transmission: 'Automatic',
        drivetrain: 'FWD',
        bodyType: 'Sedan',
        exteriorColor: 'Silver',
        color: 'Silver',
        fuelType: 'Gasoline',
        features: ['bluetooth', 'backup_camera', 'alloy_wheels'],
        estimatedValue: 25000,
        confidenceScore: 85,
        valuationId: `vin-${Date.now()}`
      };
      
      setVehicle(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to lookup VIN';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const lookupByPlate = async (plate: string, state: string): Promise<DecodedVehicleInfo | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock decoded data
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result: DecodedVehicleInfo = {
        vin: `PLATE-${plate}-${state}`,
        make: 'Honda',
        model: 'Accord',
        year: 2019,
        trim: 'EX',
        engine: '1.5L Turbo',
        transmission: 'CVT',
        drivetrain: 'FWD',
        bodyType: 'Sedan',
        exteriorColor: 'Blue',
        color: 'Blue',
        fuelType: 'Gasoline',
        features: ['sunroof', 'lane_assist', 'heated_seats'],
        estimatedValue: 23000,
        confidenceScore: 80,
        valuationId: `plate-${Date.now()}`
      };
      
      setVehicle(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to lookup license plate';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const lookupVehicle = (type: string, id: string, additionalData?: any, manualData?: any) => {
    if (manualData) {
      // Create a vehicle object from manual data
      const manualVehicle: DecodedVehicleInfo = {
        make: manualData.make || '',
        model: manualData.model || '',
        year: Number(manualData.year) || new Date().getFullYear(),
        vin: manualData.vin || '',
        trim: manualData.trim || '',
        engine: manualData.engine || '',
        transmission: manualData.transmission || '',
        drivetrain: manualData.drivetrain || '',
        bodyType: manualData.bodyType || '',
        exteriorColor: manualData.color || '',
        color: manualData.color || '',
        fuelType: manualData.fuelType || '',
        features: manualData.features || []
      };
      
      setVehicle(manualVehicle);
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
