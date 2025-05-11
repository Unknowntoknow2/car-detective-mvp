
import { useState } from 'react';
import { useVinDecoder } from './useVinDecoder';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useVehicleLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<any>(null);
  const { lookupVin } = useVinDecoder();

  // Add a reset function to clear vehicle data
  const reset = () => {
    setVehicle(null);
    setError(null);
  };

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
          console.log("VIN lookup successful:", result);
          
          try {
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
              // Create a fallback ID if we can't save to the database
              valuationId = crypto.randomUUID();
              console.log('Using fallback ID due to database error:', valuationId);
            } else {
              valuationId = valuationData?.id;
              console.log('Created valuation record with ID:', valuationId);
            }
          } catch (dbError) {
            console.error('Database operation failed:', dbError);
            // Create a fallback ID if the database operation fails
            valuationId = crypto.randomUUID();
            console.log('Using fallback ID due to database error:', valuationId);
          }
          
          if (valuationId) {
            localStorage.setItem('latest_valuation_id', valuationId);
            console.log('Saved valuation ID to localStorage:', valuationId);
            toast.success(`Found: ${result.year} ${result.make} ${result.model}`);
          }
          
          const vehicleWithId = {
            ...result,
            id: valuationId
          };
          
          setVehicle(vehicleWithId);
          return vehicleWithId;
        }
      }
      // Add handling for other lookup types here
      
      return null;
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
    vehicle,
    reset // Export the reset function
  };
}
