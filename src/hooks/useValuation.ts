
import { useState } from 'react';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { ValuationResponse } from '@/types/api';

export const useValuation = () => {
  const [valuationData, setValuationData] = useState<ValuationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manualValuation = async (formData: ManualEntryFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate a mock estimated value based on year, mileage, and condition
      const baseValue = (2023 - formData.year) * 1000;
      const mileageAdjustment = formData.mileage ? -formData.mileage / 100 : 0;
      const conditionAdjustment = 
        formData.condition === 'Excellent' ? 3000 :
        formData.condition === 'Good' ? 1500 :
        formData.condition === 'Fair' ? 0 : -1500;
      
      const calculatedValue = 20000 - baseValue + mileageAdjustment + conditionAdjustment;
      const finalValue = Math.max(calculatedValue, 1000);
      
      // Set valuation data
      const valuationData: ValuationResponse = {
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        condition: formData.condition,
        zipCode: formData.zipCode,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        bodyType: formData.bodyStyle,
        color: formData.color,
        trim: formData.trim,
        accidents: formData.accidents?.hasAccident ? 1 : 0,
        estimatedValue: finalValue,
        confidenceScore: 85,
        valuationId: `manual-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
      };

      setValuationData(valuationData);
      return { success: true, data: valuationData };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    valuationData,
    isLoading,
    error,
    manualValuation
  };
};

export default useValuation;
