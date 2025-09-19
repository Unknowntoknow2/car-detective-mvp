
import { supabase } from '@/integrations/supabase/client';

export interface AuditResult {
  vin: string;
  status: 'pass' | 'fail' | 'warning';
  errors: string[];
  warnings: string[];
  dataPoints: Record<string, any>;
  timestamp: string;
}

export async function runValuationAudit(vin: string): Promise<AuditResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const dataPoints: Record<string, any> = {};
  
  console.log(`🔍 Starting diagnostic audit for VIN: ${vin}`);

  try {
    // 1. Verify VIN format and valuation record
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
      errors.push('❌ Invalid VIN format - must be 17 alphanumeric characters');
    }

    const { data: valuation, error: valErr } = await supabase
      .from('valuation_results')
      .select('*')
      .eq('vin', vin)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (valErr) {
      errors.push(`❌ Database error fetching valuation: ${valErr.message}`);
    } else if (!valuation) {
      errors.push(`❌ No valuation record found for VIN: ${vin}`);
    } else {
      dataPoints.valuation = valuation;
      console.log(`✅ Found valuation record with ID: ${valuation.id}`);
      
      // Verify required valuation fields
      if (!valuation.estimated_value) errors.push('❌ Missing estimated_value in valuation');
      if (!valuation.confidence_score) warnings.push('⚠️ Missing confidence_score in valuation');
      if (!valuation.make || !valuation.model) errors.push('❌ Missing make/model in valuation');
    }

    // 2. Check decoded vehicle data
    const { data: decodedVehicle } = await supabase
      .from('decoded_vehicles')
      .select('*')
      .eq('vin', vin)
      .maybeSingle();

    if (decodedVehicle) {
      dataPoints.decodedVehicle = decodedVehicle;
      console.log(`✅ Found decoded vehicle data`);
    } else {
      warnings.push(`⚠️ No decoded vehicle data found for VIN: ${vin}`);
    }

    // 3. Check follow-up answers
    const { data: followupAnswers } = await supabase
      .from('follow_up_answers')
      .select('*')
      .eq('vin', vin)
      .maybeSingle();

    if (followupAnswers) {
      dataPoints.followupAnswers = followupAnswers;
      console.log(`✅ Found follow-up answers`);
      
      // Verify critical follow-up fields
      if (followupAnswers.mileage === null) warnings.push('⚠️ Missing mileage in follow-up answers');
      if (!followupAnswers.condition) warnings.push('⚠️ Missing condition in follow-up answers');
      if (!followupAnswers.zip_code) warnings.push('⚠️ Missing ZIP code in follow-up answers');
    } else {
      warnings.push(`⚠️ No follow-up answers found for VIN: ${vin}`);
    }

    // 4. Check auction data
    const { data: auctionResults } = await supabase
      .from('auction_results_by_vin')
      .select('*')
      .eq('vin', vin)
      .order('sold_date', { ascending: false });

    if (auctionResults && auctionResults.length > 0) {
      dataPoints.auctionResults = auctionResults;
      console.log(`✅ Found ${auctionResults.length} auction records`);
    } else {
      warnings.push(`⚠️ No auction data found for VIN: ${vin}`);
    }

    // 5. Check marketplace listings
    const { data: marketplaceListings } = await supabase
      .from('scraped_listings')
      .select('*')
      .eq('vin', vin)
      .order('created_at', { ascending: false });

    if (marketplaceListings && marketplaceListings.length > 0) {
      dataPoints.marketplaceListings = marketplaceListings;
      console.log(`✅ Found ${marketplaceListings.length} marketplace listings`);
    } else {
      warnings.push(`⚠️ No marketplace listings found for VIN: ${vin}`);
    }

    // 6. Check dealer offers
    const { data: dealerOffers } = await supabase
      .from('dealer_offers')
      .select('*')
      .eq('report_id', valuation?.id)
      .order('created_at', { ascending: false });

    if (dealerOffers && dealerOffers.length > 0) {
      dataPoints.dealerOffers = dealerOffers;
      console.log(`✅ Found ${dealerOffers.length} dealer offers`);
    } else {
      warnings.push(`⚠️ No dealer offers found for this valuation`);
    }

    // 7. Check VIN forecast data
    const { data: vinForecast } = await supabase
      .from('vin_forecasts')
      .select('*')
      .eq('vin', vin)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .maybeSingle();

    if (vinForecast) {
      dataPoints.vinForecast = vinForecast;
      console.log(`✅ Found VIN forecast data`);
    } else {
      warnings.push(`⚠️ No current forecast data found for VIN: ${vin}`);
    }

    // 8. Check competitor pricing
    const { data: competitorPrices } = await supabase
      .from('competitor_prices')
      .select('*')
      .eq('vin', vin)
      .order('fetched_at', { ascending: false })
      .maybeSingle();

    if (competitorPrices) {
      dataPoints.competitorPrices = competitorPrices;
      console.log(`✅ Found competitor pricing data`);
    } else {
      warnings.push(`⚠️ No competitor pricing data found for VIN: ${vin}`);
    }

    // 9. Data consistency checks
    if (valuation && followupAnswers) {
      if (valuation.make !== decodedVehicle?.make) {
        warnings.push(`⚠️ Make mismatch: Valuation(${valuation.make}) vs Decoded(${decodedVehicle?.make})`);
      }
      if (valuation.model !== decodedVehicle?.model) {
        warnings.push(`⚠️ Model mismatch: Valuation(${valuation.model}) vs Decoded(${decodedVehicle?.model})`);
      }
      if (valuation.year !== decodedVehicle?.year) {
        warnings.push(`⚠️ Year mismatch: Valuation(${valuation.year}) vs Decoded(${decodedVehicle?.year})`);
      }
    }

  } catch (error) {
    errors.push(`❌ Audit failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const status = errors.length > 0 ? 'fail' : warnings.length > 0 ? 'warning' : 'pass';
  
  return {
    vin,
    status,
    errors,
    warnings,
    dataPoints,
    timestamp: new Date().toISOString()
  };
}

export async function runBatchAudit(vins: string[]): Promise<AuditResult[]> {
  const results: AuditResult[] = [];
  
  for (const vin of vins) {
    const result = await runValuationAudit(vin);
    results.push(result);
    
    // Add delay to avoid overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

export function printAuditReport(result: AuditResult): void {
  console.log(`\n🔍 DIAGNOSTIC AUDIT REPORT FOR VIN: ${result.vin}`);
  console.log(`📅 Timestamp: ${result.timestamp}`);
  console.log(`🎯 Status: ${result.status.toUpperCase()}`);
  
  if (result.errors.length > 0) {
    console.log(`\n❌ ERRORS (${result.errors.length}):`);
    result.errors.forEach(error => console.log(`  ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${result.warnings.length}):`);
    result.warnings.forEach(warning => console.log(`  ${warning}`));
  }
  
  console.log(`\n📊 DATA SUMMARY:`);
  console.log(`  • Valuation Record: ${result.dataPoints.valuation ? '✅' : '❌'}`);
  console.log(`  • Decoded Vehicle: ${result.dataPoints.decodedVehicle ? '✅' : '⚠️'}`);
  console.log(`  • Follow-up Answers: ${result.dataPoints.followupAnswers ? '✅' : '⚠️'}`);
  console.log(`  • Auction Results: ${result.dataPoints.auctionResults ? `✅ (${result.dataPoints.auctionResults.length})` : '⚠️'}`);
  console.log(`  • Marketplace Listings: ${result.dataPoints.marketplaceListings ? `✅ (${result.dataPoints.marketplaceListings.length})` : '⚠️'}`);
  console.log(`  • Dealer Offers: ${result.dataPoints.dealerOffers ? `✅ (${result.dataPoints.dealerOffers.length})` : '⚠️'}`);
  console.log(`  • VIN Forecast: ${result.dataPoints.vinForecast ? '✅' : '⚠️'}`);
  console.log(`  • Competitor Prices: ${result.dataPoints.competitorPrices ? '✅' : '⚠️'}`);
  
  if (result.status === 'pass') {
    console.log(`\n🎉 ALL SYSTEMS OPERATIONAL FOR VIN: ${result.vin}`);
  } else if (result.status === 'warning') {
    console.log(`\n⚠️  SYSTEM FUNCTIONAL BUT HAS WARNINGS FOR VIN: ${result.vin}`);
  } else {
    console.log(`\n🚨 SYSTEM ERRORS DETECTED FOR VIN: ${result.vin}`);
  }
}
