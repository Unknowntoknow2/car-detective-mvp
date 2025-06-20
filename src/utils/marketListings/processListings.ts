
import { MarketListing, MarketData } from '@/types/marketListings';

export function processExistingListings(listings: MarketListing[]): MarketData {
  if (!listings || listings.length === 0) {
    return {
      averagePrice: 0,
      priceRange: { min: 0, max: 0 },
      listingCount: 0,
      daysOnMarket: 0,
      averages: {},
      sources: {}
    };
  }

  const prices = listings.map(listing => listing.price);
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  
  // Group by source to calculate averages
  const sourceGroups = listings.reduce((acc, listing) => {
    if (!acc[listing.source]) {
      acc[listing.source] = [];
    }
    acc[listing.source].push(listing.price);
    return acc;
  }, {} as Record<string, number[]>);

  const averages = Object.entries(sourceGroups).reduce((acc, [source, sourcePrices]) => {
    acc[source] = sourcePrices.reduce((sum, price) => sum + price, 0) / sourcePrices.length;
    return acc;
  }, {} as Record<string, number>);

  const sources = listings.reduce((acc, listing) => {
    if (listing.url) {
      acc[listing.source] = listing.url;
    }
    return acc;
  }, {} as Record<string, string>);

  return {
    averagePrice,
    averages,
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices)
    },
    listingCount: listings.length,
    daysOnMarket: 30, // Mock value
    sources
  };
}
