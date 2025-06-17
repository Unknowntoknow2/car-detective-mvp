
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PlateLookupInfo } from "@/types/lookup";
import { mockPlateLookup } from "@/services/plateService";

export interface UsePlateLookupOptions {
  tier?: 'free' | 'premium';
  includePremiumData?: boolean;
}

export const usePlateLookup = (options: UsePlateLookupOptions = {}) => {
  const { tier = 'free', includePremiumData = false } = options;
  const { toast } = useToast();
  
  const [result, setResult] = useState<PlateLookupInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupVehicle = async (
    plate: string,
    state: string,
  ): Promise<PlateLookupInfo | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the mockPlateLookup function from plateService
      const response = await mockPlateLookup(plate, state);

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error("No data returned from plate lookup");
      }

      const plateResult: PlateLookupInfo = {
        ...response.data,
        plate,
        state,
        estimatedValue: response.data.estimatedValue || 24500
      };

      setResult(plateResult);
      toast({
        description:
          `${plateResult.year} ${plateResult.make} ${plateResult.model}`,
      });

      return plateResult;
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : "Unknown error during plate lookup";
      setError(errorMessage);
      toast({
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setResult(null);
    setError(null);
  };

  return {
    result,
    isLoading,
    error,
    lookupVehicle,
    clearData
  };
};
