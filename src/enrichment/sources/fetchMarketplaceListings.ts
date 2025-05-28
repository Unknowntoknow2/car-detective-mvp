
import { 
  scrapeFacebookMarketplace, 
  scrapeCraigslist, 
  scrapeCarscom, 
  MarketplaceListing, 
  ScraperResult 
} from '../../scrapers';

export interface MarketplaceSearchParams {
  make: string;
  model: string;
  year: number;
  zipCode?: string;
  maxResultsPerSource?: number;
}

export interface MarketplaceData {
  allListings: MarketplaceListing[];
  bySource: {
    facebook: MarketplaceListing[];
    craigslist: MarketplaceListing[];
    carscom: MarketplaceListing[];
  };
  priceAnalysis: {
    averagePrice: number;
    medianPrice: number;
    priceRange: [number, number];
    listingCount: number;
  };
  errors: string[];
}

export async function fetchMarketplaceListings(
  params: MarketplaceSearchParams
): Promise<MarketplaceData> {
  const { make, model, year, zipCode, maxResultsPerSource = 10 } = params;
  
  console.log(`🔍 Fetching marketplace listings for ${year} ${make} ${model}`);
  
  const scraperConfig = {
    maxResults: maxResultsPerSource,
    timeout: 30000,
    retries: 2,
  };

  // Run all scrapers in parallel for efficiency
  const [facebookResult, craigslistResult, carsdotcomResult] = await Promise.allSettled([
    scrapeFacebookMarketplace(make, model, year, zipCode, scraperConfig),
    scrapeCraigslist(make, model, year, zipCode, scraperConfig),
    scrapeCarscom(make, model, year, zipCode, scraperConfig),
  ]);

  // Process results and handle errors
  const facebook = facebookResult.status === 'fulfilled' && facebookResult.value.success 
    ? facebookResult.value.listings : [];
  const craigslist = craigslistResult.status === 'fulfilled' && craigslistResult.value.success 
    ? craigslistResult.value.listings : [];
  const carscom = carsdotcomResult.status === 'fulfilled' && carsdotcomResult.value.success 
    ? carsdotcomResult.value.listings : [];

  // Collect errors
  const errors: string[] = [];
  if (facebookResult.status === 'rejected') {
    errors.push(`Facebook: ${facebookResult.reason}`);
  } else if (!facebookResult.value.success) {
    errors.push(`Facebook: ${facebookResult.value.error}`);
  }
  
  if (craigslistResult.status === 'rejected') {
    errors.push(`Craigslist: ${craigslistResult.reason}`);
  } else if (!craigslistResult.value.success) {
    errors.push(`Craigslist: ${craigslistResult.value.error}`);
  }
  
  if (carsdotcomResult.status === 'rejected') {
    errors.push(`Cars.com: ${carsdotcomResult.reason}`);
  } else if (!carsdotcomResult.value.success) {
    errors.push(`Cars.com: ${carsdotcomResult.value.error}`);
  }

  // Combine all listings
  const allListings = [...facebook, ...craigslist, ...carscom];
  
  // Remove duplicates based on price and title similarity
  const uniqueListings = removeDuplicates(allListings);
  
  // Calculate price analysis
  const priceAnalysis = calculatePriceAnalysis(uniqueListings);

  return {
    allListings: uniqueListings,
    bySource: {
      facebook,
      craigslist,
      carscom,
    },
    priceAnalysis,
    errors,
  };
}

function removeDuplicates(listings: MarketplaceListing[]): MarketplaceListing[] {
  const seen = new Set();
  return listings.filter(listing => {
    // Create a key based on price and simplified title
    const key = `${listing.price}-${simplifyTitle(listing.title)}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function simplifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculatePriceAnalysis(listings: MarketplaceListing[]): {
  averagePrice: number;
  medianPrice: number;
  priceRange: [number, number];
  listingCount: number;
} {
  if (listings.length === 0) {
    return {
      averagePrice: 0,
      medianPrice: 0,
      priceRange: [0, 0],
      listingCount: 0,
    };
  }

  const prices = listings
    .map(listing => listing.price)
    .filter(price => price > 0)
    .sort((a, b) => a - b);

  if (prices.length === 0) {
    return {
      averagePrice: 0,
      medianPrice: 0,
      priceRange: [0, 0],
      listingCount: listings.length,
    };
  }

  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const medianPrice = prices[Math.floor(prices.length / 2)];
  const priceRange: [number, number] = [prices[0], prices[prices.length - 1]];

  return {
    averagePrice: Math.round(averagePrice),
    medianPrice,
    priceRange,
    listingCount: listings.length,
  };
}
