
// Temporarily disabled for MVP - missing API integration
export interface CarMaxApiListing {
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

export async function fetchCarMaxApiListings(
  make: string,
  model: string,
  zipCode: string = "95814",
  maxResults: number = 10,
): Promise<CarMaxApiListing[]> {
  // Disabled for MVP - missing API integration
  console.log('CarMax API disabled for MVP');
  return [];
}
