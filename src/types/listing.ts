
/**
 * Defines the structure for marketplace vehicle listings
 */
export interface Listing {
  id: string;
  title: string;
  price: number;
  url: string;
  image: string;
  images: string[];
  source: string;
  location: string;
  postedDate: string;
  year: number;
  make: string;
  model: string;
  mileage: number;
  description?: string;
}

/**
 * Raw listing data before normalization
 */
export interface RawListing {
  id?: string;
  title: string;
  price: number | string;
  url?: string;
  image?: string;
  images?: string[];
  source?: string;
  location?: string;
  postedDate?: string;
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
  description?: string;
}
