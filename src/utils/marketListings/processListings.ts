
import { MarketData, MarketListing } from '@/types/marketListings';

export const processExistingListings = (listings: MarketListing[]): MarketData => {
  const sources: Record<string, string> = {};
  const pricesBySource: Record<string, number[]> = {};
  
  listings.forEach(listing => {
    if (!pricesBySource[listing.source]) {
      pricesBySource[listing.source] = [];
      sources[listing.source] = listing.url || '#';
    }
    pricesBySource[listing.source].push(listing.price);
  });
  
  const averages: Record<string, number> = {};
  Object.entries(pricesBySource).forEach(([source, prices]) => {
    const sum = prices.reduce((a, b) => a + b, 0);
    averages[source] = Math.round(sum / prices.length);
  });
  
  return { averages, sources };
};
