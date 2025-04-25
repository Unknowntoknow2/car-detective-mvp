
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MarketData {
  averages: { [source: string]: number };
  sources: { [source: string]: string };
}

export const useMarketListings = (zipCode: string, make: string, model: string, year: number) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      if (!zipCode || !make || !model || !year) return;
      
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.functions.invoke('fetch-market-listings', {
          body: { zipCode, make, model, year }
        });

        if (error) throw error;
        setMarketData(data);
      } catch (err) {
        console.error('Error fetching market listings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch market listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, [zipCode, make, model, year]);

  return { marketData, isLoading, error };
};
