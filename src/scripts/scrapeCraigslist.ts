
import { fetchCraigslistListings } from '@/utils/scrapers/craigslist';

// Main script to fetch listings
const runScraper = async () => {
  try {
    const zipCode = '90210';
    const maxResults = '20'; // Changed to string to match function parameter
    
    console.log(`Fetching Craigslist listings for ZIP: ${zipCode}...`);
    
    // Fix function call to use correct number of arguments
    const listings = await fetchCraigslistListings(zipCode, maxResults);
    
    console.log(`Found ${listings.length} listings`);
    console.log(listings);
    
    // Save listings to database or file here
  } catch (error) {
    console.error('Error running Craigslist scraper:', error);
  }
};

// Run the scraper
runScraper();
