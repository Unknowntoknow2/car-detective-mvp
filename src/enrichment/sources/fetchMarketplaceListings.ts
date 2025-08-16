
// Mock marketplace listings fetcher
// Note: Individual scraper modules have been removed during cleanup

export interface MarketplaceListing {
  price: number;
  url: string;
  source: string;
  title: string;
  mileage?: number;
  year?: number;
  location?: string;
}

export const scrapeFacebookMarketplace = async (query: string, zipCode: string): Promise<MarketplaceListing[]> => {
  try {
    // Use the live-market-search edge function for Facebook scraping
    const response = await fetch('/api/live-market-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        make: query.split(' ')[1] || '',
        model: query.split(' ')[2] || '',
        year: parseInt(query.split(' ')[0]) || 2020,
        zipCode,
        platform: 'facebook'
      })
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.listings || [];
  } catch (error) {
    console.error('Facebook Marketplace scraping failed:', error);
    return [];
  }
};

export const scrapeCraigslist = async (query: string, zipCode: string): Promise<MarketplaceListing[]> => {
  try {
    // Use Supabase function for Craigslist scraping
    const response = await fetch('/api/fetch-marketplace-data?platform=craigslist&query=' + encodeURIComponent(query) + '&zip=' + zipCode);
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.listings || [];
  } catch (error) {
    console.error('Craigslist scraping failed:', error);
    return [];
  }
};

export const scrapeCarscom = async (query: string, zipCode: string): Promise<MarketplaceListing[]> => {
  // This is now handled by the main Cars.com integration in marketSearchAgent
  console.log('Cars.com scraping redirected to main integration');
  return [];
};

export async function fetchMarketplaceListings(
  make: string,
  model: string,
  year: number,
  zipCode: string
): Promise<MarketplaceListing[]> {
  console.log('🔍 Fetching marketplace listings for:', { make, model, year, zipCode });
  
  const query = `${year} ${make} ${model}`;
  const results: MarketplaceListing[] = [];
  
  try {
    // Run scrapers in parallel
    const [facebookListings, craigslistListings] = await Promise.allSettled([
      scrapeFacebookMarketplace(query, zipCode),
      scrapeCraigslist(query, zipCode)
    ]);
    
    if (facebookListings.status === 'fulfilled') {
      results.push(...facebookListings.value);
    }
    
    if (craigslistListings.status === 'fulfilled') {
      results.push(...craigslistListings.value);
    }
    
    console.log(`✅ Found ${results.length} total marketplace listings`);
    return results;
    
  } catch (error) {
    console.error('❌ Marketplace listings fetch failed:', error);
    return [];
  }
}
