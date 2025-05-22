
import { useState } from 'react';
import { validateVIN } from '@/utils/validation/vin-validation';
import { decodeVin } from '@/services/vinService';
import { DecodedVehicleInfo } from '@/types/vehicle';

export function useVinDecoder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [valuationId, setValuationId] = useState<string | null>(null);

  const lookupVin = async (vin: string) => {
    // Reset state
    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      // Validate VIN format first
      const validation = validateVIN(vin);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid VIN format');
      }

      // Call the VIN decoder service
      const response = await decodeVin(vin);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to decode VIN');
      }

      if (response.data && response.data.valuationId) {
        setValuationId(response.data.valuationId);
      }

      setResult(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setValuationId(null);
  };

  return {
    isLoading,
    error,
    result,
    lookupVin,
    reset,
    valuationId
  };
}
