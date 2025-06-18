
// Temporarily disabled for MVP - missing cheerio dependency
export interface EdmundsListing {
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

export async function scrapeEdmundsListings(): Promise<EdmundsListing[]> {
  // Disabled for MVP - missing cheerio dependency
  console.log('Edmunds scraping disabled for MVP');
  return [];
}
