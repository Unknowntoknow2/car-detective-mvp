
import { useState, useCallback } from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { useUnifiedLookup } from './useUnifiedLookup';

export const useVinLookup = () => {
  const [decodedInfo, setDecodedInfo] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { lookupByVin } = useUnifiedLookup({ mode: 'vpic' });

  const lookupVin = useCallback(async (vin: string): Promise<DecodedVehicleInfo | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await lookupByVin(vin);
      if (result && result.success && result.vehicle) {
        setDecodedInfo(result.vehicle);
        return result.vehicle;
      } else {
        const errorMessage = result?.error || 'VIN lookup failed';
        setError(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'VIN lookup failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [lookupByVin]);

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
