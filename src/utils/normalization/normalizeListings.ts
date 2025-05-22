
import { NormalizedListing, RawListing } from "./normalizeListing";
import { v4 as uuidv4 } from 'uuid';

/**
 * Normalizes listings from various sources into a standard format
 * @param listings Array of raw listings from different sources
 * @param source Source platform name (craigslist, cars.com, etc.)
 * @returns Array of normalized listings
 */
export function normalizeListings(
  listings: RawListing[],
  source: string
): NormalizedListing[] {
  return listings.map((listing) => ({
    ...listing,
    id: listing.id || `${source}-${uuidv4()}`,
    platform: source,
    // Ensure all required fields exist
    title: listing.title || 'Unknown Vehicle',
    price: typeof listing.price === 'number' ? listing.price : parseFloat(String(listing.price)) || 0,
    url: listing.url || '',
    source: source,
    // Optional fields with sensible defaults
    mileage: listing.mileage || 0,
    year: listing.year || 0,
    make: listing.make || '',
    model: listing.model || '',
    imageUrl: listing.image || '',
    location: listing.location || 'Unknown',
    listingDate: listing.postedDate || new Date().toISOString(),
    description: listing.description || '',
  }));
}

/**
 * Extracts VIN from listing data if available
 * @param listing The listing to extract VIN from
 * @returns VIN or null if not found
 */
export function extractVinFromListing(listing: NormalizedListing): string | null {
  // If listing has VIN directly
  if (listing.vin) {
    return listing.vin;
  }

  // Try to extract from title or description
  const vinRegex = /\b[A-HJ-NPR-Z0-9]{17}\b/i;
  
  if (listing.title) {
    const matchTitle = listing.title.match(vinRegex);
    if (matchTitle) return matchTitle[0];
  }

  if (listing.description) {
    const matchDesc = listing.description.match(vinRegex);
    if (matchDesc) return matchDesc[0];
  }

  return null;
}

/**
 * Groups listings by VIN when available
 * @param listings Array of normalized listings
 * @returns Object with VINs as keys and arrays of listings as values
 */
export function groupListingsByVin(
  listings: NormalizedListing[]
): Record<string, NormalizedListing[]> {
  const groupedListings: Record<string, NormalizedListing[]> = {};

  listings.forEach(listing => {
    const vin = extractVinFromListing(listing);
    if (vin) {
      if (!groupedListings[vin]) {
        groupedListings[vin] = [];
      }
      groupedListings[vin].push(listing);
    }
  });

  return groupedListings;
}
