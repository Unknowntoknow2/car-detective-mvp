
import { useState } from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { toast } from 'sonner';

interface VehicleLookupResult {
  isLoading: boolean;
  error: string | null;
  vehicle: DecodedVehicleInfo | null;
  vehicleData: DecodedVehicleInfo | null;
  lookupVehicle: (type: 'vin' | 'plate' | 'manual', value: string, state?: string, manualData?: ManualEntryFormData) => Promise<DecodedVehicleInfo | null>;
}

export function useVehicleLookup(): VehicleLookupResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<DecodedVehicleInfo | null>(null);

  const lookupVehicle = async (
    type: 'vin' | 'plate' | 'manual', 
    value: string, 
    state?: string,
    manualData?: ManualEntryFormData
  ): Promise<DecodedVehicleInfo | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call - in a real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let result: DecodedVehicleInfo | null = null;
      
      if (type === 'manual' && manualData) {
        // Handle manual entry
        result = {
          vin: manualData.vin || 'MANUAL_ENTRY',
          make: manualData.make,
          model: manualData.model,
          year: manualData.year,
          mileage: manualData.mileage,
          trim: manualData.trim,
          fuelType: manualData.fuelType,
          transmission: manualData.transmission,
          bodyType: manualData.bodyType,
          color: manualData.color,
          valuationId: `manual-${Date.now()}`
        };
      } else if (type === 'vin') {
        // Mock VIN lookup
        result = {
          vin: value,
          make: 'Toyota',
          model: 'Camry',
          year: 2019,
          trim: 'SE',
          engine: '2.5L I4',
          transmission: 'Automatic',
          drivetrain: 'FWD',
          bodyType: 'Sedan',
          fuelType: 'Gasoline',
          features: ['Bluetooth', 'Backup Camera', 'Alloy Wheels'],
          valuationId: `vin-${Date.now()}`
        };
      } else if (type === 'plate') {
        // Mock plate lookup
        result = {
          vin: 'PLATE123456789ABCD',
          make: 'Honda',
          model: 'Accord',
          year: 2020,
          trim: 'EX',
          transmission: 'Automatic',
          bodyType: 'Sedan',
          fuelType: 'Gasoline',
          exteriorColor: 'Blue',
          valuationId: `plate-${Date.now()}`
        };
      }
      
      if (!result) {
        throw new Error('Vehicle information not found');
      }
      
      setVehicle(result);
      return result;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to lookup vehicle';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    error,
    vehicle,
    vehicleData: vehicle,
    lookupVehicle
  };
}
