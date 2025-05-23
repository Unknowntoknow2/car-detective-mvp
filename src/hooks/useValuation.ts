
import { useState } from 'react';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { ValuationResponse } from '@/types/vehicle';
import { toast } from 'sonner';

export function useValuation() {
  const [valuationData, setValuationData] = useState<ValuationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle manual valuation
  const manualValuation = async (formData: ManualEntryFormData): Promise<{
    success: boolean;
    data?: ValuationResponse;
    error?: string;
  }> => {
    setIsLoading(true);
    setError(null);

    try {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response - simulating API valuation calculation
      const calculatedValue = 10000 + (Math.random() * 15000);
      
      const mockValuationData: ValuationResponse = {
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        condition: formData.condition.toString(),
        estimatedValue: Math.round(calculatedValue),
        confidenceScore: 85,
        valuationId: `manual-${Date.now()}`,
        zipCode: formData.zipCode,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        bodyType: formData.bodyStyle,
        color: formData.color,
        trim: formData.trim,
        vin: formData.vin,
        isPremium: false,
        price_range: {
          low: Math.round(calculatedValue * 0.95),
          high: Math.round(calculatedValue * 1.05)
        },
        adjustments: [],
        aiCondition: {
          condition: formData.condition.toString(),
          confidenceScore: 85,
          issuesDetected: []
        }
      };
      
      setValuationData(mockValuationData);
      setIsLoading(false);
      
      return {
        success: true,
        data: mockValuationData
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process valuation';
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  // Function to decode VIN
  const decodeVin = async (vin: string): Promise<{
    success: boolean;
    data?: ValuationResponse;
    error?: string;
  }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock VIN decoding response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: ValuationResponse = {
        make: 'Toyota',
        model: 'Camry',
        year: 2019,
        mileage: 45000,
        condition: 'Good',
        estimatedValue: 18500,
        confidenceScore: 90,
        valuationId: `vin-${Date.now()}`,
        vin: vin,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        bodyType: 'Sedan',
        trim: 'LE',
        color: 'Silver',
        isPremium: false,
        price_range: {
          low: 17575,
          high: 19425
        },
        aiCondition: {
          condition: 'Good',
          confidenceScore: 90,
          issuesDetected: []
        }
      };
      
      setValuationData(mockData);
      setIsLoading(false);
      
      return {
        success: true,
        data: mockData
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decode VIN';
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  // Function to decode license plate
  const decodePlate = async (plate: string, state: string): Promise<{
    success: boolean;
    data?: ValuationResponse;
    error?: string;
  }> => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock plate decoding response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: ValuationResponse = {
        make: 'Honda',
        model: 'Accord',
        year: 2020,
        mileage: 35000,
        condition: 'Excellent',
        estimatedValue: 22500,
        confidenceScore: 85,
        valuationId: `plate-${Date.now()}`,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        bodyType: 'Sedan',
        trim: 'Sport',
        color: 'Blue',
        isPremium: false,
        price_range: {
          low: 21375,
          high: 23625
        },
        aiCondition: {
          condition: 'Excellent',
          confidenceScore: 85,
          issuesDetected: []
        }
      };
      
      setValuationData(mockData);
      setIsLoading(false);
      
      return {
        success: true,
        data: mockData
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decode license plate';
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  // Function to reset valuation state
  const resetValuation = () => {
    setValuationData(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    valuationData,
    isLoading,
    error,
    manualValuation,
    decodeVin,
    decodePlate,
    resetValuation
  };
}
