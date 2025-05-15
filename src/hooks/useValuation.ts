import { useState } from 'react';
import { ValuationInput } from '@/utils/valuation/types';

export const useValuation = () => {
  const [valuationResult, setValuationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const submitValuation = async (formData: ValuationInput): Promise<{ success: boolean; data?: any; errorMessage?: string }> => {
    setIsLoading(true);
    try {
      // Validate form data
      if (!formData.zipCode) {
        throw new Error('Please enter a valid ZIP code');
      }
      
      // Simulate API response - in a real app, this would be an API call
      const response = {
        success: true,
        valuationId: '123456',
        confidenceScore: 85,
        // Add error property for error handling in catch block
        error: null
      };

      if (!response.success) {
        throw new Error(response.error || 'Failed to submit valuation');
      }

      // Simulate successful valuation
      setValuationResult({
        valuationId: response.valuationId,
        confidenceScore: response.confidenceScore,
      });
      
      return { success: true, data: response };
    } catch (error: any) {
      console.error('Valuation error:', error);
      return { 
        success: false, 
        errorMessage: error.message || 'An error occurred while processing your valuation' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    valuationResult,
    isLoading,
    submitValuation
  };
};
