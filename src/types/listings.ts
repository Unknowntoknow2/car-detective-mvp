
export interface NormalizedListing {
  id?: string;
  title: string;
  price: number;
  mileage?: number;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  url: string;
  imageUrl?: string;
  location?: string;
  source: string;
  listingDate?: string;
  description?: string;
}

export interface CarMaxListing {
  id: string;
  title: string;
  price: number;
  mileage: number;
  year: number;
  make: string;
  model: string;
  trim?: string;
  url: string;
  imageUrl: string;
  location?: string;
  source: string;
  listingDate?: string;
}

export interface CraigslistListing {
  title: string;
  price: number;
  mileage?: number;
  year?: number;
  make?: string;
  model?: string;
  url: string;
  imageUrl?: string;
  location?: string;
  source: string;
  listingDate?: string;
  description?: string;
}
