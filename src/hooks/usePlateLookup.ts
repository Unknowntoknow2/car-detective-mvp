
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { PlateLookupInfo } from '@/types/lookup';
import { mockPlateLookup } from '@/services/plateService';

export function usePlateLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlateLookupInfo | null>(null);
  const { toast } = useToast();

  const lookupVehicle = async (plate: string, state: string): Promise<PlateLookupInfo | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the mockPlateLookup function from plateService
      const response = await mockPlateLookup(plate, state);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (!response.data) {
        throw new Error('No data returned from plate lookup');
      }
      
      const plateResult: PlateLookupInfo = response.data;
      
      setResult(plateResult);
      toast({
        title: "Vehicle Found",
        description: `${plateResult.year} ${plateResult.make} ${plateResult.model}`,
      });
      
      return plateResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during plate lookup';
      setError(errorMessage);
      toast({
        title: "Plate Lookup Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookupVehicle,
    isLoading,
    error,
    result
  };
}
