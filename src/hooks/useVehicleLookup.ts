
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useVehicleLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [vehicle, setVehicle] = useState<any>(null);

  const lookupVehicle = async (identifierType: 'vin' | 'plate', identifier: string, state?: string) => {
    setIsLoading(true);
    setVehicle(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('unified-decode', {
        body: { 
          type: identifierType,
          [identifierType]: identifier,
          state
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setVehicle(data.decoded);
      toast.success(`Found: ${data.decoded.year} ${data.decoded.make} ${data.decoded.model}`);
      return data.decoded;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to lookup vehicle';
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookupVehicle,
    isLoading,
    vehicle
  };
}
