
import { useState } from 'react';
import { ValuationInput } from '@/utils/valuation/types';

export const useValuation = () => {
  const [valuationResult, setValuationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(error.message || 'An error occurred while processing your valuation');
      return { 
        success: false, 
        errorMessage: error.message || 'An error occurred while processing your valuation' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Add generateValuation function that works the same as submitValuation
  const generateValuation = async (formData: ValuationInput): Promise<{ 
    success: boolean; 
    valuationId?: string; 
    confidenceScore?: number;
    error?: string;
  }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate form data
      if (!formData.zipCode) {
        throw new Error('Please enter a valid ZIP code');
      }
      
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = {
        success: true,
        valuationId: `val-${Date.now()}`,
        confidenceScore: 85,
      };
      
      return result;
    } catch (error: any) {
      console.error('Valuation generation error:', error);
      setError(error.message || 'Failed to generate valuation');
      return { 
        success: false, 
        error: error.message || 'Failed to generate valuation' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    valuationResult,
    isLoading,
    error,
    submitValuation,
    generateValuation
  };
};
