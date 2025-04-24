
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type ManualVehicleInfo = {
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  condition: string;
  zipCode?: string;
  valuation?: number;
  confidenceScore?: number;
};

export function useManualValuation() {
  const [vehicleInfo, setVehicleInfo] = useState<ManualVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculateValuation = async (data: Omit<ManualVehicleInfo, 'valuation' | 'confidenceScore'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This is a simplified valuation algorithm - in a real app, you'd call an API
      // Mock calculation based on vehicle details
      const baseValue = 20000; // Base value
      
      // Year adjustment (newer cars worth more)
      const yearFactor = (data.year - 1980) / 45; // Normalized between 0 and 1
      
      // Mileage adjustment (lower mileage worth more)
      const mileageFactor = Math.max(0, 1 - (data.mileage / 200000));
      
      // Condition adjustment
      const conditionFactors = {
        'excellent': 1.2,
        'good': 1.0,
        'fair': 0.8,
        'poor': 0.6
      };
      
      const conditionFactor = conditionFactors[data.condition as keyof typeof conditionFactors] || 1.0;
      
      // Fuel type adjustment
      const fuelTypeFactors = {
        'electric': 1.3,
        'hybrid': 1.2,
        'gasoline': 1.0,
        'diesel': 0.9
      };
      
      const fuelTypeFactor = fuelTypeFactors[data.fuelType.toLowerCase() as keyof typeof fuelTypeFactors] || 1.0;
      
      // Calculate valuation
      const valuation = Math.round(baseValue * yearFactor * mileageFactor * conditionFactor * fuelTypeFactor);
      
      // Calculate confidence score (70-95%)
      const confidenceScore = Math.round(70 + Math.random() * 25);
      
      const result: ManualVehicleInfo = {
        ...data,
        valuation,
        confidenceScore
      };
      
      setVehicleInfo(result);
      
      toast.success("Vehicle valuation completed");
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate valuation';
      setError(errorMessage);
      setVehicleInfo(null);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setVehicleInfo(null);
    setError(null);
  };

  return {
    vehicleInfo,
    isLoading,
    error,
    calculateValuation,
    reset
  };
}
