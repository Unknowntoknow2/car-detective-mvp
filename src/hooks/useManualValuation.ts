
import { useState } from 'react';
import { toast } from 'sonner';
import { calculateFinalValuation } from '@/utils/valuationEngine';
import { AdjustmentBreakdown } from '@/utils/rules/types';

export type ManualVehicleInfo = {
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  condition: string;
  zipCode?: string;
  trim?: string;
  accidentCount?: number;
  premiumFeatures?: string[];
  valuation?: number;
  confidenceScore?: number;
  adjustments?: AdjustmentBreakdown[];
  priceRange?: [number, number];
};

export function useManualValuation() {
  const [vehicleInfo, setVehicleInfo] = useState<ManualVehicleInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculateValuationData = async (data: Omit<ManualVehicleInfo, 'valuation' | 'confidenceScore'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fix: Pass an empty object as the second parameter for options
      const result = await calculateFinalValuation(
        {
          make: data.make,
          model: data.model,
          year: data.year,
          mileage: data.mileage,
          condition: data.condition,
          zipCode: data.zipCode || '90210',
          trim: data.trim,
          accidentCount: data.accidentCount,
          // Fixed: Pass the array directly instead of converting to boolean
          features: data.premiumFeatures
        }, 
        0 // Add a basePrice parameter (0 as placeholder)
      );
      
      // Map the result adjustments to the correct format including factor and impact
      const adjustments: AdjustmentBreakdown[] = (result.adjustments || []).map(adj => ({
        factor: adj.factor || adj.name || 'Unknown',
        impact: adj.impact || adj.value || 0,
        name: adj.name || adj.factor || 'Unknown',
        value: adj.value || adj.impact || 0,
        description: adj.description || '',
        percentAdjustment: adj.percentAdjustment || 0
      }));
      
      // Now result is properly typed, not 'never'
      const valuationResult: ManualVehicleInfo = {
        ...data,
        valuation: result.estimatedValue,
        confidenceScore: result.confidenceScore,
        adjustments: adjustments,
        priceRange: result.priceRange
      };
      
      setVehicleInfo(valuationResult);
      toast.success("Vehicle valuation completed");
      return valuationResult;
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
    calculateValuation: calculateValuationData,
    reset
  };
}
