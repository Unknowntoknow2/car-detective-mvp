
import { supabase } from '@/integrations/supabase/client';

export interface MarketDataDiagnosticResult {
  msrpData: {
    found: boolean;
    count: number;
    samplePrices: Array<{ trim: string; msrp: number }>;
  };
  auctionData: {
    hasResults: boolean;
    count: number;
    sampleEntries: Array<{ price: string; source: string; date: string }>;
  };
  marketListings: {
    hasResults: boolean;
    count: number;
    sources: string[];
  };
  competitorPrices: {
    hasResults: boolean;
    count: number;
    sources: string[];
    samplePrices: Array<{ source: string; value: string }>;
  };
  edgeFunctionStatus: {
    auctionFetcher: 'unknown' | 'active' | 'inactive';
    marketplaceFetcher: 'unknown' | 'active' | 'inactive';
    competitorFetcher: 'unknown' | 'active' | 'inactive';
  };
}

export async function runMarketDataDiagnostics(testVin: string = 'JTDACACU6R3026288'): Promise<MarketDataDiagnosticResult> {
  
  const result: MarketDataDiagnosticResult = {
    msrpData: { found: false, count: 0, samplePrices: [] },
    auctionData: { hasResults: false, count: 0, sampleEntries: [] },
    marketListings: { hasResults: false, count: 0, sources: [] },
    competitorPrices: { hasResults: false, count: 0, sources: [], samplePrices: [] },
    edgeFunctionStatus: {
      auctionFetcher: 'unknown',
      marketplaceFetcher: 'unknown',
      competitorFetcher: 'unknown'
    }
  };

  try {
    // Step 1: Check MSRP data for 2024 Toyota Prius Prime
    const { data: msrpData } = await supabase
      .from('model_trims')
      .select(`
        trim_name,
        msrp,
        models!inner(
          model_name,
          makes!inner(make_name)
        )
      `)
      .eq('year', 2024)
      .eq('models.makes.make_name', 'Toyota')
      .eq('models.model_name', 'Prius Prime')
      .not('msrp', 'is', null);

    if (msrpData && msrpData.length > 0) {
      result.msrpData.found = true;
      result.msrpData.count = msrpData.length;
      result.msrpData.samplePrices = msrpData.map(item => ({
        trim: item.trim_name || 'Unknown',
        msrp: Number(item.msrp || 0)
      }));
    } else {
    }

    // Step 2: Check auction results
    const { data: auctionResults } = await supabase
      .from('auction_results_by_vin')
      .select('price, auction_source, sold_date')
      .eq('vin', testVin)
      .limit(5);

    if (auctionResults && auctionResults.length > 0) {
      result.auctionData.hasResults = true;
      result.auctionData.count = auctionResults.length;
      result.auctionData.sampleEntries = auctionResults.map(item => ({
        price: item.price || 'Unknown',
        source: item.auction_source || 'Unknown',
        date: item.sold_date || 'Unknown'
      }));
    } else {
    }

    // Step 3: Check market listings
    const { data: marketListings } = await supabase
      .from('market_listings')
      .select('source, price')
      .limit(10);

    if (marketListings && marketListings.length > 0) {
      result.marketListings.hasResults = true;
      result.marketListings.count = marketListings.length;
      result.marketListings.sources = [...new Set(marketListings.map(item => item.source).filter(Boolean))];
    } else {
    }

    // Step 4: Check competitor prices
    const { data: competitorPrices } = await supabase
      .from('competitor_prices')
      .select('kbb_value, carvana_value, make, model, year')
      .eq('vin', testVin);

    if (competitorPrices && competitorPrices.length > 0) {
      result.competitorPrices.hasResults = true;
      result.competitorPrices.count = competitorPrices.length;
      
      const samplePrices: Array<{ source: string; value: string }> = [];
      const sources: string[] = [];
      
      competitorPrices.forEach(item => {
        if (item.kbb_value) {
          samplePrices.push({ source: 'KBB', value: item.kbb_value });
          sources.push('KBB');
        }
        if (item.carvana_value) {
          samplePrices.push({ source: 'Carvana', value: item.carvana_value });
          sources.push('Carvana');
        }
      });
      
      result.competitorPrices.sources = [...new Set(sources)];
      result.competitorPrices.samplePrices = samplePrices;
    } else {
    }

    // Step 5: Test edge function availability (basic check)
    try {
      // Test if auction fetcher exists by checking if we can invoke it
      const auctionTest = await supabase.functions.invoke('fetch-autoauctions-data', {
        body: { vin: testVin, dryRun: true }
      });
      
      if (auctionTest.error) {
        if (auctionTest.error.message?.includes('not found')) {
          result.edgeFunctionStatus.auctionFetcher = 'inactive';
        } else {
          result.edgeFunctionStatus.auctionFetcher = 'active';
        }
      } else {
        result.edgeFunctionStatus.auctionFetcher = 'active';
      }
    } catch (error) {
      result.edgeFunctionStatus.auctionFetcher = 'inactive';
    }

    // Test marketplace fetcher
    try {
      const marketTest = await supabase.functions.invoke('fetch-market-listings', {
        body: { vin: testVin, dryRun: true }
      });
      
      if (marketTest.error) {
        if (marketTest.error.message?.includes('not found')) {
          result.edgeFunctionStatus.marketplaceFetcher = 'inactive';
        } else {
          result.edgeFunctionStatus.marketplaceFetcher = 'active';
        }
      } else {
        result.edgeFunctionStatus.marketplaceFetcher = 'active';
      }
    } catch (error) {
      result.edgeFunctionStatus.marketplaceFetcher = 'inactive';
    }

    // Test competitor price fetcher
    try {
      const competitorTest = await supabase.functions.invoke('fetch-competitor-prices', {
        body: { vin: testVin, dryRun: true }
      });
      
      if (competitorTest.error) {
        if (competitorTest.error.message?.includes('not found')) {
          result.edgeFunctionStatus.competitorFetcher = 'inactive';
        } else {
          result.edgeFunctionStatus.competitorFetcher = 'active';
        }
      } else {
        result.edgeFunctionStatus.competitorFetcher = 'active';
      }
    } catch (error) {
      result.edgeFunctionStatus.competitorFetcher = 'inactive';
    }

  } catch (error) {
    console.error('❌ Error during market data diagnostics:', error);
  }

  return result;
}

export function logMarketDataSummary(result: MarketDataDiagnosticResult) {
  
  if (result.msrpData.found) {
  }
  
  if (result.auctionData.hasResults) {
  }
  
  if (result.marketListings.hasResults) {
  }
  
  if (result.competitorPrices.hasResults) {
  }
  
  
}
