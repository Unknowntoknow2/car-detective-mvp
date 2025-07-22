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

export function useMarketListings(make: string, model: string, year: number, zipCode: string) {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarketListings() {
      try {
        setLoading(true);
        setError(null);

        console.log(`🔍 Fetching market listings for ${year} ${make} ${model} in ${zipCode}`);

        // First try exact match (year, make, model, zip)
        let { data: exactMatches, error: exactError } = await supabase
          .from('market_listings')
          .select('*')
          .ilike('make', `%${make}%`)
          .ilike('model', `%${model}%`)
          .eq('year', year)
          .eq('zip_code', zipCode)
          .order('fetched_at', { ascending: false })
          .limit(10);

        if (exactError) {
          console.error('Error fetching exact matches:', exactError);
        }

        console.log(`📊 Found ${exactMatches?.length || 0} exact matches`);

        // If no exact matches, try same year without zip restriction
        if (!exactMatches || exactMatches.length === 0) {
          console.log('🔍 No exact matches, trying same year without zip restriction');
          
          const { data: yearMatches, error: yearError } = await supabase
            .from('market_listings')
            .select('*')
            .ilike('make', `%${make}%`)
            .ilike('model', `%${model}%`)
            .eq('year', year)
            .order('fetched_at', { ascending: false })
            .limit(10);

          if (yearError) {
            console.error('Error fetching year matches:', yearError);
          }

          exactMatches = yearMatches;
          console.log(`📊 Found ${exactMatches?.length || 0} year matches`);
        }

        // If still no matches, try broader search (±2 years)
        if (!exactMatches || exactMatches.length < 3) {
          console.log('🔍 Few matches found, expanding to ±2 years');
          
          const { data: broadMatches, error: broadError } = await supabase
            .from('market_listings')
            .select('*')
            .ilike('make', `%${make}%`)
            .ilike('model', `%${model}%`)
            .gte('year', year - 2)
            .lte('year', year + 2)
            .order('fetched_at', { ascending: false })
            .limit(20);

          if (broadError) {
            console.error('Error fetching broad matches:', broadError);
          }

          // Combine exact matches with broad matches, prioritizing exact matches
          const combinedMatches = [
            ...(exactMatches || []),
            ...(broadMatches || []).filter(broad => 
              !(exactMatches || []).some(exact => exact.id === broad.id)
            )
          ];

          exactMatches = combinedMatches.slice(0, 10);
          console.log(`📊 Found ${exactMatches?.length || 0} combined matches`);
        }

        setListings(exactMatches || []);
      } catch (err) {
        console.error('Error in useMarketListings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch market listings');
      } finally {
        setLoading(false);
      }
    }

    if (make && model && year) {
      fetchMarketListings();
    }
  }, [make, model, year, zipCode]);

  return { listings, loading, error };
}