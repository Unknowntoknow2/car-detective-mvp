
import { MarketData, MarketListing } from "@/types/marketListings";

export const processExistingListings = (
  listings: MarketListing[],
): MarketData => {
  const averages: Record<string, number> = {};
  const sources: Record<string, string> = {};

  listings.forEach((listing) => {
    averages[listing.source] = listing.price;
    sources[listing.source] = listing.url || "";
  });

  return { averages, sources };
}
