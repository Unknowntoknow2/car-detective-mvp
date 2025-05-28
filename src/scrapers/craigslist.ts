
import { MarketplaceListing, ScraperConfig, ScraperResult } from './types';

export async function scrapeCraigslist(
  make: string,
  model: string,
  year: number,
  zipCode?: string,
  config: ScraperConfig = { maxResults: 10, timeout: 30000, retries: 2 }
): Promise<ScraperResult> {
  try {
    console.log(`🔍 Scraping Craigslist for ${year} ${make} ${model}`);
    
    const searchQuery = `${year} ${make} ${model}`;
    const brightDataEndpoint = 'https://api.brightdata.com/scraper/craigslist';
    
    const response = await fetch(brightDataEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
      },
      body: JSON.stringify({
        query: searchQuery,
        location: zipCode,
        max_results: config.maxResults,
        category: 'cars-trucks',
      }),
    });

    if (!response.ok) {
      throw new Error(`Craigslist scraping failed: ${response.status}`);
    }

    const data = await response.json();
    
    const listings: MarketplaceListing[] = data.results?.map((item: any) => ({
      source: 'craigslist',
      title: item.title,
      price: parsePrice(item.price),
      mileage: parseMileage(item.description),
      year: year,
      make: make,
      model: model,
      location: item.location || 'Unknown',
      url: item.url,
      imageUrl: item.images?.[0],
      postedDate: item.posted_date || new Date().toISOString(),
      condition: extractCondition(item.description),
      description: item.description,
      sellerType: item.dealer ? 'dealer' : 'private',
    })) || [];

    return {
      success: true,
      listings,
      source: 'craigslist',
      searchParams: { make, model, year, zipCode },
    };

  } catch (error) {
    console.error('Craigslist scraping error:', error);
    return {
      success: false,
      listings: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'craigslist',
      searchParams: { make, model, year, zipCode },
    };
  }
}

function parsePrice(priceString: string): number {
  if (!priceString) return 0;
  const cleaned = priceString.replace(/[^0-9]/g, '');
  return parseInt(cleaned) || 0;
}

function parseMileage(description: string): number | undefined {
  if (!description) return undefined;
  const mileageMatch = description.match(/(\d{1,3}(?:,\d{3})*)\s*(?:miles?|mi)/i);
  return mileageMatch ? parseInt(mileageMatch[1].replace(/,/g, '')) : undefined;
}

function extractCondition(description: string): string | undefined {
  if (!description) return undefined;
  const conditions = ['excellent', 'good', 'fair', 'poor'];
  const lowerDesc = description.toLowerCase();
  return conditions.find(condition => lowerDesc.includes(condition));
}
