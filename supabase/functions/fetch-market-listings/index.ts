
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { zipCode, make, model, year } = await req.json()

    if (!zipCode) {
      return new Response(JSON.stringify({ error: 'ZIP Code is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    // Enhanced market data sources
    const marketSources = [
      'Facebook Marketplace', 
      'Craigslist', 
      'OfferUp', 
      'Carvana', 
      'CarMax',
      'AutoTrader',
      'Cars.com',
      'TrueCar',
      'eBay Motors',
      'Vroom'
    ];
    
    // Create more realistic price variations based on market conditions
    // Price variations are created with some statistical analysis in mind
    const basePrice = getBasePrice(make, model, year);
    const zipCodeFactor = getZipCodeFactor(zipCode);
    
    // Generate market listings with price variations
    const mockMarketListings = {};
    
    marketSources.forEach(source => {
      // Each source will have slight price variations based on its market position
      const sourceFactor = getSourceFactor(source);
      
      // Apply small random variation to simulate real market conditions
      const randomFactor = 0.95 + (Math.random() * 0.1); // ±5% random factor
      
      // Calculate final price for this source
      mockMarketListings[source] = Math.round(basePrice * zipCodeFactor * sourceFactor * randomFactor);
    });

    // Log the data for debugging
    console.log(`Generated market listings for ${make} ${model} ${year} in ${zipCode}:`, mockMarketListings);
    
    // Generate URLs for each source
    const sourceUrls = {};
    marketSources.forEach(source => {
      sourceUrls[source] = generateSourceUrl(source, make, model, year);
    });

    // Note: In a production implementation, you'd query multiple real market data sources
    const { error } = await supabase
      .from('market_listings')
      .insert(
        Object.entries(mockMarketListings).map(([source, price]) => ({
          source,
          price,
          valuation_id: null,  // You'd link this to a specific valuation in production
          url: sourceUrls[source]
        }))
      )

    if (error) throw error

    return new Response(JSON.stringify({ 
      zipCode, 
      averages: mockMarketListings,
      sources: sourceUrls
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Market listings fetch error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

// Helper functions to simulate more accurate market pricing

// Simulated base price calculator based on make/model/year
function getBasePrice(make: string, model: string, year: number): number {
  // Default base prices for common makes/models
  const baseValues: Record<string, Record<string, number>> = {
    'Toyota': {
      'Camry': 25000,
      'Corolla': 20000,
      'RAV4': 28000,
      'default': 24000
    },
    'Honda': {
      'Civic': 22000,
      'Accord': 27000,
      'CR-V': 29000,
      'default': 25000
    },
    'Ford': {
      'F-150': 35000,
      'Escape': 25000,
      'Explorer': 32000,
      'default': 28000
    },
    'default': 22000
  };
  
  // Get base value for make/model or use defaults
  const makeValues = baseValues[make] || {'default': baseValues['default']};
  const baseValue = makeValues[model] || makeValues['default'];
  
  // Apply depreciation based on vehicle age
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  // Complex depreciation model:
  // - First year: 20% depreciation
  // - Years 2-5: 10% per year
  // - Years 6-10: 7% per year
  // - Years 11+: 3% per year
  let depreciationFactor = 1.0;
  
  if (age > 0) {
    // First year depreciation
    depreciationFactor -= 0.2;
    
    // Years 2-5
    if (age > 1) {
      const years2to5 = Math.min(age - 1, 4);
      depreciationFactor -= years2to5 * 0.1;
    }
    
    // Years 6-10
    if (age > 5) {
      const years6to10 = Math.min(age - 5, 5);
      depreciationFactor -= years6to10 * 0.07;
    }
    
    // Years 11+
    if (age > 10) {
      const years11plus = age - 10;
      depreciationFactor -= years11plus * 0.03;
    }
  }
  
  // Ensure we don't go below 10% of original value
  depreciationFactor = Math.max(depreciationFactor, 0.1);
  
  return Math.round(baseValue * depreciationFactor);
}

// Factor based on zip code to adjust for regional market differences
function getZipCodeFactor(zipCode: string): number {
  // High-cost areas (major metros)
  const highCostZips = ['90210', '10001', '94102', '98101', '02108', '60611'];
  
  // Low-cost areas (rural regions)
  const lowCostZips = ['78572', '30401', '63115', '35203', '59101'];
  
  if (highCostZips.includes(zipCode)) {
    return 1.15; // 15% higher prices
  } else if (lowCostZips.includes(zipCode)) {
    return 0.85; // 15% lower prices
  }
  
  // ZIP code first digit can give us rough geographic region
  const region = parseInt(zipCode.charAt(0));
  
  // Adjust based on US regions (simplified)
  switch (region) {
    case 0: case 1: case 2: // Northeast
      return 1.08;
    case 3: // Southeast
      return 0.95;
    case 4: case 5: // Midwest
      return 0.92;
    case 7: case 8: // Southwest/Mountain
      return 0.97;
    case 9: // West Coast
      return 1.12;
    default:
      return 1.0;
  }
}

// Factor based on source/platform to simulate their market positioning
function getSourceFactor(source: string): number {
  switch (source) {
    case 'Carvana': 
    case 'Vroom':
      return 1.12; // These typically price higher
    case 'CarMax':
      return 1.08;
    case 'AutoTrader':
    case 'Cars.com':
      return 1.05;
    case 'TrueCar':
      return 1.02;
    case 'Facebook Marketplace':
    case 'Craigslist':
    case 'OfferUp':
      return 0.92; // Peer-to-peer typically price lower
    case 'eBay Motors':
      return 0.95;
    default:
      return 1.0;
  }
}

// Generate realistic URLs for each source
function generateSourceUrl(source: string, make: string, model: string, year: string | number): string {
  const formattedMake = make.toLowerCase();
  const formattedModel = model.toLowerCase().replace(/\s+/g, '-');
  
  switch (source) {
    case 'Carvana':
      return `https://www.carvana.com/cars/${formattedMake}/${formattedModel}?year=${year}`;
    case 'CarMax':
      return `https://www.carmax.com/cars/${formattedMake}/${formattedModel}?year=${year}`;
    case 'AutoTrader':
      return `https://www.autotrader.com/cars-for-sale/${formattedMake}/${formattedModel}/${year}`;
    case 'Cars.com':
      return `https://www.cars.com/shopping/${formattedMake}/${formattedModel}/${year}/`;
    case 'TrueCar':
      return `https://www.truecar.com/used-cars-for-sale/listings/${formattedMake}/${formattedModel}/year-${year}/`;
    case 'Facebook Marketplace':
      return `https://www.facebook.com/marketplace/search/?query=${year}%20${make}%20${model}`;
    case 'Craigslist':
      return `https://craigslist.org/search/cta?query=${year}+${make}+${model}`;
    case 'OfferUp':
      return `https://offerup.com/search?q=${year}+${make}+${model}`;
    case 'eBay Motors':
      return `https://www.ebay.com/sch/Cars-Trucks/6001/i.html?_nkw=${year}+${make}+${model}`;
    case 'Vroom':
      return `https://www.vroom.com/inventory/make/${formattedMake}/model/${formattedModel}/year-${year}`;
    default:
      return `https://www.google.com/search?q=${year}+${make}+${model}+for+sale`;
  }
}
