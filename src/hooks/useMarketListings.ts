
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MarketData } from '@/types/marketListings';
import { processExistingListings } from '@/utils/marketListings/processListings';
import { fetchMarketListings, fetchNewListings, storeMarketListings } from '@/services/marketListings';

export const useMarketListings = (zipCode: string, make: string, model: string, year: number) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!zipCode || !make || !model || !year) return;
      
      setIsLoading(true);
      setError(null);

      try {
        // Check existing listings
        const { data: existingData, error: fetchError } = await fetchMarketListings(make, model, year);
        
        if (!fetchError && existingData && existingData.length > 0) {
          const processedData = processExistingListings(existingData);
          setMarketData(processedData);
          setIsLoading(false);
          return;
        }

        // Fetch new listings if no existing data
        const response = await fetchNewListings(zipCode, make, model, year);
        if (response.error) throw response.error;
        
        if (response.data) {
          const newMarketData: MarketData = {
            averages: response.data.averages,
            sources: response.data.sources
          };
          
          setMarketData(newMarketData);
          await storeMarketListings(newMarketData, make, model, year);
        }
      } catch (err) {
        console.error('Error fetching market listings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch market listings');
        toast.error('Could not retrieve market offers data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [zipCode, make, model, year]);

  return { marketData, isLoading, error };
};
