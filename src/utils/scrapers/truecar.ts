
// Temporarily disabled for MVP - missing cheerio dependency
export interface TrueCarListing {
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

export async function scrapeTrueCarListings(): Promise<TrueCarListing[]> {
  // Disabled for MVP - missing cheerio dependency
  console.log('TrueCar scraping disabled for MVP');
  return [];
}
