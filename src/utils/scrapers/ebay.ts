
// Temporarily disabled for MVP - missing cheerio dependency
export interface EbayListing {
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

export async function scrapeEbayListings(): Promise<EbayListing[]> {
  // Disabled for MVP - missing cheerio dependency
  console.log('eBay scraping disabled for MVP');
  return [];
}
