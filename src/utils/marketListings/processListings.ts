
import { MarketData, MarketListing } from "@/types/marketListings";

/**
 * Process existing listings from database into the MarketData format
 * @param listings Array of market listings from the database
 * @returns MarketData object with averages and sources
 */
export function processExistingListings(listings: MarketListing[]): MarketData {
  const averages: Record<string, number> = {};
  const sources: Record<string, string> = {};
  
  // Group listings by source
  const groupedBySource: Record<string, MarketListing[]> = {};
  
  listings.forEach(listing => {
    if (!groupedBySource[listing.source]) {
      groupedBySource[listing.source] = [];
    }
    groupedBySource[listing.source].push(listing);
  });
  
  // Calculate average price per source
  Object.entries(groupedBySource).forEach(([source, sourceListings]) => {
    const total = sourceListings.reduce((sum, listing) => sum + listing.price, 0);
    averages[source] = Math.round(total / sourceListings.length);
    
    // Use the URL from the most recent listing for this source
    const mostRecent = sourceListings[0]; // Assuming listings are sorted by date desc
    sources[source] = mostRecent.url || '';
  });
  
  return { averages, sources };
}
