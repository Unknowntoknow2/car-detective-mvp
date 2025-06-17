
import { useState, useEffect } from 'react';

export interface ValuationResult {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  estimatedValue: number;
  confidenceScore: number;  
  price_range?: [number, number] | { low: number; high: number };
  adjustments?: Array<{
    factor: string;
    description: string;
    impact: number;
  }>;
  created_at?: string;
  zipCode?: string;
}

export const useValuationResult = (id?: string) => {
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true);
        
        // Mock data for now - replace with actual API call
        const mockResult: ValuationResult = {
          id: id || 'mock-id',
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          mileage: 50000,
          condition: 'good',
          estimatedValue: 25000,
          confidenceScore: 85,
          price_range: [22000, 28000],
          adjustments: [
            {
              factor: 'Mileage',
              description: 'Below average mileage',
              impact: 1500
            }
          ]
        };
        
        setResult(mockResult);
      } catch (err) {
        setError('Failed to fetch valuation result');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  return { result, isLoading, error };
};
