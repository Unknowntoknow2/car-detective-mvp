
import { useState } from 'react';
import { PlateLookupInfo } from '@/types/lookup';
import { lookupPlate } from '@/services/plateService';

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
      const response = await lookupPlate(plate, state);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to lookup plate');
      }
      
      let vehicleData = response.data;
      
      // Enhanced data for premium tier
      if (tier === 'premium' || includePremiumData) {
        vehicleData = {
          ...vehicleData,
          // Add premium-specific fields
          detailedHistory: true,
          marketInsights: {
            averagePrice: vehicleData.estimatedValue || 0,
            priceRange: [
              (vehicleData.estimatedValue || 0) * 0.9,
              (vehicleData.estimatedValue || 0) * 1.1
            ],
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
