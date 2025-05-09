
import { useState } from 'react';
import { toast } from 'sonner';
import { calculateFinalValuation } from '@/utils/valuationEngine';
import { AdjustmentBreakdown } from '@/types/photo';

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
      // The baseMarketValue must be provided in the params object
      const valuationParams = {
        make: data.make,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        condition: data.condition,
        zipCode: data.zipCode || '90210',
        trim: data.trim,
        accidentCount: data.accidentCount,
        features: data.premiumFeatures,
        baseMarketValue: 25000 // Default base value
      };
      
      const result = await calculateFinalValuation(valuationParams);

      // Convert the result adjustments to AdjustmentBreakdown format
      const adjustments: AdjustmentBreakdown[] = (result.adjustments || []).map(adj => {
        return {
          name: adj.name || 'Unknown',
          factor: adj.factor || adj.name || 'Unknown',
          impact: adj.impact || 0,
          value: adj.value || adj.impact || 0,
          description: adj.description || '',
          percentAdjustment: adj.percentAdjustment || adj.percentage || 0,
          // Add empty properties to satisfy the interface
          adjustment: 0,
          impactPercentage: 0
        };
      });

      const valuationResult: ManualVehicleInfo = {
        ...data,
        valuation: result.estimatedValue || result.finalValue,
        confidenceScore: result.confidenceScore,
        adjustments: adjustments,
        priceRange: result.priceRange || [result.finalValue * 0.9, result.finalValue * 1.1]
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
