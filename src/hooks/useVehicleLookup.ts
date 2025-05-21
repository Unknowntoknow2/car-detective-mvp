
import { useState, useCallback } from 'react';
import { fetchVehicleByVin, fetchVehicleByPlate } from '@/services/vehicleLookupService';
import { toast } from 'sonner';

// Define a proper type for the vehicle data
interface VehicleData {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  exteriorColor?: string;
  interiorColor?: string;
  engine?: string;
  drivetrain?: string;
  features?: string[];
  // other properties...
}

export function useVehicleLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);

  const lookupByVin = useCallback(async (vin: string) => {
    if (!vin || vin.length < 17) {
      setError('Please enter a valid 17-character VIN');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchVehicleByVin(vin);
      if (result) {
        setVehicleData(result);
        return result;
      } else {
        setError('No vehicle found with this VIN');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to lookup vehicle');
      toast.error('Vehicle lookup failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const lookupByPlate = useCallback(async (plate: string, state: string) => {
    if (!plate) {
      setError('Please enter a license plate');
      return null;
    }

    if (!state) {
      setError('Please select a state');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchVehicleByPlate(plate, state);
      if (result) {
        setVehicleData(result);
        return result;
      } else {
        setError('No vehicle found with this license plate');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to lookup vehicle');
      toast.error('Vehicle lookup failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const lookupVehicle = useCallback(async (
    type: 'vin' | 'plate' | 'manual' | 'photo',
    identifier: string,
    state?: string,
    data?: any
  ) => {
    if (type === 'vin') {
      return lookupByVin(identifier);
    } else if (type === 'plate' && state) {
      return lookupByPlate(identifier, state);
    } else if (type === 'manual' && data) {
      // For manual entry, we just use the data directly
      setVehicleData({
        vin: data.vin || 'MANUAL-ENTRY',
        make: data.make,
        model: data.model,
        year: parseInt(data.year),
        mileage: data.mileage ? parseInt(data.mileage) : undefined,
        trim: data.trim,
        bodyType: data.bodyType,
        fuelType: data.fuelType,
        transmission: data.transmission,
        // Add other properties as needed
      });
      return data;
    } else if (type === 'photo') {
      // Photo lookup would go here
      setError('Photo lookup not implemented yet');
      return null;
    }
    
    setError('Invalid lookup type');
    return null;
  }, [lookupByVin, lookupByPlate]);

  const reset = useCallback(() => {
    setVehicleData(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    vehicleData,
    lookupByVin,
    lookupByPlate,
    lookupVehicle,
    reset,
    vehicle: vehicleData // Alias for components that expect 'vehicle' prop
  };
}

export default useVehicleLookup;
