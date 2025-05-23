
import { Listing } from '@/types/listing';

/**
 * Normalizes vehicle data from various sources into a standard format
 * @param data Raw vehicle data
 * @returns Normalized listing object
 */
export function normalizeVehicleData(data: {
  title: string;
  url: string;
  price: number;
  images: string[];
  source: string;
  zipCode: string;
}): Listing {
  return {
    id: `${data.source}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: data.title,
    url: data.url,
    price: data.price,
    image: data.images[0] || '',
    images: data.images,
    source: data.source,
    location: data.zipCode,
    postedDate: new Date().toISOString(),
    // Extract year, make, model from title if possible
    year: extractYear(data.title),
    make: extractMake(data.title),
    model: extractModel(data.title),
    mileage: 0, // Default value, would be populated later
  };
}

// Helper function to extract year from title
function extractYear(title: string): number {
  const yearRegex = /(19|20)\d{2}/;
  const match = title.match(yearRegex);
  return match ? parseInt(match[0], 10) : 0;
}

// Helper function to extract make from title
function extractMake(title: string): string {
  const commonMakes = [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia', 
    'Subaru', 'BMW', 'Mercedes', 'Audi', 'Lexus', 'Acura', 'Volkswagen'
  ];
  
  for (const make of commonMakes) {
    if (title.toLowerCase().includes(make.toLowerCase())) {
      return make;
    }
  }
  
  return '';
}

// Helper function to extract model from title
function extractModel(title: string): string {
  // This would require a more sophisticated approach in a real app
  // as models are numerous and varied
  return '';
}
