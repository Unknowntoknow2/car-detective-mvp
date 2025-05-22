
import { useState, useEffect } from 'react';
import { ValuationResponse } from '@/types/vehicle';
import { toast } from 'sonner';

export function useValuationResult(valuationId: string) {
  const [data, setData] = useState<ValuationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!valuationId) {
      setError('No valuation ID provided');
      return;
    }

    async function fetchValuationData() {
      setIsLoading(true);
      setError(null);
      
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
          vin: valuationId.includes('vin=') ? valuationId.split('vin=')[1] : undefined
        };
        
        setData(mockData);
      } catch (err) {
        console.error('Error fetching valuation data:', err);
        setError('Failed to load valuation data');
        toast.error('Failed to load valuation data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchValuationData();
  }, [valuationId]);

  return { data, isLoading, error };
}
