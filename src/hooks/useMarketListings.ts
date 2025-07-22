
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarketListing } from '@/types/valuation';

interface UseMarketListingsProps {
  make?: string;
  model?: string;
  year?: number;
  zipCode?: string;
  vin?: string;
  exact?: boolean;
}

export function useMarketListings({
  make,
  model,
  year,
  zipCode,
  vin,
  exact = false
}: UseMarketListingsProps) {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListings() {
      if (!make && !model && !vin) {
        setListings([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching market listings with params:', { make, model, year, zipCode, vin, exact });
        
        // Try to fetch exact VIN match first if provided
        if (vin) {
          const { data: vinMatches, error: vinError } = await supabase
            .from('market_listings')
            .select('*')
            .eq('vin', vin)
            .limit(10);
            
          if (!vinError && vinMatches && vinMatches.length > 0) {
            console.log(`Found ${vinMatches.length} exact VIN matches`);
            setListings(vinMatches);
            setLoading(false);
            return;
          }
        }
        
        // Build query for make/model/year
        let query = supabase
          .from('market_listings')
          .select('*')
          .order('fetched_at', { ascending: false });
          
        if (make) query = query.ilike('make', `%${make}%`);
        if (model) query = query.ilike('model', `%${model}%`);
        
        // For year, use exact match if requested, otherwise use a range
        if (year) {
          if (exact) {
            query = query.eq('year', year);
          } else {
            // Use a +/- 2 year range if not exact
            query = query
              .gte('year', year - 2)
              .lte('year', year + 2);
          }
        }
        
        // Add zip code filter if provided
        if (zipCode) query = query.eq('zip_code', zipCode);
        
        // Execute query with limit
        const { data: listings, error: listingsError } = await query.limit(30);
        
        if (listingsError) {
          console.error('Error fetching market listings:', listingsError);
          setError('Failed to fetch market listings');
          setListings([]);
        } else if (listings && listings.length > 0) {
          console.log(`Found ${listings.length} market listings`);
          setListings(listings);
        } else {
          console.log('No listings found, trying broader search...');
          
          // Try a broader search without year exact match
          let broadQuery = supabase
            .from('market_listings')
            .select('*')
            .order('fetched_at', { ascending: false });
            
          if (make) broadQuery = broadQuery.ilike('make', `%${make}%`);
          
          const { data: broadListings, error: broadError } = await broadQuery.limit(50);
          
          if (!broadError && broadListings && broadListings.length > 0) {
            console.log(`Found ${broadListings.length} listings in broader search`);
            setListings(broadListings);
          } else {
            console.log('No listings found in broader search');
            setListings([]);
          }
        }
      } catch (err) {
        console.error('Error in useMarketListings hook:', err);
        setError('An unexpected error occurred');
        setListings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [make, model, year, zipCode, vin, exact]);

  return { listings, loading, error };
}
