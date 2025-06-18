
// Temporarily disabled for MVP - missing cheerio dependency
export interface OfferUpListing {
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

export async function scrapeOfferUpListings(): Promise<OfferUpListing[]> {
  // Disabled for MVP - missing cheerio dependency
  console.log('OfferUp scraping disabled for MVP');
  return [];
}
