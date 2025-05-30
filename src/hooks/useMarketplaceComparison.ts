
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

  // Fetch marketplace listings
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['marketplace-listings', vin, make, model, year],
    queryFn: async (): Promise<MarketplaceListing[]> => {
      try {
        let query = supabase
          .from('scraped_listings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        // First try to match by VIN if available
        if (vin && vin.length === 17) {
          const { data: vinData, error: vinError } = await query.eq('vin', vin);
          if (!vinError && vinData && vinData.length > 0) {
            return vinData as MarketplaceListing[];
          }
        }

        // Fallback to make/model/year matching
        if (make && model && year) {
          const searchQuery = `${year} ${make} ${model}`;
          const { data, error } = await supabase
            .from('scraped_listings')
            .select('*')
            .ilike('title', `%${searchQuery}%`)
            .order('created_at', { ascending: false })
            .limit(20);

          if (error) throw error;
          return data as MarketplaceListing[] || [];
        }

        return [];
      } catch (error) {
        console.error('Error fetching marketplace listings:', error);
        toast.error('Failed to load marketplace listings');
        return [];
      }
    },
    enabled: !!(vin || (make && model && year)),
    staleTime: 1000 * 60 * 15, // 15 minutes
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
