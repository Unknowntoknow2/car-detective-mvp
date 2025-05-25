
import { useState } from 'react';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { toast } from 'sonner';
import { getCarPricePrediction } from '@/services/carPricePredictionService';

interface VehicleLookupResult {
  isLoading: boolean;
  error: string | null;
  vehicle: DecodedVehicleInfo | null;
  vehicleData: DecodedVehicleInfo | null;
  lookupVehicle: (type: 'vin' | 'plate' | 'manual' | 'photo', value: string, state?: string, manualData?: ManualEntryFormData) => Promise<DecodedVehicleInfo | null>;
  lookupByVin: (vin: string) => Promise<DecodedVehicleInfo | null>;
  lookupByPlate: (plate: string, state: string) => Promise<DecodedVehicleInfo | null>;
  reset: () => void;
}

export function useVehicleLookup(): VehicleLookupResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState<DecodedVehicleInfo | null>(null);

  const reset = () => {
    setVehicle(null);
    setError(null);
  };

  const lookupVehicle = async (
    type: 'vin' | 'plate' | 'manual' | 'photo', 
    value: string, 
    state?: string,
    manualData?: ManualEntryFormData
  ): Promise<DecodedVehicleInfo | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result: DecodedVehicleInfo | null = null;
      
      if (type === 'manual' && manualData) {
        // Handle manual entry with real API call
        const predictionResult = await getCarPricePrediction({
          make: manualData.make,
          model: manualData.model,
          year: manualData.year,
          mileage: manualData.mileage,
          condition: manualData.condition.toString(),
          zipCode: manualData.zipCode,
          fuelType: manualData.fuelType,
          transmission: manualData.transmission,
          color: manualData.color,
          bodyType: manualData.bodyStyle,
          vin: manualData.vin
        });

        result = {
          vin: manualData.vin || 'MANUAL_ENTRY',
          make: predictionResult.make,
          model: predictionResult.model,
          year: predictionResult.year,
          mileage: predictionResult.mileage,
          trim: manualData.trim,
          fuelType: predictionResult.fuelType,
          transmission: predictionResult.transmission,
          bodyType: predictionResult.bodyType,
          exteriorColor: predictionResult.color,
          estimatedValue: predictionResult.estimatedValue,
          confidenceScore: predictionResult.confidenceScore,
          valuationId: `manual-${Date.now()}`
        };
      } else if (type === 'vin') {
        // Mock VIN decode then real valuation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockDecoded = {
          make: 'Toyota',
          model: 'Camry',
          year: 2019,
          fuelType: 'Gasoline',
          transmission: 'Automatic',
          bodyType: 'Sedan',
          color: 'Silver'
        };

        const predictionResult = await getCarPricePrediction({
          make: mockDecoded.make,
          model: mockDecoded.model,
          year: mockDecoded.year,
          mileage: 45000,
          condition: 'good',
          zipCode: '90210',
          fuelType: mockDecoded.fuelType,
          transmission: mockDecoded.transmission,
          color: mockDecoded.color,
          bodyType: mockDecoded.bodyType,
          vin: value
        });

        result = {
          vin: value,
          make: predictionResult.make,
          model: predictionResult.model,
          year: predictionResult.year,
          mileage: predictionResult.mileage,
          trim: 'SE',
          engine: '2.5L I4',
          transmission: predictionResult.transmission,
          drivetrain: 'FWD',
          bodyType: predictionResult.bodyType,
          fuelType: predictionResult.fuelType,
          exteriorColor: predictionResult.color,
          features: ['Bluetooth', 'Backup Camera', 'Alloy Wheels'],
          estimatedValue: predictionResult.estimatedValue,
          confidenceScore: predictionResult.confidenceScore,
          valuationId: `vin-${Date.now()}`
        };
      } else if (type === 'plate') {
        // Mock plate decode then real valuation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockDecoded = {
          make: 'Honda',
          model: 'Accord',
          year: 2018,
          fuelType: 'Gasoline',
          transmission: 'CVT',
          bodyType: 'Sedan',
          color: 'Blue'
        };

        const predictionResult = await getCarPricePrediction({
          make: mockDecoded.make,
          model: mockDecoded.model,
          year: mockDecoded.year,
          mileage: 52000,
          condition: 'good',
          zipCode: '90210',
          fuelType: mockDecoded.fuelType,
          transmission: mockDecoded.transmission,
          color: mockDecoded.color,
          bodyType: mockDecoded.bodyType
        });

        result = {
          vin: 'PLATE123456789ABCD',
          make: predictionResult.make,
          model: predictionResult.model,
          year: predictionResult.year,
          mileage: predictionResult.mileage,
          trim: 'EX-L',
          engine: '1.5L I4 Turbo',
          transmission: predictionResult.transmission,
          drivetrain: 'FWD',
          bodyType: predictionResult.bodyType,
          fuelType: predictionResult.fuelType,
          exteriorColor: predictionResult.color,
          features: ['Bluetooth', 'Navigation', 'Leather Seats'],
          estimatedValue: predictionResult.estimatedValue,
          confidenceScore: predictionResult.confidenceScore,
          valuationId: `plate-${Date.now()}`
        };
      }
      
      setVehicle(result);
      setIsLoading(false);
      return result;
      
    } catch (error: any) {
      console.error('Vehicle lookup error:', error);
      setError(error.message || 'Failed to lookup vehicle');
      setIsLoading(false);
      return null;
    }
  };

  const lookupByVin = async (vin: string): Promise<DecodedVehicleInfo | null> => {
    return lookupVehicle('vin', vin);
  };

  const lookupByPlate = async (plate: string, state: string): Promise<DecodedVehicleInfo | null> => {
    return lookupVehicle('plate', plate, state);
  };

  return {
    isLoading,
    error,
    vehicle,
    vehicleData: vehicle, // Alias for compatibility
    lookupVehicle,
    lookupByVin,
    lookupByPlate,
    reset
  };
}
