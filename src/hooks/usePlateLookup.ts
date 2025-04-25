
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface PlateLookupResult {
  plate: string;
  state: string;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  vin?: string;
}

export function usePlateLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlateLookupResult | null>(null);
  const { toast } = useToast();

  const lookupVehicle = async (plate: string, state: string): Promise<PlateLookupResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/lookup-plate?plate=${plate}&state=${state}`);
      
      if (!response.ok) {
        throw new Error(`Plate lookup failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const plateResult: PlateLookupResult = {
        plate,
        state,
        make: data.make || 'Unknown',
        model: data.model || 'Unknown',
        year: data.year || 0,
        color: data.color,
        vin: data.vin
      };
      
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
