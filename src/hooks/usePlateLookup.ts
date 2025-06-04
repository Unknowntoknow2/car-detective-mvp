<<<<<<< HEAD

import { useState } from 'react';
import { PlateLookupInfo } from '@/types/lookup';
import { ApiResponse } from '@/types/api';
=======
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PlateLookupInfo } from "@/types/lookup";
import { mockPlateLookup } from "@/services/plateService";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export interface UsePlateLookupOptions {
  tier?: 'free' | 'premium';
  includePremiumData?: boolean;
}

export const usePlateLookup = (options: UsePlateLookupOptions = {}) => {
  const { tier = 'free', includePremiumData = false } = options;
  
  const [plateInfo, setPlateInfo] = useState<PlateLookupInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

<<<<<<< HEAD
  const lookupPlateData = async (plate: string, state: string): Promise<PlateLookupInfo | null> => {
=======
  const lookupVehicle = async (
    plate: string,
    state: string,
  ): Promise<PlateLookupInfo | null> => {
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    setIsLoading(true);
    setError(null);

    try {
<<<<<<< HEAD
      // Simulate API delay based on tier
      const delay = tier === 'premium' ? 1500 : 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Base mock data
      const baseData: PlateLookupInfo = {
        plate,
        state,
        make: 'Toyota',
        model: 'Camry',
        year: 2019,
        vin: 'JT2BF22K1W0123456',
        color: 'Silver',
        mileage: 45000,
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        bodyType: 'Sedan',
        estimatedValue: 18500,
        zipCode: '90210',
        condition: 'Good'
      };

      let vehicleData = baseData;

      // Enhanced data for premium tier
      if (tier === 'premium' || includePremiumData) {
        vehicleData = {
          ...vehicleData,
          detailedHistory: true,
          marketInsights: {
            averagePrice: vehicleData.estimatedValue || 0,
            priceRange: [
              (vehicleData.estimatedValue || 0) * 0.9,
              (vehicleData.estimatedValue || 0) * 1.1
            ] as [number, number],
            marketTrend: 'stable'
          },
          serviceRecords: [],
          accidentHistory: {
            reported: false,
            details: []
          }
        };
      }
      
      setPlateInfo(vehicleData);
      return vehicleData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to lookup plate';
      setError(errorMessage);
      setPlateInfo(null);
=======
      // Use the mockPlateLookup function from plateService
      const response = await mockPlateLookup(plate, state);

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error("No data returned from plate lookup");
      }

      const plateResult: PlateLookupInfo = response.data;

      // Add estimated value if not present
      if (!plateResult.estimatedValue) {
        plateResult.estimatedValue = 24500; // Default value
      }

      setResult(plateResult);
      toast({
        description:
          `${plateResult.year} ${plateResult.make} ${plateResult.model}`,
      });

      return plateResult;
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : "Unknown error during plate lookup";
      setError(errorMessage);
      toast({
        description: errorMessage,
        variant: "destructive",
      });

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setPlateInfo(null);
    setError(null);
  };

  return {
    plateInfo,
    isLoading,
    error,
<<<<<<< HEAD
    lookupPlate: lookupPlateData,
    clearData
=======
    result,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  };
};
