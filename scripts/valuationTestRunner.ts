#!/usr/bin/env tsx
/**
 * Valuation Pipeline CLI Test Runner
 * 
 * Usage:
 *   npx tsx scripts/valuationTestRunner.ts <VIN> <ZIP> [options]
 * 
 * Examples:
 *   npx tsx scripts/valuationTestRunner.ts JTDKARFP5M3042123 90210
 *   npx tsx scripts/valuationTestRunner.ts JTDKARFP5M3042123 90210 --condition=excellent --mileage=45000
 *   npx tsx scripts/valuationTestRunner.ts JTDKARFP5M3042123 90210 --premium --verbose
 */

import { processValuation, type ValuationInput, type ValuationResult } from '../src/utils/valuation/unifiedValuationEngine';

interface CLIOptions {
  vin: string;
  zipCode: string;
  mileage?: number;
  condition?: string;
  userId?: string;
  isPremium?: boolean;
  verbose?: boolean;
  forceNew?: boolean;
}

function parseArguments(): CLIOptions {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('❌ Usage: npx tsx scripts/valuationTestRunner.ts <VIN> <ZIP> [options]');
    console.error('');
    console.error('Options:');
    console.error('  --mileage=<number>     Vehicle mileage (default: 75000)');
    console.error('  --condition=<string>   Vehicle condition: excellent|good|fair|poor (default: good)');
    console.error('  --user-id=<string>     User ID for premium features');
    console.error('  --premium              Enable premium features');
    console.error('  --verbose              Enable verbose logging');
    console.error('  --force-new            Force new valuation (skip cache)');
    console.error('');
    console.error('Examples:');
    console.error('  npx tsx scripts/valuationTestRunner.ts JTDKARFP5M3042123 90210');
    console.error('  npx tsx scripts/valuationTestRunner.ts JTDKARFP5M3042123 90210 --condition=excellent --mileage=45000');
    process.exit(1);
  }

  const options: CLIOptions = {
    vin: args[0].toUpperCase(),
    zipCode: args[1],
    mileage: 75000, // Default mileage
    condition: 'good', // Default condition
    isPremium: false,
    verbose: false,
    forceNew: false
  };

  // Parse optional arguments
  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--mileage=')) {
      options.mileage = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--condition=')) {
      options.condition = arg.split('=')[1];
    } else if (arg.startsWith('--user-id=')) {
      options.userId = arg.split('=')[1];
    } else if (arg === '--premium') {
      options.isPremium = true;
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else if (arg === '--force-new') {
      options.forceNew = true;
    }
  }

  return options;
}

function printSeparator(title: string = '') {
  const line = '='.repeat(80);
  if (title) {
    const padding = Math.max(0, (80 - title.length - 2) / 2);
    const paddedTitle = ' '.repeat(Math.floor(padding)) + title + ' '.repeat(Math.ceil(padding));
    console.log(line);
    console.log(paddedTitle);
    console.log(line);
  } else {
    console.log(line);
  }
}

function printTestInputs(options: CLIOptions) {
  printSeparator('TEST INPUTS');
  console.log(`🔧 VIN:           ${options.vin}`);
  console.log(`📍 ZIP Code:     ${options.zipCode}`);
  console.log(`🚗 Mileage:      ${options.mileage?.toLocaleString()} miles`);
  console.log(`🏆 Condition:    ${options.condition}`);
  console.log(`💎 Premium:      ${options.isPremium ? 'Yes' : 'No'}`);
  console.log(`👤 User ID:      ${options.userId || 'Anonymous'}`);
  console.log(`🔄 Force New:    ${options.forceNew ? 'Yes' : 'No'}`);
  console.log(`📝 Verbose:      ${options.verbose ? 'Yes' : 'No'}`);
  console.log('');
}

