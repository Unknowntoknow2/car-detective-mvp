
import { useState } from 'react';
import { validateVIN } from '@/utils/validation/vin-validation';
import { decodeVin } from '@/services/vinService';
import { DecodedVehicleInfo } from '@/types/vehicle';

export function useVinDecoder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DecodedVehicleInfo | null>(null);
  const [valuationId, setValuationId] = useState<string | null>(null);

  const lookupVin = async (vin: string) => {
    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      const validation = validateVIN(vin);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid VIN format');
      }

      const response = await decodeVin(vin);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to decode VIN');
      }

      const tempValuationId = `vin-lookup-${Date.now()}`;
      
      if (response.data) {
        const responseData = {
          ...response.data,
          valuationId: response.data.valuationId || tempValuationId
        };
        
        setResult(responseData);
        setValuationId(responseData.valuationId);
        return responseData;
      } else {
        throw new Error('No data returned from VIN lookup');
      }
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
