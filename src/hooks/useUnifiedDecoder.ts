
import { useState, useCallback } from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';

export const useUnifiedDecoder = () => {
  const [decodedInfo, setDecodedInfo] = useState<DecodedVehicleInfo | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decodeVehicle = useCallback(async (identifier: string, type: 'vin' | 'plate') => {
    setIsDecoding(true);
    setError(null);
    
    try {
      // Mock decoding logic
      const mockData: DecodedVehicleInfo = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        trim: 'SE',
        bodyType: 'Sedan',
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        engine: '2.5L I4',
        color: 'Silver',
        exteriorColor: 'Silver'
      };
      
      setDecodedInfo(mockData);
      return mockData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Decoding failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsDecoding(false);
    }
  }, []);

  return {
    decodedInfo,
    isDecoding,
    error,
    decodeVehicle,
    clearData: () => {
      setDecodedInfo(null);
      setError(null);
    }
  };
};
