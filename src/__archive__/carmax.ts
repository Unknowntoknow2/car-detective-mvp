
// ARCHIVED - DO NOT USE
// This file has been replaced by the centralized getEnrichedVehicleData.ts system

import { CarMaxListing, NormalizedListing } from '@/types/listings';

/**
 * ARCHIVED: Fetch CarMax listings from their API
 */
export async function fetchCarMaxListings(
  make: string,
  model: string,
  zipCode: string,
  radius: number = 50
): Promise<CarMaxListing[]> {
  console.log(`[ARCHIVED] Fetching CarMax listings for ${make} ${model} near ${zipCode} within ${radius} miles`);
  
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
    }
  ];
  
  return mockListings;
}
