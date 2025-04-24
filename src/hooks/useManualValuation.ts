import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { calculateTotalAdjustment, VehicleCondition } from '@/utils/priceAdjustments';

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
      const baseValue = 20000;
      
      const totalAdjustment = calculateTotalAdjustment({
        mileage: data.mileage,
        condition: data.condition as VehicleCondition,
        zipCode: data.zipCode,
        basePrice: baseValue
      });
      
      const valuation = Math.round(baseValue + totalAdjustment);
      
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
