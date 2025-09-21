import { MarketListing } from "@/types/marketListing";

export interface ParsedListing {
  title: string;
  price: number;
  mileage?: number;
  zipCode?: string;
  source?: string;
  url?: string;
}

export function parseVehicleListingsFromWeb(text: string): ParsedListing[] {
  const listings: ParsedListing[] = [];
  
  // Enhanced patterns for better real-world listing extraction
  const patterns = [
    // Pattern 1: Direct price-mileage extraction from dealer listings
    /\$([0-9]{1,3}(?:,[0-9]{3})*)\s*.*?([0-9]{1,3}(?:,[0-9]{3})*)\s*(?:mi|miles|k)/gi,
    
    // Pattern 2: Price in title format
    /(\d{4})\s+([A-Za-z]+)\s+([A-Za-z]+).*?\$([0-9]{1,3}(?:,[0-9]{3})*)\s*.*?([0-9]{1,3}(?:,[0-9]{3})*)\s*(?:mi|miles)/gi,
    
    // Pattern 3: Standard dealer format (Year Make Model - Price - Mileage)
    /(\d{4})\s+([A-Za-z]+)\s+([A-Za-z]+)\s*[^\d]*\$([0-9]{1,3}(?:,[0-9]{3})*)[^\d]*([0-9]{1,3}(?:,[0-9]{3})*)\s*(?:mi|miles)/gi,
    
    // Pattern 4: CarMax/Carvana style listings
    /([A-Za-z]+)\s+([A-Za-z]+)\s+.*?\$([0-9]{1,3}(?:,[0-9]{3})*)\s*.*?([0-9]{1,3}(?:,[0-9]{3})*)\s*(?:mi|miles)/gi
  ];

  // Also check for known listing structures
  const knownSources = [
    { name: 'CarMax', pattern: /carmax/i },
    { name: 'Carvana', pattern: /carvana/i },
    { name: 'AutoTrader', pattern: /autotrader/i },
    { name: 'Cars.com', pattern: /cars\.com/i },
    { name: 'Dealer', pattern: /dealer|dealership/i }
  ];

  for (const pattern of patterns) {
    let match;
    pattern.lastIndex = 0; // Reset regex state
    
    while ((match = pattern.exec(text)) !== null && listings.length < 20) {
      let price: number, mileage: number, title: string, year: number | undefined;
      
      // Extract based on pattern structure
      if (match.length >= 6) {
        // Full format with year, make, model
        year = parseInt(match[1], 10);
        const make = match[2];
        const model = match[3];
        price = parseInt(match[4].replace(/,/g, ''), 10);
        mileage = parseInt(match[5].replace(/,/g, ''), 10);
        title = `${year} ${make} ${model}`;
      } else if (match.length >= 5) {
        // Make Model format
        const make = match[1];
        const model = match[2];
        price = parseInt(match[3].replace(/,/g, ''), 10);
        mileage = parseInt(match[4].replace(/,/g, ''), 10);
        title = `${make} ${model}`;
      } else {
        // Basic price-mileage format
        price = parseInt(match[1].replace(/,/g, ''), 10);
        mileage = parseInt(match[2].replace(/,/g, ''), 10);
        title = `Vehicle for $${match[1]}`;
      }
      
      // Validate extracted data with enhanced rules
      if (isValidListing(price, mileage, title)) {
        // Determine source from surrounding text
        let source = 'Web Search';
        const surroundingText = text.slice(Math.max(0, match.index! - 200), match.index! + 200);
        
        for (const knownSource of knownSources) {
          if (knownSource.pattern.test(surroundingText)) {
            source = knownSource.name;
            break;
          }
        }
        
        // Extract ZIP code from surrounding context
        const zipMatch = surroundingText.match(/\b(\d{5})\b/);
        const zipCode = zipMatch ? zipMatch[1] : undefined;
        
        listings.push({
          title: cleanTitle(title),
          price,
          mileage: mileage > 0 ? mileage : undefined,
          zipCode,
          source
        });
      }
    }
  }

  // Check for database listings format (from our test data)
  const dbPattern = /(\d{4})\s+([A-Z]+)\s+([A-Za-z]+).*?(\d{1,3}(?:,\d{3})*)\s*miles.*?\$(\d{1,3}(?:,\d{3})*)/gi;
  let dbMatch;
  while ((dbMatch = dbPattern.exec(text)) !== null && listings.length < 20) {
    const year = parseInt(dbMatch[1], 10);
    const make = dbMatch[2];
    const model = dbMatch[3];
    const mileage = parseInt(dbMatch[4].replace(/,/g, ''), 10);
    const price = parseInt(dbMatch[5].replace(/,/g, ''), 10);
    
    if (isValidListing(price, mileage, `${year} ${make} ${model}`)) {
      listings.push({
        title: cleanTitle(`${year} ${make} ${model}`),
        price,
        mileage,
        source: 'Market Database',
        zipCode: undefined
      });
    }
  }

  
  // Remove duplicates and return
  return deduplicateListings(listings);
}

function isValidListing(price: number, mileage: number, title: string): boolean {
  return (
    !isNaN(price) && 
    price >= 1000 && 
    price <= 200000 &&
    !isNaN(mileage) &&
    mileage >= 0 &&
    mileage <= 500000 &&
    Boolean(title) && 
    title.length > 5 &&
    title.length < 200
  );
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-(),.]/g, '')
    .trim()
    .slice(0, 100);
}

function deduplicateListings(listings: ParsedListing[]): ParsedListing[] {
  const seen = new Set<string>();
  return listings.filter(listing => {
    const key = `${listing.price}-${listing.mileage}-${listing.title.slice(0, 30)}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function formatListingsForExplanation(listings: ParsedListing[]): string {
  if (listings.length === 0) return "No comparable listings found.";
  
  const priceRange = {
    min: Math.min(...listings.map(l => l.price)),
    max: Math.max(...listings.map(l => l.price))
  };
  
  return `Found ${listings.length} comparable listings ranging from $${priceRange.min.toLocaleString()} to $${priceRange.max.toLocaleString()}.`;
}