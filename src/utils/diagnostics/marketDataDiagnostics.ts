
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
  console.log('🔍 Starting market data diagnostics for VIN:', testVin);
  
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
    console.log('📊 Checking MSRP data for 2024 Toyota Prius Prime...');
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
      console.log('✅ Found MSRP data:', result.msrpData.count, 'trims');
      console.log('💰 Sample prices:', result.msrpData.samplePrices);
    } else {
      console.log('❌ No MSRP data found for 2024 Toyota Prius Prime');
    }

    // Step 2: Check auction results
    console.log('🏁 Checking auction results for test VIN...');
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
      console.log('✅ Found auction data:', result.auctionData.count, 'entries');
    } else {
      console.log('❌ No auction results found for VIN:', testVin);
    }

    // Step 3: Check market listings
    console.log('🛒 Checking market listings...');
    const { data: marketListings } = await supabase
      .from('market_listings')
      .select('source, price')
      .limit(10);

    if (marketListings && marketListings.length > 0) {
      result.marketListings.hasResults = true;
      result.marketListings.count = marketListings.length;
      result.marketListings.sources = [...new Set(marketListings.map(item => item.source).filter(Boolean))];
      console.log('✅ Found market listings:', result.marketListings.count, 'entries');
      console.log('📊 Sources:', result.marketListings.sources);
    } else {
      console.log('❌ No market listings found');
    }

    // Step 4: Check competitor prices
    console.log('💲 Checking competitor price data...');
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
      console.log('✅ Found competitor price data:', result.competitorPrices.count, 'entries');
      console.log('🏪 Sources:', result.competitorPrices.sources);
    } else {
      console.log('❌ No competitor price data found for VIN:', testVin);
    }

    // Step 5: Test edge function availability (basic check)
    console.log('🔌 Testing edge function availability...');
    try {
      // Test if auction fetcher exists by checking if we can invoke it
      const auctionTest = await supabase.functions.invoke('fetch-autoauctions-data', {
        body: { vin: testVin, dryRun: true }
      });
      
      if (auctionTest.error) {
        if (auctionTest.error.message?.includes('not found')) {
          result.edgeFunctionStatus.auctionFetcher = 'inactive';
          console.log('❌ Auction fetcher edge function not found');
        } else {
          result.edgeFunctionStatus.auctionFetcher = 'active';
          console.log('✅ Auction fetcher edge function exists');
        }
      } else {
        result.edgeFunctionStatus.auctionFetcher = 'active';
        console.log('✅ Auction fetcher edge function active');
      }
    } catch (error) {
      result.edgeFunctionStatus.auctionFetcher = 'inactive';
      console.log('❌ Auction fetcher edge function test failed:', error);
    }

    // Test marketplace fetcher
    try {
      const marketTest = await supabase.functions.invoke('fetch-market-listings', {
        body: { vin: testVin, dryRun: true }
      });
      
      if (marketTest.error) {
        if (marketTest.error.message?.includes('not found')) {
          result.edgeFunctionStatus.marketplaceFetcher = 'inactive';
          console.log('❌ Marketplace fetcher edge function not found');
        } else {
          result.edgeFunctionStatus.marketplaceFetcher = 'active';
          console.log('✅ Marketplace fetcher edge function exists');
        }
      } else {
        result.edgeFunctionStatus.marketplaceFetcher = 'active';
        console.log('✅ Marketplace fetcher edge function active');
      }
    } catch (error) {
      result.edgeFunctionStatus.marketplaceFetcher = 'inactive';
      console.log('❌ Marketplace fetcher edge function test failed:', error);
    }

    // Test competitor price fetcher
    try {
      const competitorTest = await supabase.functions.invoke('fetch-competitor-prices', {
        body: { vin: testVin, dryRun: true }
      });
      
      if (competitorTest.error) {
        if (competitorTest.error.message?.includes('not found')) {
          result.edgeFunctionStatus.competitorFetcher = 'inactive';
          console.log('❌ Competitor price fetcher edge function not found');
        } else {
          result.edgeFunctionStatus.competitorFetcher = 'active';
          console.log('✅ Competitor price fetcher edge function exists');
        }
      } else {
        result.edgeFunctionStatus.competitorFetcher = 'active';
        console.log('✅ Competitor price fetcher edge function active');
      }
    } catch (error) {
      result.edgeFunctionStatus.competitorFetcher = 'inactive';
      console.log('❌ Competitor price fetcher edge function test failed:', error);
    }

  } catch (error) {
    console.error('❌ Error during market data diagnostics:', error);
  }

  console.log('📋 Market data diagnostics complete:', result);
  return result;
}

export function logMarketDataSummary(result: MarketDataDiagnosticResult) {
  console.log('\n🎯 MARKET DATA DIAGNOSTIC SUMMARY');
  console.log('=====================================');
  
  console.log(`📊 MSRP Data: ${result.msrpData.found ? '✅ ACTIVE' : '❌ MISSING'}`);
  if (result.msrpData.found) {
    console.log(`   - Found ${result.msrpData.count} trim(s) with MSRP data`);
    console.log(`   - Price range: $${Math.min(...result.msrpData.samplePrices.map(p => p.msrp)).toLocaleString()} - $${Math.max(...result.msrpData.samplePrices.map(p => p.msrp)).toLocaleString()}`);
  }
  
  console.log(`🏁 Auction Data: ${result.auctionData.hasResults ? '✅ ACTIVE' : '❌ MISSING'}`);
  if (result.auctionData.hasResults) {
    console.log(`   - Found ${result.auctionData.count} auction result(s)`);
  }
  
  console.log(`🛒 Market Listings: ${result.marketListings.hasResults ? '✅ ACTIVE' : '❌ MISSING'}`);
  if (result.marketListings.hasResults) {
    console.log(`   - Found ${result.marketListings.count} listing(s)`);
    console.log(`   - Sources: ${result.marketListings.sources.join(', ')}`);
  }
  
  console.log(`💲 Competitor Prices: ${result.competitorPrices.hasResults ? '✅ ACTIVE' : '❌ MISSING'}`);
  if (result.competitorPrices.hasResults) {
    console.log(`   - Found ${result.competitorPrices.count} price record(s)`);
    console.log(`   - Sources: ${result.competitorPrices.sources.join(', ')}`);
  }
  
  console.log('\n🔌 EDGE FUNCTION STATUS:');
  console.log(`   - Auction Fetcher: ${result.edgeFunctionStatus.auctionFetcher.toUpperCase()}`);
  console.log(`   - Marketplace Fetcher: ${result.edgeFunctionStatus.marketplaceFetcher.toUpperCase()}`);
  console.log(`   - Competitor Fetcher: ${result.edgeFunctionStatus.competitorFetcher.toUpperCase()}`);
  
  console.log('\n=====================================\n');
}
