import { MarketListing } from "@/types/valuation";

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
  
  // Enhanced regex patterns for better extraction
  const patterns = [
    // Pattern 1: $XX,XXX - XXXX Make Model - XX,XXX mi
    /\$([0-9]{1,3}(?:,[0-9]{3})*)\s*[-–—]\s*([^-\n]+?)\s*[-–—]\s*([0-9]{1,3}(?:,[0-9]{3})*)\s*(?:mi|miles|k)/gi,
    
    // Pattern 2: $XX,XXX XXXX Make Model XX,XXX miles
    /\$([0-9]{1,3}(?:,[0-9]{3})*)\s+([^$\n]+?)\s+([0-9]{1,3}(?:,[0-9]{3})*)\s*(?:mi|miles|k)/gi,
    
    // Pattern 3: XXXX Make Model - $XX,XXX - XX,XXX miles
    /([^$\n]+?)\s*[-–—]\s*\$([0-9]{1,3}(?:,[0-9]{3})*)\s*[-–—]\s*([0-9]{1,3}(?:,[0-9]{3})*)\s*(?:mi|miles|k)/gi,
    
    // Pattern 4: Simple price extraction for fallback
    /\$([0-9]{1,3}(?:,[0-9]{3})*).*?([0-9]{1,3}(?:,[0-9]{3})*)\s*(?:mi|miles|k)/gi
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null && listings.length < 15) {
      let price: number, mileage: number, title: string;
      
      if (pattern === patterns[2]) {
        // Pattern 3: title first, then price, then mileage
        title = match[1].trim();
        price = parseInt(match[2].replace(/,/g, ''), 10);
        mileage = parseInt(match[3].replace(/,/g, ''), 10);
      } else {
        // Patterns 1, 2, 4: price first
        price = parseInt(match[1].replace(/,/g, ''), 10);
        title = match[2]?.trim() || `Vehicle for $${match[1]}`;
        mileage = parseInt(match[3]?.replace(/,/g, '') || '0', 10);
      }
      
      // Validate extracted data
      if (isValidListing(price, mileage, title)) {
        // Extract ZIP code if present
        const zipMatch = title.match(/\b(\d{5})\b/);
        const zipCode = zipMatch ? zipMatch[1] : undefined;
        
        listings.push({
          title: cleanTitle(title),
          price,
          mileage: mileage > 0 ? mileage : undefined,
          zipCode,
          source: 'Web Search'
        });
      }
    }
  }

  // Remove duplicates based on price and similar title
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