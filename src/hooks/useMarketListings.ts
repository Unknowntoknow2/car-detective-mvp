
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Simple type definitions to avoid excessive type inference
interface MarketData {
  averages: Record<string, number>;
  sources: Record<string, string>;
}

// Completely separate interface for database operations
interface MarketListingInsert {
  source: string;
  price: number;
  url: string | null;
  valuation_id: string;
  make: string | null;
  model: string | null;
  year: number | null;
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
          .select('source, price, url')
          .eq('make', make)
          .eq('model', model)
          .eq('year', year)
          .order('created_at', { ascending: false })
          .limit(10);
        
        // Simple array type
        const existingListings = data || [];

        if (!fetchError && existingListings.length > 0) {
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
        const response = await supabase.functions.invoke('fetch-market-listings', {
          body: { zipCode, make, model, year }
        });

        if (response.error) throw response.error;
        
        // Explicitly define the type
        const responseData = response.data as {
          zipCode: string;
          averages: Record<string, number>;
          sources: Record<string, string>;
        };
        
        if (responseData) {
          // Create a properly typed market data object
          const marketResponse: MarketData = {
            averages: responseData.averages,
            sources: responseData.sources
          };
          
          setMarketData(marketResponse);
          
          // Store the market listings in our database for future reference
          for (const [source, price] of Object.entries(marketResponse.averages)) {
            // Create a properly typed object for insertion
            const newListing: MarketListingInsert = {
              source,
              price: Number(price),
              url: marketResponse.sources[source],
              make,
              model,
              year,
              valuation_id: crypto.randomUUID()
            };
            
            // Insert with the properly typed object
            await supabase.from('market_listings').insert(newListing);
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
