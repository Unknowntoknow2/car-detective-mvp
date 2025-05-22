import { useState, useEffect } from 'react';
import { ValuationResponse } from '@/types/vehicle';

interface ProcessedValuationResult {
  estimatedValue: number;
  confidenceScore: number;
  valuationId: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  vin?: string;
  plate?: string;
  state?: string;
  zipCode?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  trim?: string;
  color?: string;
  priceRange: { low: number; high: number };
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}

export const processValuationResponse = (data: ValuationResponse): ProcessedValuationResult => {
  return {
    estimatedValue: data.estimatedValue,
    confidenceScore: data.confidenceScore,
    valuationId: data.valuationId,
    make: data.make,
    model: data.model,
    year: data.year,
    mileage: data.mileage,
    condition: data.condition,
    vin: data.vin,
    plate: data.plate,
    state: data.state,
    zipCode: data.zipCode,
    fuelType: data.fuelType,
    transmission: data.transmission,
    bodyType: data.bodyType,
    trim: data.trim,
    color: data.color,
    priceRange: data.price_range ? {
      low: data.price_range.low || Math.floor(data.estimatedValue * 0.9),
      high: data.price_range.high || Math.floor(data.estimatedValue * 1.1)
    } : {
      low: Math.floor(data.estimatedValue * 0.9),
      high: Math.floor(data.estimatedValue * 1.1)
    },
    adjustments: data.adjustments,
  };
};

interface UseValuationResultProps {
  valuationId?: string;
  valuationData?: ValuationResponse | null;
}

export const useValuationResult = ({ valuationId, valuationData }: UseValuationResultProps) => {
  const [valuation, setValuation] = useState<ValuationResponse | null>(valuationData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchValuation = async () => {
      if (!valuationId) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // const response = await fetch(`/api/valuation/${valuationId}`);
        // if (!response.ok) {
        //   throw new Error(`Failed to fetch valuation: ${response.status}`);
        // }
        // const data: ValuationResponse = await response.json();
        const mockData: ValuationResponse = {
          estimatedValue: 15000,
          confidenceScore: 92,
          valuationId: valuationId,
          make: 'Honda',
          model: 'Civic',
          year: 2018,
          mileage: 60000,
          condition: 'Good',
          vin: '1234567890ABCDEFG',
          plate: 'ABC-123',
          state: 'CA',
          zipCode: '90210',
          fuelType: 'Gasoline',
          transmission: 'Automatic',
          bodyType: 'Sedan',
          trim: 'LX',
          color: 'Silver',
          price_range: { low: 13000, high: 17000 },
          adjustments: [
            { factor: 'Mileage', impact: -5, description: 'High mileage adjustment' },
            { factor: 'Condition', impact: 8, description: 'Good condition adjustment' }
          ]
        };
        setValuation(mockData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch valuation');
      } finally {
        setIsLoading(false);
      }
    };

    if (valuationId && !valuation) {
      fetchValuation();
    }
  }, [valuationId, valuation]);

  return {
    valuation: valuation ? processValuationResponse(valuation) : null,
    isLoading,
    error,
  };
};
