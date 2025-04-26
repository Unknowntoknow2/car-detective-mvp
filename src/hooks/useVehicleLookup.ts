
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useVehicleLookup = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [vehicle, setVehicle] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const lookupVehicle = async (type: 'vin' | 'plate' | 'manual' | 'photo', identifier: string, state?: string, manualData?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let payload: any = {};
      
      if (type === 'vin') {
        payload = { type, vin: identifier };
      } else if (type === 'plate') {
        payload = { type, licensePlate: identifier, state };
      } else if (type === 'manual' || type === 'photo') {
        payload = { type, manual: manualData };
      }
      
      // For photo analysis, we skip the API call and use the mock data directly
      // In a production app, you would call a real computer vision API
      if (type === 'photo' && identifier === 'photo-analysis') {
        // Simulate API response delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use the data passed in manualData
        setVehicle(manualData);
        
        toast.success(`Identified vehicle: ${manualData.year} ${manualData.make} ${manualData.model}`);
        return manualData;
      }
      
      const { data, error } = await supabase.functions.invoke('unified-decode', {
        body: payload
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.decoded?.error) {
        throw new Error(data.decoded.error);
      }
      
      setVehicle(data.decoded);
      
      if (type === 'vin') {
        toast.success(`Found vehicle: ${data.decoded.year} ${data.decoded.make} ${data.decoded.model}`);
      } else if (type === 'plate') {
        toast.success(`Found vehicle with plate ${identifier}: ${data.decoded.year} ${data.decoded.make} ${data.decoded.model}`);
      } else if (type === 'manual') {
        toast.success(`Vehicle details validated: ${data.decoded.year} ${data.decoded.make} ${data.decoded.model}`);
      }
      
      return data.decoded;
    } catch (err: any) {
      const errorMessage = err.message || 'Could not lookup vehicle';
      console.error(`Vehicle lookup error (${type}):`, err);
      setError(errorMessage);
      toast.error(errorMessage);
      setVehicle(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const reset = () => {
    setVehicle(null);
    setError(null);
  };

  return {
    lookupVehicle,
    isLoading,
    vehicle,
    error,
    reset
  };
};
