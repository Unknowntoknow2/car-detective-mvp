
import { useState } from 'react';
import { useVinDecoder } from './useVinDecoder';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useVehicleLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<any>(null);
  const { lookupVin } = useVinDecoder();

  const lookupVehicle = async (
    identifierType: 'vin' | 'plate' | 'manual' | 'photo',
    identifier: string,
    state?: string,
    manualData?: any
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      let valuationId;
      
      if (identifierType === 'vin') {
        // VIN lookup
        result = await lookupVin(identifier);
        
        if (result) {
          // Create a valuation record to return to the user
          const { data: valuationData, error: valuationError } = await supabase
            .from('valuations')
            .insert({
              user_id: (await supabase.auth.getUser()).data.user?.id || '00000000-0000-0000-0000-000000000000',
              vin: result.vin,
              make: result.make,
              model: result.model,
              year: result.year,
              is_vin_lookup: true,
              confidence_score: 85,
              condition_score: 7
            })
            .select('id')
            .single();
            
          if (valuationError) {
            console.error('Error creating valuation record:', valuationError);
            throw new Error('Failed to create valuation record');
          }
          
          valuationId = valuationData?.id;
          
          if (valuationId) {
            localStorage.setItem('latest_valuation_id', valuationId);
            console.log('Created valuation record:', valuationId);
            toast.success(`Found: ${result.year} ${result.make} ${result.model}`);
          }
          
          setVehicle({
            ...result,
            id: valuationId
          });
          
          return {
            ...result,
            id: valuationId
          };
        }
      }
      // Add handling for other lookup types here
      
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to lookup vehicle';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookupVehicle,
    isLoading,
    error,
    vehicle
  };
}
