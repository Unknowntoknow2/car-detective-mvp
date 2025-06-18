
// Temporarily disabled for MVP - missing puppeteer-extra dependency
export interface CarMaxListing {
  title: string;
  price: number;
  mileage: number;
  vin: string;
  year: number;
  image?: string;
  url: string;
  location?: string;
  postedDate?: string;
}

export async function fetchCarMaxListings(
  make: string,
  model: string,
  zipCode: string = "95814",
  maxResults: number = 10,
): Promise<CarMaxListing[]> {
  // Disabled for MVP - missing puppeteer-extra dependency
  console.log('CarMax scraping disabled for MVP');
  return [];
}
