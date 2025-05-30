
import { useState, useEffect } from 'react';

interface ValuationData {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  zipCode?: string;
  vin?: string;
  isPremium?: boolean;
}

export function useValuationData(valuationId: string) {
  const [valuationData, setValuationData] = useState<ValuationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchValuationData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: ValuationData = {
          make: 'Toyota',
          model: 'Test Vehicle',
          year: 2020,
          mileage: 50000,
          condition: 'Good',
          estimatedValue: 25000,
          confidenceScore: 85,
          zipCode: '12345',
          vin: valuationId,
          isPremium: false
        };
        
        setValuationData(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to load valuation data');
        setValuationData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (valuationId) {
      fetchValuationData();
    }
  }, [valuationId]);

  return {
    valuationData,
    isLoading,
    error
  };
}
