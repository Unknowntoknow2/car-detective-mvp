
import { useState, useEffect, useCallback } from 'react';
import { ValuationResponse } from '@/types/vehicle';
import { toast } from 'sonner';

export function useValuationResult(valuationId: string) {
  const [data, setData] = useState<ValuationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchValuationData = useCallback(async () => {
    if (!valuationId) {
      setError('No valuation ID provided');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsError(false);
    
    try {
      // In a real app, you would fetch from your API or Supabase
      // const { data, error } = await supabase
      //   .from('valuations')
      //   .select('*')
      //   .eq('id', valuationId)
      //   .single();
      
      // For demo, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock valuation data
      const mockData: ValuationResponse = {
        estimatedValue: 22500,
        confidenceScore: 85,
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 35000,
        condition: 'Good',
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        bodyType: 'Sedan',
        vin: valuationId.includes('vin=') ? valuationId.split('vin=')[1] : undefined,
        priceRange: [21500, 23500],
        price_range: [21500, 23500],
        photoUrl: 'https://example.com/car-photo.jpg',
        bestPhotoUrl: 'https://example.com/best-car-photo.jpg',
        zipCode: '90210',
        adjustments: [
          { factor: 'Mileage', impact: -500, description: 'Based on 35,000 miles' },
          { factor: 'Condition', impact: 1500, description: 'Good condition' },
          { factor: 'Market Demand', impact: 1500, description: 'High demand in your region' }
        ]
      };
      
      setData(mockData);
    } catch (err) {
      console.error('Error fetching valuation data:', err);
      setError('Failed to load valuation data');
      setIsError(true);
      toast.error('Failed to load valuation data');
    } finally {
      setIsLoading(false);
    }
  }, [valuationId]);

  useEffect(() => {
    fetchValuationData();
  }, [fetchValuationData]);

  return { 
    data, 
    isLoading, 
    error,
    isError,
    refetch: fetchValuationData
  };
}
