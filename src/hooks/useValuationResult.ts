
import { useState, useEffect } from 'react';

interface ValuationResult {
  valuationId: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  confidenceScore: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  explanation?: string;
}

export function useValuationResult(valuationId: string) {
  const [data, setData] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchValuationData = async () => {
      if (!valuationId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Try to get data from localStorage first (for demo purposes)
        const storedData = localStorage.getItem(`valuation_${valuationId}`);
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          
          // Add missing properties for display if needed
          if (!parsedData.priceRange) {
            const baseValue = parsedData.estimatedValue || 20000;
            parsedData.priceRange = [
              Math.round(baseValue * 0.95),
              Math.round(baseValue * 1.05)
            ];
          }

          if (!parsedData.adjustments) {
            parsedData.adjustments = [
              {
                factor: 'Base Value',
                impact: 0,
                description: 'Starting value based on make, model, year'
              },
              {
                factor: 'Mileage Adjustment',
                impact: -500,
                description: 'Impact of vehicle mileage on value'
              },
              {
                factor: 'Condition',
                impact: parsedData.condition === 'Excellent' ? 1000 : 
                       parsedData.condition === 'Good' ? 0 : 
                       parsedData.condition === 'Fair' ? -1000 : -2000,
                description: `Vehicle is in ${parsedData.condition} condition`
              }
            ];
          }
          
          setData(parsedData as ValuationResult);
        } else {
          // In a real app, you'd fetch from an API here
          throw new Error('Valuation data not found');
        }
      } catch (err) {
        console.error('Error fetching valuation data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch valuation data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchValuationData();
  }, [valuationId]);

  return { data, isLoading, error };
}
