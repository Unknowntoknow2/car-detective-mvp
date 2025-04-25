
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MarketData {
  averages: { [source: string]: number };
  sources: { [source: string]: string };
}

interface MarketListing {
  id?: string;
  source: string;
  price: number;
  url?: string;
  valuation_id: string;
  created_at?: string;
  listing_date?: string;
  make?: string;
  model?: string;
  year?: number;
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
        // First check if we already have recent market data in our database
        const { data, error: fetchError } = await supabase
          .from('market_listings')
          .select('*')
          .eq('make', make)
          .eq('model', model)
          .eq('year', year)
          .order('created_at', { ascending: false })
          .limit(10);
        
        // Explicitly cast data to MarketListing[] type to avoid deep type inference
        const existingListings = data as MarketListing[] | null;

        if (!fetchError && existingListings && existingListings.length > 0) {
          // Process existing listings into the format we need
          const sources: Record<string, string> = {};
          const pricesBySource: Record<string, number[]> = {};
          
          existingListings.forEach(listing => {
            if (!pricesBySource[listing.source]) {
              pricesBySource[listing.source] = [];
              sources[listing.source] = listing.url || '#';
            }
            
            pricesBySource[listing.source].push(listing.price);
          });
          
          // Calculate averages for each source
          const averages: Record<string, number> = {};
          Object.entries(pricesBySource).forEach(([source, prices]) => {
            const sum = prices.reduce((a, b) => a + b, 0);
            averages[source] = Math.round(sum / prices.length);
          });
          
          setMarketData({ averages, sources });
          setIsLoading(false);
          return;
        }

        // If no existing recent data, fetch from the edge function
        const { data: responseData, error: responseError } = await supabase.functions.invoke('fetch-market-listings', {
          body: { zipCode, make, model, year }
        });

        if (responseError) throw responseError;
        
        if (responseData) {
          // Explicitly cast to MarketData to avoid deep type inference
          const typedData = responseData as MarketData;
          setMarketData(typedData);
          
          // Store the market listings in our database for future reference
          for (const [source, price] of Object.entries(typedData.averages)) {
            // Insert each market listing individually
            await supabase.from('market_listings').insert({
              source,
              price: price as number,
              url: typedData.sources[source],
              make,
              model,
              year,
              valuation_id: crypto.randomUUID()
            } as MarketListing);
          }
        }
      } catch (err) {
        console.error('Error fetching market listings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch market listings');
        toast.error('Could not retrieve market offers data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, [zipCode, make, model, year]);

  return { marketData, isLoading, error };
};
