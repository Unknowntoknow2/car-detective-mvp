
import { useState } from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useVinDecoder() {
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const lookupVin = async (vin: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if we already have this VIN in our database
      const { data: existingData, error: fetchError } = await supabase
        .from('decoded_vehicles')
        .select('*')
        .eq('vin', vin)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw fetchError;
      }

      if (existingData) {
        setVehicleInfo(existingData as DecodedVehicleInfo);
        toast({
          title: "Success",
          description: `Found existing vehicle information for VIN: ${vin}`,
        });
        return existingData;
      }

      // If not found, call our edge function to decode and store
      const response = await supabase.functions.invoke('decode-vin', {
        body: { vin },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const data = response.data as DecodedVehicleInfo;
      setVehicleInfo(data);
      toast({
        title: "Success",
        description: `Vehicle information decoded for VIN: ${vin}`,
      });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decode VIN';
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
