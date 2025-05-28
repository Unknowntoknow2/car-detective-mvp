
import { StatVinData } from '../types';

export async function fetchStatVinData(vin: string): Promise<StatVinData | null> {
  try {
    console.log(`🔍 Fetching real STAT.vin data for VIN: ${vin}`);
    
    // Method 1: Direct API call (if STAT.vin provides an API)
    // Note: STAT.vin may require special access or partnership
    
    // Method 2: Web scraping via BrightData
    const brightDataEndpoint = 'https://api.brightdata.com/scraper/statvin';
    
    const response = await fetch(brightDataEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BRIGHTDATA_API_KEY}`,
      },
      body: JSON.stringify({
        vin: vin.toUpperCase(),
        include_photos: true,
        include_damage: true,
        include_history: true,
      }),
    });

    if (!response.ok) {
      console.warn(`STAT.vin API returned ${response.status}, falling back to scraping`);
      return await fallbackStatVinScraping(vin);
    }

    const data = await response.json();
    
    if (!data.success || !data.vehicle) {
      console.log('No STAT.vin data found for this VIN');
      return null;
    }

    // Transform BrightData response to our StatVinData format
    return {
      vin: data.vehicle.vin || vin,
      salePrice: data.vehicle.sale_price,
      damage: data.vehicle.primary_damage,
      status: data.vehicle.title_status,
      auctionDate: data.vehicle.sale_date,
      location: data.vehicle.sale_location,
      images: data.vehicle.photos || [],
      make: data.vehicle.make,
      model: data.vehicle.model,
      year: data.vehicle.year,
      mileage: data.vehicle.odometer,
      bodyType: data.vehicle.body_type,
      engine: data.vehicle.engine,
      transmission: data.vehicle.transmission,
      fuelType: data.vehicle.fuel_type,
      drivetrain: data.vehicle.drivetrain,
      exteriorColor: data.vehicle.exterior_color,
      interiorColor: data.vehicle.interior_color,
      keys: data.vehicle.keys,
      seller: data.vehicle.seller,
      lot: data.vehicle.lot_number,
      estimatedRepairCost: data.vehicle.estimated_repair_cost,
      estimatedRetailValue: data.vehicle.estimated_retail_value,
      condition: data.vehicle.condition_grade,
      titleType: data.vehicle.title_type,
      primaryDamage: data.vehicle.primary_damage,
      secondaryDamage: data.vehicle.secondary_damage,
      saleType: data.vehicle.sale_type,
      runAndDrive: data.vehicle.run_and_drive,
    };

  } catch (error) {
    console.error('STAT.vin fetch error:', error);
    return await fallbackStatVinScraping(vin);
  }
}

async function fallbackStatVinScraping(vin: string): Promise<StatVinData | null> {
  try {
    // Direct web scraping as fallback
    const url = `https://stat.vin/vin-decoder/${vin}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
    });

    if (!response.ok) {
      throw new Error(`STAT.vin returned ${response.status}`);
    }

    const html = await response.text();
    
    // Parse HTML for auction data
    // This is a simplified parser - in production you'd use a more robust HTML parser
    const auctionData = parseStatVinHTML(html, vin);
    
    return auctionData;

  } catch (error) {
    console.error('STAT.vin fallback scraping failed:', error);
    return null;
  }
}

function parseStatVinHTML(html: string, vin: string): StatVinData | null {
  try {
    // Basic HTML parsing for auction data
    // In production, you'd use a proper HTML parser like Cheerio
    
    const salePriceMatch = html.match(/Sale Price[:\s]*\$?([\d,]+)/i);
    const damageMatch = html.match(/Damage[:\s]*([^<\n]+)/i);
    const dateMatch = html.match(/Sale Date[:\s]*(\d{4}-\d{2}-\d{2})/i);
    const locationMatch = html.match(/Location[:\s]*([^<\n]+)/i);
    
    if (!salePriceMatch) {
      return null; // No auction data found
    }

    return {
      vin,
      salePrice: salePriceMatch[1]?.replace(/,/g, ''),
      damage: damageMatch?.[1]?.trim(),
      auctionDate: dateMatch?.[1],
      location: locationMatch?.[1]?.trim(),
      images: extractImageUrls(html),
      // Additional fields would be parsed similarly
      make: extractMake(html),
      model: extractModel(html),
      year: extractYear(html),
      mileage: extractMileage(html),
    };

  } catch (error) {
    console.error('HTML parsing error:', error);
    return null;
  }
}

function extractImageUrls(html: string): string[] {
  const imageRegex = /<img[^>]+src="([^"]*auction[^"]*\.jpg)"/gi;
  const matches = [];
  let match;
  
  while ((match = imageRegex.exec(html)) !== null) {
    matches.push(match[1]);
  }
  
  return matches;
}

function extractMake(html: string): string | undefined {
  const makeMatch = html.match(/Make[:\s]*([^<\n]+)/i);
  return makeMatch?.[1]?.trim();
}

function extractModel(html: string): string | undefined {
  const modelMatch = html.match(/Model[:\s]*([^<\n]+)/i);
  return modelMatch?.[1]?.trim();
}

function extractYear(html: string): string | undefined {
  const yearMatch = html.match(/Year[:\s]*(\d{4})/i);
  return yearMatch?.[1];
}

function extractMileage(html: string): string | undefined {
  const mileageMatch = html.match(/Mileage[:\s]*([\d,]+)/i);
  return mileageMatch?.[1]?.replace(/,/g, '');
}
