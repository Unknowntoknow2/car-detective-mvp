
import { useState } from 'react';
import { PlateLookupInfo } from '@/types/lookup';
import { supabase } from '@/integrations/supabase/client';

export const usePlateLookup = () => {
  const [plateInfo, setPlateInfo] = useState<PlateLookupInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupPlate = async (plate: string, state: string): Promise<PlateLookupInfo | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock API call for now
      const mockData: PlateLookupInfo = {
        plate,
        state,
        make: 'Toyota',
        model: 'Camry',
        year: 2019,
        color: 'Silver',
        mileage: 45000,
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        bodyType: 'Sedan',
        estimatedValue: 18500,
        zipCode: '90210',
        condition: 'Good'
      };
      
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPlateInfo(mockData);
      return mockData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to lookup plate';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    plateInfo,
    isLoading,
    error,
    lookupPlate
  };
};
