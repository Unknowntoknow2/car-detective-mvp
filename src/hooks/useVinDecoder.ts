
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface VinDecoderResult {
  vin: string;
  make?: string;
  model?: string;
  year?: number;
  trim?: string;
  fuelType?: string;
  engine?: string;
  mileage?: number;
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
      const response = await fetch(`/api/decode-vin?vin=${vin}`);
      
      if (!response.ok) {
        throw new Error(`VIN lookup failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const decodedVehicle: VinDecoderResult = {
        vin,
        make: data.make || 'Unknown',
        model: data.model || 'Unknown',
        year: data.year || 0,
        trim: data.trim,
        fuelType: data.fuel_type,
        engine: data.engine
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
