
import { useState } from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { decodeVin } from '@/services/vinService';
import { toast } from '@/components/ui/use-toast';

export function useVinDecoder() {
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const lookupVin = async (vin: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await decodeVin(vin);
      setVehicleInfo(data);
      toast({
        title: "Success",
        description: `Vehicle information found for VIN: ${vin}`,
      });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setVehicleInfo(null);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setVehicleInfo(null);
    setError(null);
  };

  return {
    vehicleInfo,
    isLoading,
    error,
    lookupVin,
    reset
  };
}
