
// src/utils/normalization/normalizeListing.ts

export interface RawListing {
  source: string;
  title: string;
  price: number | string;
  url: string;
  image?: string;
  location?: string;
  postedDate?: string;
  mileage?: number;
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
  description?: string;
  id?: string;
}

export interface NormalizedListing extends RawListing {
  id: string;
  platform: string;
  description?: string;
}

export function normalizeListing(listing: RawListing): NormalizedListing {
  return {
    ...listing,
    id: listing.id || `${listing.source}-${Buffer.from(listing.url).toString('base64')}`,
    platform: listing.source,
  };
}
