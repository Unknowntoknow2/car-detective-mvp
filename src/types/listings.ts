
export interface BaseListing {
  id: string;
  title: string;
  price: number;
  mileage: number;
  year: number;
  make: string;
  model: string;
  url: string;
  imageUrl: string;
  location: string;
  source: string;
  listingDate: string;
}

export interface CarMaxListing extends BaseListing {
  // CarMax specific properties
  carfaxOneOwner?: boolean;
  carfaxCleanTitle?: boolean;
  trim?: string;
  exteriorColor?: string;
  interiorColor?: string;
  engineDescription?: string;
  transmission?: string;
}

export interface CraigslistListing extends BaseListing {
  // Craigslist specific properties
  description?: string;
  condition?: string;
  sellerType?: 'dealer' | 'private' | 'other';
  contactPhone?: string;
  contactEmail?: string;
}

export interface AutotraderListing extends BaseListing {
  // Autotrader specific properties
  dealerName?: string;
  dealerRating?: number;
  dealerReviewCount?: number;
  features?: string[];
}

export interface NormalizedListing extends BaseListing {
  // Any additional properties needed for normalization
  normalized?: boolean;
}
