
import { useState } from 'react';
import { PlateLookupInfo } from '@/types/lookup';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { lookupPlate } from '@/services/plateService';

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
        .maybeSingle();

      if (fetchError) {
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

      // If not found, use mock service and store result
      const data = await lookupPlate(plate, state);
      
      const { error: insertError } = await supabase
        .from('plate_lookups')
        .insert([data]);

      if (insertError) {
        throw insertError;
      }

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
