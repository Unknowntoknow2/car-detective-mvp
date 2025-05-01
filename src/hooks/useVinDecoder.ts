
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { DecodedVehicleInfo } from '@/types/vehicle';

interface VinDecoderResult {
  vin: string;
  make: string; // Changed from optional to required
  model: string; // Changed from optional to required
  year: number; // Changed from optional to required
  trim?: string;
  fuelType?: string;
  engine?: string;
  mileage?: number;
  transmission: string; // Changed from optional to required
  drivetrain?: string;
  bodyType?: string;
}

export function useVinDecoder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VinDecoderResult | null>(null);
  const { toast } = useToast();

  const lookupVin = async (vin: string): Promise<VinDecoderResult | null> => {
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
        bodyType: data.bodyType
      };
      
      setResult(decodedVehicle);
      toast({
        title: "VIN Decoded Successfully",
        description: `${decodedVehicle.year} ${decodedVehicle.make} ${decodedVehicle.model}`,
      });
      
      return decodedVehicle;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during VIN lookup';
      setError(errorMessage);
      toast({
        title: "VIN Decode Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
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
