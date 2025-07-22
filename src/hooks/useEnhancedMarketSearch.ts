import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MarketListing } from '@/types/marketListing';

interface EnhancedMarketSearchProps {
  make?: string;
  model?: string;
  year?: number;
  zipCode?: string;
  vin?: string;
  exact?: boolean;
}

export interface MarketSearchStats {
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
  p25: number;
  p75: number;
  count: number;
  iqr: number;
}

interface MarketSearchResult {
  listings: MarketListing[];
  loading: boolean;
  error: string | null;
  meta: {
    sources: string[];
    confidence: number;
    exactMatch: boolean;
    count: number;
    stats?: MarketSearchStats | null;
  };
}

export function useEnhancedMarketSearch({
  make,
  model,
  year,
  zipCode,
  vin,
  exact = false
}: EnhancedMarketSearchProps): MarketSearchResult {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<MarketSearchResult['meta']>({
    sources: [],
    confidence: 0,
    exactMatch: false,
    count: 0,
    stats: null
  });

  useEffect(() => {
    async function fetchMarketListings() {
      if (!make && !model && !vin) {
        setListings([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching enhanced market listings with params:', { make, model, year, zipCode, vin, exact });
        
        // Call our new enhanced market search edge function
        const { data, error: functionError } = await supabase.functions.invoke(
          'enhanced-market-search',
          {
            body: { make, model, year, zip: zipCode, vin, exact }
          }
        );

        if (functionError) {
          console.error('Error calling enhanced-market-search:', functionError);
          throw new Error(functionError.message);
        }
        
        if (!data) {
          throw new Error('No data returned from market search');
        }
        
        console.log('Enhanced market search results:', data);
        
        if (data.data && Array.isArray(data.data)) {
          setListings(data.data);
          setMeta({
            sources: data.meta?.sources || [],
            confidence: data.meta?.confidence || 0,
            exactMatch: data.meta?.exact_match || false,
            count: data.meta?.count || data.data.length,
            stats: data.meta?.stats || null
          });
        } else {
          setListings([]);
          setMeta({
            sources: [],
            confidence: 0,
            exactMatch: false,
            count: 0,
            stats: null
          });
        }
      } catch (err) {
        console.error('Error in useEnhancedMarketSearch hook:', err);
        setError('Failed to fetch market listings');
        setListings([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMarketListings();
  }, [make, model, year, zipCode, vin, exact]);

  return { 
    listings, 
    loading, 
    error, 
    meta
  };
}
