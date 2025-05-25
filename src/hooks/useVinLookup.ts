
import { useState } from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { getCarPricePrediction } from '@/services/carPricePredictionService';

interface UseVinLookupResult {
  isLoading: boolean;
  error: string | null;
  vehicle: DecodedVehicleInfo | null;
  lookupByVin: (vin: string) => Promise<DecodedVehicleInfo | null>;
  lookupByPlate: (plate: string, state: string) => Promise<DecodedVehicleInfo | null>;
  lookupVehicle: (type: string, id: string, additionalData?: any, manualData?: any) => void;
  reset: () => void;
}

export const useVinLookup = (): UseVinLookupResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<DecodedVehicleInfo | null>(null);
  
  const reset = () => {
    setVehicle(null);
    setError(null);
  };
  
  const lookupByVin = async (vin: string): Promise<DecodedVehicleInfo | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock decoded data - in production this would come from VIN decoder API
      const decoded = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        bodyType: 'Sedan',
        color: 'Silver'
      };

      // Get real valuation from API
      const prediction = await getCarPricePrediction({
        make: decoded.make,
        model: decoded.model,
        year: decoded.year,
        mileage: 42000,
        condition: 'good',
        zipCode: '90210',
        fuelType: decoded.fuelType,
        transmission: decoded.transmission,
        color: decoded.color,
        bodyType: decoded.bodyType,
        vin: vin
      });

      const result: DecodedVehicleInfo = {
        vin,
        make: prediction.make,
        model: prediction.model,
        year: prediction.year,
        trim: 'LE',
        engine: '2.5L I4',
        transmission: prediction.transmission,
        drivetrain: 'FWD',
        bodyType: prediction.bodyType,
        exteriorColor: prediction.color,
        fuelType: prediction.fuelType,
        features: ['bluetooth', 'backup_camera', 'alloy_wheels'],
        estimatedValue: prediction.estimatedValue,
        confidenceScore: prediction.confidenceScore,
        valuationId: `vin-${Date.now()}`
      };
      
      setVehicle(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to lookup VIN';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const lookupByPlate = async (plate: string, state: string): Promise<DecodedVehicleInfo | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock decoded data - in production this would come from plate lookup API
      const decoded = {
        make: 'Honda',
        model: 'Accord',
        year: 2019,
        fuelType: 'Gasoline',
        transmission: 'CVT',
        bodyType: 'Sedan',
        color: 'Blue'
      };

      // Get real valuation from API
      const prediction = await getCarPricePrediction({
        make: decoded.make,
        model: decoded.model,
        year: decoded.year,
        mileage: 52000,
        condition: 'good',
        zipCode: '90210',
        fuelType: decoded.fuelType,
        transmission: decoded.transmission,
        color: decoded.color,
        bodyType: decoded.bodyType
      });

      const result: DecodedVehicleInfo = {
        vin: `PLATE-${plate}-${state}`,
        make: prediction.make,
        model: prediction.model,
        year: prediction.year,
        trim: 'EX',
        engine: '1.5L Turbo',
        transmission: prediction.transmission,
        drivetrain: 'FWD',
        bodyType: prediction.bodyType,
        exteriorColor: prediction.color,
        fuelType: prediction.fuelType,
        features: ['sunroof', 'lane_assist', 'heated_seats'],
        estimatedValue: prediction.estimatedValue,
        confidenceScore: prediction.confidenceScore,
        valuationId: `plate-${Date.now()}`
      };
      
      setVehicle(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to lookup license plate';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const lookupVehicle = (type: string, id: string, additionalData?: any, manualData?: any) => {
    if (manualData) {
      // Create a vehicle object from manual data
      const manualVehicle: DecodedVehicleInfo = {
        make: manualData.make || '',
        model: manualData.model || '',
        year: Number(manualData.year) || new Date().getFullYear(),
        vin: manualData.vin || '',
        trim: manualData.trim || '',
        engine: manualData.engine || '',
        transmission: manualData.transmission || '',
        drivetrain: manualData.drivetrain || '',
        bodyType: manualData.bodyType || '',
        exteriorColor: manualData.color || '',
        fuelType: manualData.fuelType || '',
        features: manualData.features || []
      };
      
      setVehicle(manualVehicle);
    }
  };
  
  return {
    isLoading,
    error,
    vehicle,
    lookupByVin,
    lookupByPlate,
    lookupVehicle,
    reset
  };
};
