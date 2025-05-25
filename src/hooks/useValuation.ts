
import { useState } from 'react';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { ValuationResponse } from '@/types/vehicle';
import { toast } from 'sonner';
import { getCarPricePrediction } from '@/services/carPricePredictionService';

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
      // Call the real car price prediction API
      const predictionResult = await getCarPricePrediction({
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        condition: formData.condition.toString(),
        zipCode: formData.zipCode,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        color: formData.color,
        bodyType: formData.bodyStyle,
        vin: formData.vin
      });
      
      const valuationData: ValuationResponse = {
        make: predictionResult.make,
        model: predictionResult.model,
        year: predictionResult.year,
        mileage: predictionResult.mileage,
        condition: predictionResult.condition,
        estimatedValue: predictionResult.estimatedValue,
        confidenceScore: predictionResult.confidenceScore,
        valuationId: `manual-${Date.now()}`,
        zipCode: formData.zipCode,
        fuelType: predictionResult.fuelType,
        transmission: predictionResult.transmission,
        bodyType: predictionResult.bodyType,
        color: predictionResult.color,
        trim: formData.trim,
        vin: predictionResult.vin,
        isPremium: false,
        price_range: {
          low: Math.round(predictionResult.estimatedValue * 0.95),
          high: Math.round(predictionResult.estimatedValue * 1.05)
        },
        adjustments: [],
        aiCondition: {
          condition: predictionResult.condition,
          confidenceScore: predictionResult.conditionScore,
          issuesDetected: []
        },
        userId: ''
      };
      
      setValuationData(valuationData);
      setIsLoading(false);
      
      return {
        success: true,
        data: valuationData
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
      // For VIN lookup, we need to decode first to get vehicle details
      // For now, using mock decode data and then calling real valuation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock decoded data - in real implementation, this would come from VIN decoder
      const decodedData = {
        make: 'Toyota',
        model: 'Camry',
        year: 2019,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        bodyType: 'Sedan',
        trim: 'LE',
        color: 'Silver'
      };

      // Call real valuation API with decoded data
      const predictionResult = await getCarPricePrediction({
        make: decodedData.make,
        model: decodedData.model,
        year: decodedData.year,
        mileage: 45000, // Default mileage for VIN lookup
        condition: 'good',
        zipCode: '90210', // Default zip
        fuelType: decodedData.fuelType,
        transmission: decodedData.transmission,
        color: decodedData.color,
        bodyType: decodedData.bodyType,
        vin: vin
      });
      
      const mockData: ValuationResponse = {
        make: predictionResult.make,
        model: predictionResult.model,
        year: predictionResult.year,
        mileage: 45000,
        condition: predictionResult.condition,
        estimatedValue: predictionResult.estimatedValue,
        confidenceScore: predictionResult.confidenceScore,
        valuationId: `vin-${Date.now()}`,
        vin: vin,
        fuelType: predictionResult.fuelType,
        transmission: predictionResult.transmission,
        bodyType: predictionResult.bodyType,
        trim: decodedData.trim,
        color: predictionResult.color,
        isPremium: false,
        price_range: {
          low: Math.round(predictionResult.estimatedValue * 0.95),
          high: Math.round(predictionResult.estimatedValue * 1.05)
        },
        aiCondition: {
          condition: predictionResult.condition,
          confidenceScore: predictionResult.confidenceScore,
          issuesDetected: []
        },
        userId: ''
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
      // For plate lookup, we need to decode first to get vehicle details
      // For now, using mock decode data and then calling real valuation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock decoded data - in real implementation, this would come from plate decoder
      const decodedData = {
        make: 'Honda',
        model: 'Accord',
        year: 2020,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        bodyType: 'Sedan',
        trim: 'Sport',
        color: 'Blue'
      };

      // Call real valuation API with decoded data
      const predictionResult = await getCarPricePrediction({
        make: decodedData.make,
        model: decodedData.model,
        year: decodedData.year,
        mileage: 35000, // Default mileage for plate lookup
        condition: 'excellent',
        zipCode: '90210', // Default zip
        fuelType: decodedData.fuelType,
        transmission: decodedData.transmission,
        color: decodedData.color,
        bodyType: decodedData.bodyType
      });
      
      const mockData: ValuationResponse = {
        make: predictionResult.make,
        model: predictionResult.model,
        year: predictionResult.year,
        mileage: 35000,
        condition: predictionResult.condition,
        estimatedValue: predictionResult.estimatedValue,
        confidenceScore: predictionResult.confidenceScore,
        valuationId: `plate-${Date.now()}`,
        fuelType: predictionResult.fuelType,
        transmission: predictionResult.transmission,
        bodyType: predictionResult.bodyType,
        trim: decodedData.trim,
        color: predictionResult.color,
        isPremium: false,
        price_range: {
          low: Math.round(predictionResult.estimatedValue * 0.95),
          high: Math.round(predictionResult.estimatedValue * 1.05)
        },
        aiCondition: {
          condition: predictionResult.condition,
          confidenceScore: predictionResult.confidenceScore,
          issuesDetected: []
        },
        userId: ''
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
