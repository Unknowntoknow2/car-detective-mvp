
import { useState } from 'react';
import { PlateLookupInfo } from '@/types/lookup';
import { lookupPlate } from '@/services/plateService';
import { toast } from '@/components/ui/use-toast';

export function usePlateLookup() {
  const [vehicleInfo, setVehicleInfo] = useState<PlateLookupInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const lookupVehicle = async (plate: string, state: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await lookupPlate(plate, state);
      setVehicleInfo(data);
      toast({
        title: "Success",
        description: `Vehicle information found for plate: ${plate}, state: ${state}`,
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
    lookupVehicle,
    reset
  };
}
