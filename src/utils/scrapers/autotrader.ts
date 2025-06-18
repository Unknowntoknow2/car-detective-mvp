
// Temporarily disabled for MVP - missing cheerio dependency
export interface AutoTraderListing {
  title: string;
  price: number | null;
  year: number | null;
  make: string;
  model: string;
  mileage: number | null;
  location: string;
  detailUrl: string;
  imageUrl?: string;
}

export interface SearchAutoTraderOptions {
  make?: string;
  model?: string;
  zip?: string;
  maxResults?: number;
}

export async function scrapeAutoTraderListings(
  options: SearchAutoTraderOptions,
): Promise<AutoTraderListing[]> {
  // Disabled for MVP - missing cheerio dependency
  console.log('AutoTrader scraping disabled for MVP');
  return [];
}
