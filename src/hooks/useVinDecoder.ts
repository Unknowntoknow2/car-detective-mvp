
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
      console.log('VIN DECODER: Starting lookup for VIN:', vin);
      
      // Call the Supabase edge function directly
      const { data, error } = await supabase.functions.invoke('decode-vin', {
        body: { vin }
      });
      
      console.log('VIN DECODER: Raw response from API:', data);
      
      if (error) {
        console.error('VIN DECODER: Supabase function error:', error);
        throw new Error(`VIN lookup failed: ${error.message}`);
      }
      
      if (!data || data.error) {
        console.error('VIN DECODER: Invalid or error response:', data?.error || 'No data returned');
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
      
      console.log('VIN DECODER: Successfully decoded vehicle:', decodedVehicle);
      
      setResult(decodedVehicle);
      toast.success(`VIN Decoded: ${decodedVehicle.year} ${decodedVehicle.make} ${decodedVehicle.model}`);
      
      // After successful decoding, check if we have a valuation ID to store
      const storedValuationId = localStorage.getItem('latest_valuation_id');
      console.log('VIN DECODER: Current valuation ID in localStorage:', storedValuationId);
      
      return decodedVehicle;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during VIN lookup';
      console.error('VIN DECODER: Error during lookup:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      
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
