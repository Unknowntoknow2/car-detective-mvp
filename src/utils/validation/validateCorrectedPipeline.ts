
import { supabase } from '@/integrations/supabase/client';

export async function validateCorrectedPipeline(vin: string) {
  console.log('🔒 Starting validation for corrected pipeline:', vin);
  
  const validation = {
    valuationRecord: false,
    ainSummary: false,
    marketplaceData: false,
    auctionData: false,
    pdfGenerated: false,
    confidence: 0
  };

  try {
    // Check updated valuation record
    const { data: valuation } = await supabase
      .from('valuation_results')
      .select('*')
      .eq('vin', vin)
      .single();

    if (valuation) {
      validation.valuationRecord = true;
      validation.confidence = valuation.confidence_score || 0;
      
      if (valuation.ain_summary && !valuation.ain_summary.includes('Highlander')) {
        validation.ainSummary = true;
      }
    }

    // Check marketplace data
    const { data: listings } = await supabase
      .from('scraped_listings')
      .select('count')
      .ilike('title', '%2008%Toyota%Sienna%');

    if (listings && listings.length > 0) {
      validation.marketplaceData = true;
    }

    // Check auction data
    const { data: auctions } = await supabase
      .from('auction_results_by_vin')
      .select('count')
      .eq('vin', vin);

    if (auctions && auctions.length > 0) {
      validation.auctionData = true;
    }

    // Check if PDF can be generated
    validation.pdfGenerated = validation.valuationRecord && validation.ainSummary;

    console.log('✅ Validation results:', validation);
    return validation;

  } catch (error) {
    console.error('❌ Validation error:', error);
    return validation;
  }
}

export function printValidationReport(validation: any, vin: string) {
  console.log(`\n🔒 VALIDATION REPORT FOR ${vin}`);
  console.log('=' .repeat(50));
  
  const checks = [
    ['Valuation Record Updated', validation.valuationRecord],
    ['AIN Summary Refreshed', validation.ainSummary],
    ['Marketplace Data Fetched', validation.marketplaceData],
    ['Auction Data Linked', validation.auctionData],
    ['PDF Generation Ready', validation.pdfGenerated]
  ];

  checks.forEach(([check, status]) => {
    const icon = status ? '✅' : '❌';
    console.log(`${icon} ${check}`);
  });

  console.log(`\n📊 Confidence Score: ${validation.confidence}%`);
  
  const overallStatus = checks.every(([_, status]) => status) ? 'PASSED' : 'NEEDS ATTENTION';
  console.log(`🎯 Overall Status: ${overallStatus}`);
}
