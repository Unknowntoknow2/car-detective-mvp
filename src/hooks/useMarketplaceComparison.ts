
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MarketplaceListing {
  id: string;
  title: string;
  price: number;
  platform: string;
  location: string;
  url: string;
  mileage?: number;
  created_at: string;
  vin?: string;
}

interface UseMarketplaceComparisonProps {
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  zipCode?: string;
  estimatedValue: number;
}

export function useMarketplaceComparison({
  vin,
  make,
  model,
  year,
  zipCode,
  estimatedValue
}: UseMarketplaceComparisonProps) {
  const [ainRecommendation, setAinRecommendation] = useState<string>('');

  // Fetch marketplace listings using enhanced market data
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['marketplace-listings', vin, make, model, year],
    queryFn: async (): Promise<MarketplaceListing[]> => {
      try {
        console.log('Fetching marketplace listings for comparison:', { vin, make, model, year });

        // First try enhanced market listings
        const { data: enhancedListings, error: enhancedError } = await supabase
          .from('enhanced_market_listings')
          .select('*')
          .or(
            vin 
              ? `vin.eq.${vin},and(make.eq.${make},model.eq.${model},year.eq.${year})`
              : `and(make.eq.${make},model.eq.${model},year.eq.${year})`
          )
          .order('fetched_at', { ascending: false })
          .limit(20);

        if (!enhancedError && enhancedListings && enhancedListings.length > 0) {
          console.log(`Found ${enhancedListings.length} enhanced market listings`);
          return enhancedListings.map(listing => ({
            id: listing.id,
            title: `${listing.year} ${listing.make} ${listing.model}${listing.trim ? ` ${listing.trim}` : ''}`,
            price: listing.price,
            url: listing.listing_url,
            platform: listing.source,
            location: listing.location || zipCode || '',
            mileage: listing.mileage,
            created_at: listing.fetched_at || listing.created_at,
            vin: listing.vin
          }));
        }

        // Fallback to original scraped_listings
        if (vin && vin.length === 17) {
          const { data: vinData, error: vinError } = await supabase
            .from('scraped_listings')
            .select('*')
            .eq('vin', vin)
            .order('created_at', { ascending: false })
            .limit(20);
          
          if (!vinError && vinData && vinData.length > 0) {
            console.log(`Found ${vinData.length} VIN-based scraped listings`);
            return vinData as MarketplaceListing[];
          }
        }

        // Final fallback to make/model/year matching in scraped_listings
        if (make && model && year) {
          const searchQuery = `${year} ${make} ${model}`;
          const { data, error } = await supabase
            .from('scraped_listings')
            .select('*')
            .ilike('title', `%${searchQuery}%`)
            .order('created_at', { ascending: false })
            .limit(20);

          if (error) throw error;
          console.log(`Found ${data?.length || 0} make/model/year scraped listings`);
          return data as MarketplaceListing[] || [];
        }

        console.log('No marketplace listings found');
        return [];
      } catch (error) {
        console.error('Error fetching marketplace listings:', error);
        toast.error('Failed to load marketplace listings');
        return [];
      }
    },
    enabled: !!(vin || (make && model && year)),
    staleTime: 1000 * 60 * 5, // 5 minutes for more frequent updates
  });

  // Generate AIN recommendation
  useEffect(() => {
    const generateRecommendation = () => {
      if (listings.length === 0) {
        setAinRecommendation('No marketplace listings found for comparison.');
        return;
      }

      const validListings = listings.filter(l => l.price && l.price > 0);
      if (validListings.length === 0) {
        setAinRecommendation('Marketplace listings found but no valid pricing data available.');
        return;
      }

      const averagePrice = validListings.reduce((sum, l) => sum + l.price, 0) / validListings.length;
      const lowestPrice = Math.min(...validListings.map(l => l.price));
      const highestPrice = Math.max(...validListings.map(l => l.price));

      const platforms = [...new Set(validListings.map(l => l.platform))];
      const platformText = platforms.join(', ');

      let recommendation = `Based on ${validListings.length} recent listings from ${platformText}, `;
      recommendation += `the market average is $${Math.round(averagePrice).toLocaleString()}, `;
      recommendation += `ranging from $${lowestPrice.toLocaleString()} to $${highestPrice.toLocaleString()}. `;

      const valuationVsAverage = estimatedValue - averagePrice;
      const percentageDiff = Math.abs((valuationVsAverage / averagePrice) * 100);

      if (Math.abs(valuationVsAverage) > averagePrice * 0.1) {
        if (valuationVsAverage > 0) {
          recommendation += `Your valuation is ${percentageDiff.toFixed(1)}% above market average, `;
          recommendation += 'suggesting you may be in a strong selling position.';
        } else {
          recommendation += `Your valuation is ${percentageDiff.toFixed(1)}% below market average, `;
          recommendation += 'indicating competitive pricing for a quick sale.';
        }
      } else {
        recommendation += 'Your valuation aligns well with current market pricing.';
      }

      setAinRecommendation(recommendation);
    };

    generateRecommendation();
  }, [listings, estimatedValue]);

  return {
    listings,
    isLoading,
    ainRecommendation,
    marketStats: {
      averagePrice: listings.length > 0 
        ? Math.round(listings.reduce((sum, l) => sum + l.price, 0) / listings.length)
        : 0,
      lowestPrice: listings.length > 0 
        ? Math.min(...listings.map(l => l.price))
        : 0,
      highestPrice: listings.length > 0 
        ? Math.max(...listings.map(l => l.price))
        : 0,
      totalListings: listings.length
    }
  };
}
