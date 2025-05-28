
/**
 * Mock Facebook Marketplace scraper
 * This is a completely mock implementation with no Puppeteer dependencies
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

/**
 * Mock implementation that generates realistic-looking data
 * without any browser automation dependencies
 */
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
  
  // Generate a set of realistic years for the vehicle
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 15;
  
  for (let i = 0; i < limit; i++) {
    const id = Math.floor(Math.random() * 10000000).toString();
    const year = startYear + Math.floor(Math.random() * 15);
    const mileage = Math.floor(Math.random() * 100000) + 10000;
    const price = Math.floor(Math.random() * 15000) + 5000;
    const daysAgo = Math.floor(Math.random() * 30);
    const postedDate = new Date(Date.now() - daysAgo * 86400000).toISOString();
    
    // Generate condition based on year and mileage
    let condition = 'Good';
    if (year > currentYear - 3 && mileage < 30000) {
      condition = 'Excellent';
    } else if (year < currentYear - 10 || mileage > 100000) {
      condition = 'Fair';
    }
    
    mockListings.push({
      id,
      title: `${year} ${make} ${model} - ${mileage} miles`,
      price,
      location: `${zipCode} area`,
      image: `https://picsum.photos/seed/${id}/400/300`,
      url: `https://www.facebook.com/marketplace/item/${id}`,
      postedDate,
      condition
    });
  }
  
  return mockListings;
};

// Add a mock for any other Facebook marketplace functions that might be needed
export const getMarketplaceDetails = async (listingId: string) => {
  return {
    id: listingId,
    title: `Vehicle Details for ${listingId}`,
    description: 'This is a mock description for a Facebook Marketplace listing.',
    sellerInfo: {
      name: 'Mock Seller',
      rating: 4.7,
      memberSince: '2019'
    },
    additionalImages: [
      `https://picsum.photos/seed/${listingId}-1/400/300`,
      `https://picsum.photos/seed/${listingId}-2/400/300`,
      `https://picsum.photos/seed/${listingId}-3/400/300`
    ]
  };
};