function printValuationResult(result: ValuationResult) {
  printSeparator('VALUATION RESULTS');
  
  // Basic results
  console.log(`🎯 Final Value:     $${result.finalValue.toLocaleString()}`);
  console.log(`📊 Confidence:     ${result.confidenceScore}%`);
  console.log(`🔍 Base Value:     $${result.baseValue.toLocaleString()}`);
  console.log(`📈 Market Status:  ${result.marketSearchStatus}`);
  console.log(`📋 Listing Count:  ${result.listingCount}`);
  console.log('');

  // Vehicle information
  console.log('🚗 Vehicle Details:');
  console.log(`   Year:  ${result.vehicle.year}`);
  console.log(`   Make:  ${result.vehicle.make}`);
  console.log(`   Model: ${result.vehicle.model}`);
  console.log(`   Trim:  ${result.vehicle.trim || 'N/A'}`);
  console.log(`   Fuel:  ${result.vehicle.fuelType || 'N/A'}`);
  console.log(`   MSRP:  $${result.vehicle.msrp?.toLocaleString() || 'N/A'}`);
  console.log('');

  // Adjustments breakdown
  if (result.adjustments && result.adjustments.length > 0) {
    console.log('💰 Value Adjustments:');
    let totalAdjustments = 0;
    result.adjustments.forEach(adj => {
      const sign = adj.amount >= 0 ? '+' : '';
      console.log(`   ${adj.label.padEnd(20)} ${sign}$${adj.amount.toLocaleString().padStart(8)} - ${adj.reason}`);
      totalAdjustments += adj.amount;
    });
    console.log(`   ${'Total Adjustments'.padEnd(20)} ${totalAdjustments >= 0 ? '+' : ''}$${totalAdjustments.toLocaleString().padStart(8)}`);
    console.log('');
  }

  // Market data analysis
  if (result.listingRange) {
    console.log('📊 Market Analysis:');
    console.log(`   Price Range: $${result.listingRange.min.toLocaleString()} - $${result.listingRange.max.toLocaleString()}`);
    console.log(`   Spread:      $${(result.listingRange.max - result.listingRange.min).toLocaleString()}`);
    const spreadPercent = ((result.listingRange.max - result.listingRange.min) / result.finalValue * 100).toFixed(1);
    console.log(`   Volatility:  ${spreadPercent}%`);
    console.log('');
  }

  // Sources used
  if (result.sources && result.sources.length > 0) {
    console.log('🔗 Data Sources:');
    result.sources.forEach(source => {
      console.log(`   • ${source}`);
    });
    console.log('');
  }

  // Premium features
  if (result.isPremium) {
    console.log('💎 Premium Features:');
    if (result.shareLink) console.log(`   Share Link: ${result.shareLink}`);
    if (result.qrCode) console.log(`   QR Code:    Available`);
    if (result.pdfUrl) console.log(`   PDF Report: ${result.pdfUrl}`);
    console.log('');
  }

  // AI Explanation
  if (result.aiExplanation) {
    console.log('🤖 AI Explanation:');
    console.log(`   ${result.aiExplanation}`);
    console.log('');
  }

  // Performance metrics
  console.log('⏱️  Performance:');
  console.log(`   Timestamp:     ${new Date(result.timestamp).toISOString()}`);
  console.log(`   Processing:    ${result.progressStep || 'N/A'} steps`);
  console.log('');
}

function printListingDetails(result: ValuationResult) {
  if (result.listings && result.listings.length > 0) {
    printSeparator('MARKET LISTINGS DETAIL');
    console.log(`Found ${result.listings.length} market listings:\n`);
    
    result.listings.forEach((listing, index) => {
      console.log(`📋 Listing ${index + 1}:`);
      console.log(`   Price:     $${listing.price?.toLocaleString() || 'N/A'}`);
      console.log(`   Source:    ${listing.source || 'N/A'}`);
      console.log(`   Type:      ${listing.source_type || 'N/A'}`);
      console.log(`   Mileage:   ${listing.mileage?.toLocaleString() || 'N/A'} miles`);
      console.log(`   Condition: ${listing.condition || 'N/A'}`);
      console.log(`   Location:  ${listing.location || 'N/A'}`);
      console.log(`   Dealer:    ${listing.dealer_name || 'N/A'}`);
      console.log(`   CPO:       ${listing.is_cpo ? 'Yes' : 'No'}`);
      console.log(`   VIN:       ${listing.vin || 'N/A'}`);
      console.log(`   URL:       ${listing.listing_url || 'N/A'}`);
      console.log(`   Confidence: ${listing.confidence_score || 'N/A'}%`);
      console.log('');
    });
  }
}

