
// Consolidated listing normalization utilities

export interface NormalizedListing {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition?: string;
  location?: string;
  source: string;
  url?: string;
  images?: string[];
  description?: string;
  features?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export function normalizeListing(rawListing: any, source: string): NormalizedListing {
  // Normalize individual listing data
  return {
    id: rawListing.id || generateId(),
    make: normalizeString(rawListing.make),
    model: normalizeString(rawListing.model),
    year: parseInt(rawListing.year) || 0,
    price: parseFloat(rawListing.price) || 0,
    mileage: parseInt(rawListing.mileage) || 0,
    condition: normalizeCondition(rawListing.condition),
    location: normalizeString(rawListing.location),
    source,
    url: rawListing.url,
    images: Array.isArray(rawListing.images) ? rawListing.images : [],
    description: rawListing.description || '',
    features: Array.isArray(rawListing.features) ? rawListing.features : [],
    createdAt: new Date(rawListing.createdAt || Date.now()),
    updatedAt: new Date(rawListing.updatedAt || Date.now())
  };
}

export function normalizeListings(rawListings: any[], source: string): NormalizedListing[] {
  // Normalize multiple listings
  return rawListings
    .filter(listing => listing && listing.make && listing.model)
    .map(listing => normalizeListing(listing, source))
    .filter(listing => listing.price > 0 && listing.year > 1900);
}

function normalizeString(value: any): string {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function normalizeCondition(condition: any): string | undefined {
  if (!condition) return undefined;
  const normalized = normalizeString(condition);
  const conditionMap: Record<string, string> = {
    'excellent': 'excellent',
    'very good': 'very-good',
    'good': 'good',
    'fair': 'fair',
    'poor': 'poor'
  };
  return conditionMap[normalized] || normalized;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
