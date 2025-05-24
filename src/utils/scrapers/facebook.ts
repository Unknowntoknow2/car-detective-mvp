
/**
 * Mock Facebook Marketplace scraper
 * This is a completely mock implementation that doesn't use Puppeteer
 */

interface FacebookListing {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  url: string;
  postedDate: string;
  condition: string;
}

export const fetchFacebookMarketplaceListings = async (
  make: string,
  model: string,
  zipCode: string,
  limit: number = 10
): Promise<FacebookListing[]> => {
  console.log(`[MOCK] Searching Facebook Marketplace for ${make} ${model} in ${zipCode}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate mock data instead of scraping
  const mockListings: FacebookListing[] = [];
  
  for (let i = 0; i < limit; i++) {
    const id = Math.floor(Math.random() * 10000000).toString();
    const year = 2010 + Math.floor(Math.random() * 12);
    const mileage = Math.floor(Math.random() * 100000) + 10000;
    const price = Math.floor(Math.random() * 15000) + 5000;
    
    mockListings.push({
      id,
      title: `${year} ${make} ${model} - ${mileage} miles`,
      price,
      location: `${zipCode} area`,
      image: `https://picsum.photos/id/${i + 100}/400/300`,
      url: `https://www.facebook.com/marketplace/item/${id}`,
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 604800000)).toISOString(),
      condition: Math.random() > 0.7 ? 'Excellent' : Math.random() > 0.4 ? 'Good' : 'Fair'
    });
  }
  
  return mockListings;
};
