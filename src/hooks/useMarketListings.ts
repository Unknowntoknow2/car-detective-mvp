
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MarketListing {
  id: string;
  price: number;
  mileage: number;
  year: number;
  make: string;
  model: string;
  source: string;
  dealer_name: string;
  location: string;
  listing_url: string;
  fetched_at: string;
  confidence_score: number;
}

interface MarketListingsResponse {
  listings: MarketListing[];
  cached: boolean;
  searchStrategy: string;
  timestamp: string;
  error?: string;
}

export function useMarketListings(make: string, model: string, year: number, zipCode: string) {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchStrategy, setSearchStrategy] = useState<string>('');

  useEffect(() => {
    async function fetchMarketListings() {
      try {
        setLoading(true);
        setError(null);

        console.log(`🔍 Fetching market listings for ${year} ${make} ${model} in ${zipCode}`);

        // First try the enhanced search-market-listings edge function
        const response = await fetch('/functions/v1/search-market-listings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            make,
            model,
            year,
            zip: zipCode,
            mileage: 80000 // Default estimated mileage
          }),
        });

        if (response.ok) {
          const data: MarketListingsResponse = await response.json();
          console.log(`📊 Edge function returned ${data.listings?.length || 0} listings`);
          
          if (data.listings && data.listings.length > 0) {
            setListings(data.listings);
            setSearchStrategy(data.searchStrategy || 'edge-function');
            return;
          }
        } else {
          console.warn('⚠️ Edge function failed, falling back to direct database query');
        }

        // Fallback: Direct database query with improved logic
        await fetchFromDatabase();

      } catch (err) {
        console.error('Error in useMarketListings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch market listings');
        
        // Even on error, try to get some data
        await fetchFromDatabase();
      } finally {
        setLoading(false);
      }
    }

    async function fetchFromDatabase() {
      try {
        // Enhanced database query strategy
        let dbListings: any[] = [];

        // Step 1: Exact match (same year, make, model)
        const { data: exactMatches } = await supabase
          .from('market_listings')
          .select('*')
          .ilike('make', `%${make}%`)
          .ilike('model', `%${model}%`)
          .eq('year', year)
          .gte('fetched_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('fetched_at', { ascending: false })
          .limit(15);

        if (exactMatches && exactMatches.length >= 3) {
          dbListings = exactMatches;
          setSearchStrategy('exact-db-match');
        } else {
          // Step 2: Broader search (±2 years)
          const { data: broadMatches } = await supabase
            .from('market_listings')
            .select('*')
            .ilike('make', `%${make}%`)
            .ilike('model', `%${model}%`)
            .gte('year', year - 2)
            .lte('year', year + 2)
            .gte('fetched_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
            .order('fetched_at', { ascending: false })
            .limit(20);

          dbListings = broadMatches || [];
          setSearchStrategy('broad-db-search');
        }

        // Transform and filter database results
        const transformedListings = dbListings
          .map(transformDbListing)
          .filter(listing => listing.price > 1000 && listing.price < 200000)
          .sort((a, b) => {
            // Prioritize exact year matches
            if (a.year === year && b.year !== year) return -1;
            if (b.year === year && a.year !== year) return 1;
            return b.confidence_score - a.confidence_score;
          })
          .slice(0, 10);

        console.log(`📊 Database fallback found ${transformedListings.length} listings`);
        setListings(transformedListings);

      } catch (dbError) {
        console.error('Database fallback failed:', dbError);
        setError('Unable to fetch market data');
      }
    }

    function transformDbListing(dbListing: any): MarketListing {
      return {
        id: dbListing.id || crypto.randomUUID(),
        price: dbListing.price || 0,
        mileage: dbListing.mileage || 0,
        year: dbListing.year || year,
        make: dbListing.make || make,
        model: dbListing.model || model,
        source: dbListing.source || 'Market Data',
        dealer_name: dbListing.dealer_name || 'Private Seller',
        location: dbListing.location || zipCode,
        listing_url: dbListing.listing_url || '#',
        fetched_at: dbListing.fetched_at || new Date().toISOString(),
        confidence_score: dbListing.confidence_score || 75
      };
    }

    if (make && model && year) {
      fetchMarketListings();
    }
  }, [make, model, year, zipCode]);

  return { 
    listings, 
    loading, 
    error,
    searchStrategy,
    listingCount: listings.length 
  };
}
