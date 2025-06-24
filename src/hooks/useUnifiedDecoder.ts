
import { useState, useCallback } from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { useUnifiedLookup } from './useUnifiedLookup';

export const useUnifiedDecoder = () => {
  const [decodedInfo, setDecodedInfo] = useState<DecodedVehicleInfo | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the real unified lookup service instead of mock data
  const { lookupByVin, isLoading } = useUnifiedLookup({ mode: 'vpic' });

  const decodeVehicle = useCallback(async (identifier: string, type: 'vin' | 'plate') => {
    console.log('🔄 useUnifiedDecoder: Routing to real NHTSA API via useUnifiedLookup');
    setIsDecoding(true);
    setError(null);
    
    try {
      if (type === 'vin') {
        const result = await lookupByVin(identifier);
        if (result && result.success && result.vehicle) {
          setDecodedInfo(result.vehicle);
          return result.vehicle;
        } else {
          throw new Error(result?.error || 'Failed to decode VIN');
        }
      } else {
        throw new Error('Plate lookup not supported in this decoder');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Decoding failed';
      setError(errorMessage);
      console.error('❌ useUnifiedDecoder error:', errorMessage);
      throw err;
    } finally {
      setIsDecoding(false);
    }
  }, [lookupByVin]);

  return {
    decodedInfo,
    isDecoding: isDecoding || isLoading,
    error,
    decodeVehicle,
    clearData: () => {
      setDecodedInfo(null);
      setError(null);
    }
  };
};
