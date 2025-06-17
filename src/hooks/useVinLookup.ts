
import { useState, useCallback } from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';

export const useVinLookup = () => {
  const [decodedInfo, setDecodedInfo] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupVin = useCallback(async (vin: string): Promise<DecodedVehicleInfo | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock VIN lookup logic
      const mockData: DecodedVehicleInfo = {
        vin,
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        trim: 'Sport',
        bodyType: 'Sedan',
        fuelType: 'Gasoline',
        transmission: 'CVT',
        engine: '2.0L I4',
        color: 'Blue',
        exteriorColor: 'Blue'
      };
      
      setDecodedInfo(mockData);
      return mockData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'VIN lookup failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    decodedInfo,
    isLoading,
    error,
    lookupVin,
    clearData: () => {
      setDecodedInfo(null);
      setError(null);
    }
  };
};
