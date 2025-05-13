
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { DecodedVehicleInfo } from '@/types/vehicle';
import { toast } from 'sonner';

type DecodeType = 'vin' | 'plate' | 'manual' | 'photo';

interface ManualEntry {
  make: string;
  model: string;
  year: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodyType?: string;
  exteriorColor?: string;
  fuelType?: string;
  mileage?: number;
  selectedFeatures?: string[];
  condition?: string;
  zipCode?: string;
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
      zipCode?: string;
    }
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the Supabase edge function directly
      const { data, error: fnError } = await supabase.functions.invoke('unified-decode', {
        body: {
          type,
          ...params
        }
      });

      if (fnError) throw new Error(fnError.message);
      if (data.error) throw new Error(data.error.message || data.error);
      
      if (!data.decoded) {
        throw new Error('No vehicle data returned');
      }
      
      if ('error' in data.decoded) {
        throw new Error(data.decoded.error);
      }
      
      const decodedInfo: DecodedVehicleInfo = {
        make: data.decoded.make,
        model: data.decoded.model,
        year: data.decoded.year,
        trim: data.decoded.trim,
        mileage: data.decoded.mileage,
        condition: data.decoded.condition,
        zipCode: data.decoded.zipCode,
        transmission: data.decoded.transmission,
        fuelType: data.decoded.fuelType,
        bodyType: data.decoded.bodyType,
        drivetrain: data.decoded.drivetrain,
        color: data.decoded.exteriorColor,
        vin: params.vin || data.decoded.vin
      };
      
      setVehicleInfo(decodedInfo);
      
      toast.success(`Found: ${decodedInfo.year} ${decodedInfo.make} ${decodedInfo.model}`);
      return decodedInfo;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decode vehicle information';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Decode error:', err);
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
