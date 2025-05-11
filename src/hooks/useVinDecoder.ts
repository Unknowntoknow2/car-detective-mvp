
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { DecodedVehicleInfo } from '@/types/vehicle';
import { toast } from 'sonner';

interface VinDecoderResult {
  vin: string;
  make: string; 
  model: string; 
  year: number; 
  trim?: string;
  fuelType?: string;
  engine?: string;
  mileage?: number;
  transmission: string;
  drivetrain?: string;
  bodyType?: string;
}

export function useVinDecoder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VinDecoderResult | null>(null);

  const lookupVin = async (vin: string): Promise<VinDecoderResult | null> => {
    if (!vin || vin.length !== 17) {
      setError('Invalid VIN. Must be a 17-character string.');
      toast.error("Please enter a valid 17-character VIN.");
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the Supabase edge function directly
      const { data, error } = await supabase.functions.invoke('decode-vin', {
        body: { vin }
      });
      
      if (error) {
        throw new Error(`VIN lookup failed: ${error.message}`);
      }
      
      if (!data || data.error) {
        throw new Error(data?.error || 'Invalid response from VIN decoder');
      }
      
      const decodedVehicle: VinDecoderResult = {
        vin,
        make: data.make || 'Unknown',
        model: data.model || 'Unknown',
        year: data.year || 0,
        trim: data.trim,
        fuelType: data.fuelType || data.fuel_type,
        engine: data.engine,
        transmission: data.transmission || 'Unknown',
        drivetrain: data.drivetrain,
        bodyType: data.bodyType || data.body_type
      };
      
      setResult(decodedVehicle);
      toast.success(`VIN Decoded: ${decodedVehicle.year} ${decodedVehicle.make} ${decodedVehicle.model}`);
      
      return decodedVehicle;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during VIN lookup';
      setError(errorMessage);
      toast.error(errorMessage);
      
      console.error('VIN decode error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookupVin,
    isLoading,
    error,
    result
  };
}
