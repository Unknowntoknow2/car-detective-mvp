
import { useState } from 'react';
import { decodeVIN } from '@/services/vinService';
import { decodeLicensePlate, DecodedVehicleInfo } from '@/services/vehicleService';
import { toast } from 'sonner';

export const useUnifiedDecoder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const decodeVehicle = async (
    type: 'vin' | 'plate',
    identifier: string,
    state?: string
  ) => {
    if (!identifier) {
      setError('Identifier is required');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let result: DecodedVehicleInfo;
      
      if (type === 'vin') {
        if (identifier.length !== 17) {
          throw new Error('VIN must be 17 characters');
        }
        result = await decodeVIN(identifier);
      } else if (type === 'plate') {
        if (!state) {
          throw new Error('State is required for plate lookup');
        }
        result = await decodeLicensePlate(identifier, state);
      } else {
        throw new Error('Invalid decoder type');
      }
      
      setVehicleInfo(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Decoding failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    decodeVehicle,
    isLoading,
    vehicleInfo,
    error,
    clearVehicleInfo: () => setVehicleInfo(null),
    clearError: () => setError(null)
  };
};
