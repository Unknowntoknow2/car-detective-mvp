
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DecodedVehicleInfo } from '@/types/vehicle';

type DecodeType = 'vin' | 'plate' | 'manual';

interface ManualEntry {
  make: string;
  model: string;
  year: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodyType?: string;
}

export function useUnifiedDecoder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(null);

  const decode = async (
    type: DecodeType,
    params: {
      vin?: string;
      licensePlate?: string;
      state?: string;
      manual?: ManualEntry;
    }
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('unified-decode', {
        body: {
          type,
          ...params
        }
      });

      if (fnError) throw new Error(fnError.message);
      if (data.error) throw new Error(data.error);
      
      const decodedInfo = data.decoded as DecodedVehicleInfo;
      setVehicleInfo(decodedInfo);
      return decodedInfo;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decode vehicle information';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    decode,
    isLoading,
    error,
    vehicleInfo,
    reset: () => {
      setVehicleInfo(null);
      setError(null);
    }
  };
}
