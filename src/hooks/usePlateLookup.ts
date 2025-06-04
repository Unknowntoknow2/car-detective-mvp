
import { useState } from 'react';
import { PlateLookupInfo } from '@/types/lookup';
import { ApiResponse } from '@/types/api';

export interface UsePlateLookupOptions {
  tier?: 'free' | 'premium';
  includePremiumData?: boolean;
}

export const usePlateLookup = (options: UsePlateLookupOptions = {}) => {
  const { tier = 'free', includePremiumData = false } = options;
  
  const [plateInfo, setPlateInfo] = useState<PlateLookupInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupPlateData = async (plate: string, state: string): Promise<PlateLookupInfo | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
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
    lookupPlate: lookupPlateData,
    clearData
  };
};
