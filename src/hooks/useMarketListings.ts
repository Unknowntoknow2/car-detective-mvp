
import { useState, useEffect } from 'react';
import { MarketListing, MarketData } from '@/types/marketListings';

interface UseMarketListingsProps {
  make: string;
  model: string;
  year: number;
  zipCode: string;
}

export function useMarketListings({ make, model, year, zipCode }: UseMarketListingsProps) {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Mock implementation - replace with actual API call
        const mockListings: MarketListing[] = [
          {
            id: '1',
            valuationId: 'mock-valuation-1',
            price: 25000,
            source: 'CarMax',
            url: 'https://carmax.com/listing/1',
            listingDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
        ];
        
        setListings(mockListings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      } finally {
        setIsLoading(false);
      }
    };

    if (make && model && year && zipCode) {
      fetchListings();
    }
  }, [make, model, year, zipCode]);

  const marketData: MarketData = {
    averagePrice: listings.reduce((sum, listing) => sum + listing.price, 0) / (listings.length || 1),
    priceRange: {
      min: Math.min(...listings.map(l => l.price), 0),
      max: Math.max(...listings.map(l => l.price), 0)
    },
    listingCount: listings.length,
    daysOnMarket: 30
  };

  return {
    listings,
    marketData,
    isLoading,
    error
  };
}
