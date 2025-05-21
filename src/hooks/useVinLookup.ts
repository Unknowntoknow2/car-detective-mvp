
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
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate API response with mock data
      const mockData: DecodedVehicleInfo = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        vin: vin,
        trim: 'LE',
        engine: '2.5L I4',
        transmission: 'Automatic',
        drivetrain: 'FWD',
        bodyType: 'Sedan',
        exteriorColor: 'Silver',
        fuelType: 'Gasoline',
        features: ['bluetooth', 'backup_camera', 'alloy_wheels']
      };
      
      setVehicle(mockData);
      return mockData;
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
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate API response with mock data
      const mockData: DecodedVehicleInfo = {
        make: 'Honda',
        model: 'Accord',
        year: 2019,
        vin: 'ABC123' + plate.substring(0, 4) + state.substring(0, 2),
        trim: 'EX',
        engine: '1.5L Turbo',
        transmission: 'CVT',
        drivetrain: 'FWD',
        bodyType: 'Sedan',
        exteriorColor: 'Blue',
        fuelType: 'Gasoline',
        features: ['sunroof', 'lane_assist', 'heated_seats']
      };
      
      setVehicle(mockData);
      return mockData;
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
