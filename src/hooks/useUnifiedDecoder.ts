
import { useState, useCallback } from 'react';
import { decodeVin, decodeLicensePlate, DecodedVehicleInfo } from '@/services/vehicleService';

interface UseUnifiedDecoderProps {
  onSuccess?: (data: DecodedVehicleInfo) => void;
  onError?: (error: Error) => void;
}

export function useUnifiedDecoder({ onSuccess, onError }: UseUnifiedDecoderProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(null);

  const decodeVehicle = useCallback(async ({
    type,
    value,
    state,
    zipCode
  }: {
    type: 'vin' | 'plate';
    value: string;
    state?: string;
    zipCode?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      let result: DecodedVehicleInfo;

      if (type === 'vin') {
        result = await decodeVin(value);
      } else if (type === 'plate' && state) {
        result = await decodeLicensePlate(value, state);
      } else {
        throw new Error('Invalid decoder type or missing state for license plate');
      }

      // If zipCode is provided, add it to the result
      if (zipCode) {
        result = {
          ...result,
          zipCode
        };
      }

      setVehicleInfo(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err: any) {
      const errorObj = err instanceof Error ? err : new Error(err?.message || 'Failed to decode vehicle');
      setError(errorObj);
      
      if (onError) {
        onError(errorObj);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  const reset = useCallback(() => {
    setVehicleInfo(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    vehicleInfo,
    decodeVehicle,
    reset
  };
}
