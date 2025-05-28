
import { MarketplaceListing, ScraperConfig, ScraperResult } from './types';

export async function scrapeCarscom(
  make: string,
  model: string,
  year: number,
  zipCode?: string,
  config: ScraperConfig = { maxResults: 10, timeout: 30000, retries: 2 }
): Promise<ScraperResult> {
  try {
    console.log(`🔍 Scraping Cars.com for ${year} ${make} ${model}`);
    
    const brightDataEndpoint = 'https://api.brightdata.com/scraper/cars-com';
    
    const response = await fetch(brightDataEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
      },
      body: JSON.stringify({
        make: make.toLowerCase(),
        model: model.toLowerCase(),
        year_min: year,
        year_max: year,
        zip: zipCode,
        maximum_distance: 100,
        max_results: config.maxResults,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cars.com scraping failed: ${response.status}`);
    }

    const data = await response.json();
    
    const listings: MarketplaceListing[] = data.results?.map((item: any) => ({
      source: 'cars.com',
      title: `${item.year} ${item.make} ${item.model} ${item.trim || ''}`.trim(),
      price: item.price || 0,
      mileage: item.mileage,
      year: item.year || year,
      make: item.make || make,
      model: item.model || model,
      location: `${item.city}, ${item.state}` || 'Unknown',
      url: item.listing_url,
      imageUrl: item.primary_photo_url,
      postedDate: item.listing_date || new Date().toISOString(),
      condition: item.condition,
      description: item.description,
      sellerType: item.dealer_name ? 'dealer' : 'private',
    })) || [];

    return {
      success: true,
      listings,
      source: 'cars.com',
      searchParams: { make, model, year, zipCode },
    };

  } catch (error) {
    console.error('Cars.com scraping error:', error);
    return {
      success: false,
      listings: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'cars.com',
      searchParams: { make, model, year, zipCode },
    };
  }
}
