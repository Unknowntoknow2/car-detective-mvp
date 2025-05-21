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
    reset
  };
}

export default useVehicleLookup;
