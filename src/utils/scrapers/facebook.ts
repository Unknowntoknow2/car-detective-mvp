
// src/utils/scrapers/facebook.ts

/**
 * Facebook Marketplace mock scraper
 * Uses mock data instead of Puppeteer for improved reliability and build compatibility
 */

export async function fetchFacebookMarketplaceListings(
  make: string,
  model: string,
  zip = '95814',
  maxResults = 5
) {
  console.log(`🔍 Mocking Facebook Marketplace search for ${make} ${model} in ${zip}`);
  
  // Generate a consistent set of mock listings based on the input parameters
  const listings = generateMockListings(make, model, zip, maxResults);
  
  return listings;
}

/**
 * Generates realistic mock data for Facebook Marketplace listings
 */
function generateMockListings(make: string, model: string, zip: string, count: number) {
  const basePrice = getBasePrice(make, model);
  const listings = [];
  
  for (let i = 0; i < count; i++) {
    // Generate slightly different prices for variety
    const priceVariation = Math.floor(Math.random() * 2000) - 1000;
    const price = basePrice + priceVariation + (i * 250); // Each listing slightly more expensive
    
    // Generate a year between 2015 and 2022
    const year = 2015 + Math.floor(Math.random() * 8);
    
    // Generate random mileage appropriate for the year
    const mileageBase = (2023 - year) * 12000;
    const mileage = mileageBase + Math.floor(Math.random() * 15000);
    
    listings.push({
      title: `${year} ${make} ${model} - ${mileage.toLocaleString()} miles`,
      price: price,
      image: `https://via.placeholder.com/200?text=${make}+${model}`,
      url: 'https://facebook.com/marketplace',
      source: 'facebook',
      location: `${zip} area (Mock)`,
      postedDate: new Date(Date.now() - (i * 86400000)).toISOString(), // Each post a day apart
      mileage: mileage,
      year: year
    });
  }
  
  return listings;
}

/**
 * Returns a realistic base price for the make and model
 */
function getBasePrice(make: string, model: string): number {
  // Define some base prices for common makes
  const basePrices: Record<string, Record<string, number>> = {
    'toyota': { 'camry': 15000, 'corolla': 13000, 'rav4': 18000, 'default': 16000 },
    'honda': { 'accord': 16000, 'civic': 14000, 'cr-v': 19000, 'default': 15000 },
    'ford': { 'f-150': 25000, 'escape': 15000, 'explorer': 20000, 'default': 18000 },
    'chevrolet': { 'malibu': 14000, 'silverado': 26000, 'equinox': 17000, 'default': 16000 },
    'nissan': { 'altima': 14000, 'sentra': 12000, 'rogue': 16000, 'default': 14000 },
  };
  
  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase();
  
  // Return appropriate price or default values
  if (basePrices[makeLower]) {
    if (basePrices[makeLower][modelLower]) {
      return basePrices[makeLower][modelLower];
    }
    return basePrices[makeLower].default;
  }
  
  // Default base price if make not found
  return 15000 + Math.floor(Math.random() * 10000);
}
