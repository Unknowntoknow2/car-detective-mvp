
import { CarMaxListing, NormalizedListing } from '@/types/listings';

/**
 * Fetch CarMax listings from their API
 */
export async function fetchCarMaxListings(
  make: string,
  model: string,
  zipCode: string,
  radius: number = 50
): Promise<CarMaxListing[]> {
  console.log(`Fetching CarMax listings for ${make} ${model} near ${zipCode} within ${radius} miles`);
  
  // Mock implementation - in a real app, this would call the CarMax API
  const mockListings: CarMaxListing[] = [
    {
      id: 'carmax-1',
      title: `${make} ${model} 2020`,
      price: 25999,
      mileage: 28500,
      year: 2020,
      make,
      model,
      url: `https://carmax.com/car/${make}-${model}-2020`,
      imageUrl: 'https://example.com/carmax1.jpg',
      location: 'Burbank',
      source: 'carmax',
      listingDate: new Date().toISOString()
    },
    {
      id: 'carmax-2',
      title: `${make} ${model} 2019`,
      price: 22999,
      mileage: 32000,
      year: 2019,
      make,
      model,
      url: `https://carmax.com/car/${make}-${model}-2019`,
      imageUrl: 'https://example.com/carmax2.jpg',
      location: 'Woodland Hills',
      source: 'carmax',
      listingDate: new Date().toISOString()
    }
  ];
  
  return mockListings;
}

/**
 * Normalize CarMax listings to a common format
 */
export function normalizeCarMaxListings(listings: CarMaxListing[]): NormalizedListing[] {
  const normalizedListings: NormalizedListing[] = listings.map(listing => ({
    id: listing.id,
    title: listing.title,
    price: listing.price,
    mileage: listing.mileage,
    year: listing.year,
    make: listing.make,
    model: listing.model,
    trim: listing.trim,
    url: listing.url,
    imageUrl: listing.imageUrl,
    location: listing.location,
    source: listing.source,
    listingDate: listing.listingDate
  }));
  
  return normalizedListings;
}

/**
 * Get all CarMax listings for a vehicle near a location
 */
export async function getCarMaxListings(
  make: string,
  model: string,
  zipCode: string
): Promise<CarMaxListing[]> {
  const listings = await fetchCarMaxListings(make, model, zipCode);
  // Since we're returning the original listings and not normalized ones,
  // there's no need to convert types here
  return listings;
}
