
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PlateLookupInfo } from '@/types/vehicle';

export function usePlateLookup() {
  const [plateInfo, setPlateInfo] = useState<PlateLookupInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupPlate = async (plate: string, state: string) => {
    if (!plate || !state) {
      setError('Plate number and state are required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('plate-lookup', {
        body: { plate, state }
      });

      if (error) throw error;

      if (data && data.success && data.data) {
        // Create a safer version of PlateLookupInfo with default values
        const safeData: PlateLookupInfo = {
          plate: data.data.plate,
          state: data.data.state,
          make: data.data.make || 'Unknown',
          model: data.data.model || 'Unknown',
          year: data.data.year || new Date().getFullYear(),
          vin: data.data.vin
        };
        
        setPlateInfo(safeData);
        return safeData;
      } else {
        throw new Error(data?.message || 'Failed to lookup plate');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    plateInfo,
    isLoading,
    error,
    lookupPlate
  };
}
