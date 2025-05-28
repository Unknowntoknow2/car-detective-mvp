
// ARCHIVED - DO NOT USE
// This file has been replaced by the centralized getEnrichedVehicleData.ts system

import { CarMaxListing } from '@/types/listings';

/**
 * ARCHIVED: Fetch CarMax listings using their API
 */
export async function fetchCarMaxApi(
  make: string,
  model: string,
  zipCode: string,
  radius: number = 50
): Promise<CarMaxListing[]> {
  console.log(`[ARCHIVED] API Call: CarMax for ${make} ${model} near ${zipCode}`);
  
  const mockListings: CarMaxListing[] = [
    {
      id: 'carmax-api-1',
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