function printDiagnostics(result: ValuationResult) {
  printSeparator('DIAGNOSTIC INFORMATION');
  
  // Data quality assessment
  console.log('🔍 Data Quality Assessment:');
  const realListings = result.listings?.filter(l => l.source_type !== 'estimated' && l.source !== 'Market Estimate') || [];
  const syntheticListings = (result.listings?.length || 0) - realListings.length;
  
  console.log(`   Real Market Data:      ${realListings.length} listings`);
  console.log(`   Synthetic/Estimated:   ${syntheticListings} listings`);
  console.log(`   MSRP Source:          ${result.sources?.includes('msrp_db_lookup') ? 'Database' : 'Estimated'}`);
  console.log(`   Market Search Status: ${result.marketSearchStatus}`);
  console.log('');

  // Confidence breakdown simulation
  console.log('📊 Confidence Factors:');
  if (result.confidenceScore <= 40) {
    console.log('   ⚠️  Low confidence - likely using fallback data');
  } else if (result.confidenceScore <= 65) {
    console.log('   🟡 Moderate confidence - limited market data');
  } else if (result.confidenceScore <= 85) {
    console.log('   🟢 Good confidence - adequate market data');
  } else {
    console.log('   ✅ High confidence - excellent data quality');
  }
  
  if (realListings.length === 0) {
    console.log('   ❌ No real market listings found');
  }
  if (!result.sources?.includes('msrp_db_lookup')) {
    console.log('   ⚠️  Using estimated MSRP (database lookup failed)');
  }
  if (result.sources?.includes('exact_vin_match')) {
    console.log('   🎯 Exact VIN match found in market data');
  }
  console.log('');
}

async function main() {
  try {
    const options = parseArguments();
    
    // Print test configuration
    printTestInputs(options);
    
    // Configure verbose logging
    if (options.verbose) {
      console.log('🔊 Verbose logging enabled - showing all debug output\n');
    }
    
    // Start valuation timer
    const startTime = Date.now();
    console.log('🚀 Starting valuation process...\n');
    
    // Build valuation input
    const valuationInput: ValuationInput = {
      vin: options.vin,
      zipCode: options.zipCode,
      mileage: options.mileage!,
      condition: options.condition!,
      userId: options.userId,
      isPremium: options.isPremium,
      forceNew: options.forceNew
    };
    
    // Execute valuation
    const result = await processValuation(valuationInput);
    
    // Calculate execution time
    const executionTime = Date.now() - startTime;
    
    // Print results
    printValuationResult(result);
    
    // Print detailed listings if verbose
    if (options.verbose) {
      printListingDetails(result);
    }
    
    // Print diagnostics
    printDiagnostics(result);
    
    // Print performance summary
    printSeparator('EXECUTION SUMMARY');
    console.log(`✅ Valuation completed successfully`);
    console.log(`⏱️  Execution time: ${executionTime}ms`);
    console.log(`🎯 Final result: $${result.finalValue.toLocaleString()} (${result.confidenceScore}% confidence)`);
    console.log('');
    
    // Exit with success
    process.exit(0);
    
  } catch (error) {
    // Handle and print errors
    printSeparator('ERROR DETAILS');
    console.error('❌ Valuation failed with error:');
    console.error('');
    
    if (error instanceof Error) {
      console.error(`Error Message: ${error.message}`);
      console.error('');
      console.error('Stack Trace:');
      console.error(error.stack);
    } else {
      console.error('Unknown error:', error);
    }
    
    console.error('');
    printSeparator();
    
    // Exit with error code
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Run the CLI
main();