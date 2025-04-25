
import { useState } from 'react';
import { useUnifiedDecoder } from './useUnifiedDecoder';
import { useVinDecoder } from './useVinDecoder';
import { usePlateLookup } from './usePlateLookup';
import { useToast } from '@/components/ui/use-toast';

type VehicleInfo = {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  fuelType?: string;
  vin?: string;
  trim?: string;
};

export function useVehicleLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleInfo | null>(null);
  const vinDecoder = useVinDecoder();
  const plateLookup = usePlateLookup();
  const unifiedDecoder = useUnifiedDecoder();
  const { toast } = useToast();

  const lookupVehicle = async (identifierType: 'vin' | 'plate', identifier: string, state?: string) => {
    setIsLoading(true);
    setVehicle(null);
    
    try {
      let result = null;
      
      if (identifierType === 'vin') {
        if (identifier.length !== 17) {
          throw new Error('VIN must be 17 characters long');
        }
        
        result = await vinDecoder.lookupVin(identifier);
        
        if (!result) {
          throw new Error('Could not decode VIN');
        }
      } else if (identifierType === 'plate') {
        if (!state) {
          throw new Error('State is required for plate lookup');
        }
        
        result = await plateLookup.lookupVehicle(identifier, state);
        
        if (!result) {
          throw new Error('Could not find vehicle with this license plate');
        }
      }
      
      if (result) {
        const vehicleInfo: VehicleInfo = {
          make: result.make || '',
          model: result.model || '',
          year: result.year || 0,
          mileage: result.mileage || result.odometer || undefined,
          fuelType: result.fuelType || result.fuel_type || undefined,
          vin: result.vin || undefined,
          trim: result.trim || undefined
        };
        
        setVehicle(vehicleInfo);
        return vehicleInfo;
      }
      
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during vehicle lookup';
      toast({
        title: "Lookup Failed",
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
    vehicle
  };
}
