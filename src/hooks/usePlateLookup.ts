
import { useState } from 'react';
import { PlateLookupInfo } from '@/types/lookup';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { mockPlateLookup } from '@/services/plateService';

export function usePlateLookup() {
  const [vehicleInfo, setVehicleInfo] = useState<PlateLookupInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const lookupVehicle = async (plate: string, state: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if we already have this plate in our database
      const { data: existingData, error: fetchError } = await supabase
        .from('plate_lookups')
        .select('*')
        .eq('plate', plate)
        .eq('state', state)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw fetchError;
      }

      if (existingData) {
        setVehicleInfo(existingData as PlateLookupInfo);
        toast({
          title: "Success",
          description: `Found existing vehicle information for plate: ${plate}, state: ${state}`,
        });
        return existingData;
      }

      // If not found, use mock service for now and store result
      const mockData = await mockPlateLookup(plate, state);
      
      const { error: insertError } = await supabase
        .from('plate_lookups')
        .insert([mockData]);

      if (insertError) {
        throw insertError;
      }

      setVehicleInfo(mockData);
      toast({
        title: "Success",
        description: `Vehicle information found for plate: ${plate}, state: ${state}`,
      });
      return mockData;
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
