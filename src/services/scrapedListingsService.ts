
import { supabase } from '@/integrations/supabase/client';

export interface ScrapedListing {
  id: string;
  title: string;
  price: number | null;
  url: string;
  platform: string;
  location: string | null;
  mileage: number | null;
  vin: string | null;
  created_at: string;
  updated_at: string | null;
}

export async function getScrapedListingsByVin(vin: string): Promise<ScrapedListing[]> {
  if (!vin || vin.length !== 17) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('scraped_listings')
      .select('*')
      .eq('vin', vin)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      return [];
    }

    return data || [];
  } catch (error) {
    return [];
  }
}

export function calculateAverageListingPrice(listings: ScrapedListing[]): number | null {
  const validListings = listings.filter(listing => listing.price && listing.price > 0);
  
  if (validListings.length === 0) {
    return null;
  }

  const total = validListings.reduce((sum, listing) => sum + (listing.price || 0), 0);
  return Math.round(total / validListings.length);
}

export function formatListingsForPdf(listings: ScrapedListing[]): string {
  if (!listings.length) {
    return 'No marketplace listings found for comparison.';
  }

  const validListings = listings.filter(listing => listing.price && listing.price > 0);
  
  if (!validListings.length) {
    return 'No valid pricing data found in marketplace listings.';
  }

  const lines = ['Marketplace Listings (Recent):'];
  
  validListings.slice(0, 5).forEach((listing, index) => {
    const title = listing.title.length > 50 ? listing.title.substring(0, 50) + '...' : listing.title;
    const price = listing.price ? `$${listing.price.toLocaleString()}` : 'N/A';
    const platform = listing.platform || 'Unknown';
    
    lines.push(`${index + 1}. ${platform} - ${title} - ${price}`);
  });

  const averagePrice = calculateAverageListingPrice(validListings);
  if (averagePrice) {
    lines.push(`\nAverage marketplace price: $${averagePrice.toLocaleString()} (based on ${validListings.length} listings)`);
  }

  return lines.join('\n');
}

export function generateMarketplaceAnalysisText(
  listings: ScrapedListing[], 
  estimatedValue: number
): string {
  if (!listings.length) {
    return 'No public marketplace listings found to compare against for this vehicle.';
  }

  const validListings = listings.filter(listing => listing.price && listing.price > 0);
  
  if (!validListings.length) {
    return 'Marketplace listings found but no valid pricing data available for comparison.';
  }

  const averagePrice = calculateAverageListingPrice(validListings);
  
  if (!averagePrice) {
    return 'Unable to calculate average from marketplace listings due to insufficient pricing data.';
  }

  const platforms = [...new Set(validListings.map(l => l.platform))].join(', ');
  const difference = estimatedValue - averagePrice;
  const percentDiff = Math.abs((difference / averagePrice) * 100);
  
  let comparisonText = '';
  if (Math.abs(difference) > averagePrice * 0.05) { // Only mention if >5% difference
    if (difference > 0) {
      comparisonText = `, suggesting a premium valuation ${percentDiff.toFixed(1)}% above current market listings`;
    } else {
      comparisonText = `, indicating a competitive price ${percentDiff.toFixed(1)}% below current market listings`;
    }
  } else {
    comparisonText = ', aligning closely with current market pricing';
  }

  return `Based on ${validListings.length} recent public listings from ${platforms}, the average marketplace price is $${averagePrice.toLocaleString()}${comparisonText}.`;
}
