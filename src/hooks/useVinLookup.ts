
import { useState, useCallback } from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';

export const useVinLookup = () => {
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupVin = useCallback(async (vin: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock VIN lookup
      const mockData: DecodedVehicleInfo = {
        make: 'Honda',
        model: 'Civic',
        year: 2019,
        trim: 'LX',
        bodyType: 'Sedan',
        fuelType: 'Gasoline',
        transmission: 'CVT',
        engine: '2.0L I4',
        color: 'Blue',
        vin: vin
      };
      
      setVehicleInfo(mockData);
      return mockData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'VIN lookup failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    vehicleInfo,
    isLoading,
    error,
    lookupVin,
    clearData: () => {
      setVehicleInfo(null);
      setError(null);
    }
  };
};
