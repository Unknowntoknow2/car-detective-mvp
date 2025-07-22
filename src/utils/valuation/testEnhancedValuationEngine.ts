
import { calculateEnhancedValuation } from '@/services/enhancedValuationEngine';

/**
 * Test the enhanced valuation engine with real VIN
 */
export async function testEnhancedValuationEngine() {
  console.log('🧪 Testing Enhanced Valuation Engine with Ford F-150 VIN');
  
  const testVin = '1FTEW1CP7MKD73632';
  
  try {
    const result = await calculateEnhancedValuation({
      vin: testVin,
      make: 'Ford',
      model: 'F-150',
      year: 2021,
      mileage: 74776,
      condition: 'good',
      zipCode: '90210'
    });
    
    console.log('✅ Enhanced Valuation Test Results:', {
      estimatedValue: result.estimatedValue,
      confidenceScore: result.confidenceScore,
      valuationMethod: result.valuationMethod,
      isUsingFallbackMethod: result.isUsingFallbackMethod,
      marketListingsCount: result.marketListings.length,
      basePriceAnchor: result.basePriceAnchor,
      adjustmentsCount: result.adjustments.length,
      sources: [...new Set(result.marketListings.map(l => l.source))]
    });
    
    // Validate key requirements
    const validationResults = {
      hasEstimatedValue: result.estimatedValue > 0,
      hasConfidenceScore: result.confidenceScore >= 0 && result.confidenceScore <= 100,
      hasMarketListings: result.marketListings.length > 0,
      hasBasePriceAnchor: result.basePriceAnchor.price > 0,
      hasAdjustments: result.adjustments.length >= 0,
      hasCorrectMethod: result.valuationMethod === 'marketListings' || result.valuationMethod === 'fallbackMSRP',
      confidenceBreakdownComplete: result.confidenceBreakdown.overall === result.confidenceScore
    };
    
    console.log('🔍 Validation Results:', validationResults);
    
    const allValid = Object.values(validationResults).every(Boolean);
    console.log(`${allValid ? '✅' : '❌'} Enhanced Valuation Engine Test: ${allValid ? 'PASSED' : 'FAILED'}`);
    
    return { result, validationResults, success: allValid };
    
  } catch (error) {
    console.error('❌ Enhanced Valuation Engine Test Failed:', error);
    return { result: null, validationResults: null, success: false, error };
  }
}

/**
 * Test the market search agent specifically
 */
export async function testMarketSearchAgent() {
  console.log('🧪 Testing Market Search Agent');
  
  const { searchMarketListings } = await import('@/services/valuation/marketSearchAgent');
  
  try {
    const listings = await searchMarketListings({
      vin: '1FTEW1CP7MKD73632',
      make: 'Ford',
      model: 'F-150',
      year: 2021,
      zipCode: '90210'
    });
    
    console.log('✅ Market Search Agent Results:', {
      totalListings: listings.length,
      exactVinMatches: listings.filter(l => l.vin === '1FTEW1CP7MKD73632').length,
      sources: [...new Set(listings.map(l => l.source))],
      priceRange: listings.length > 0 ? {
        min: Math.min(...listings.map(l => l.price)),
        max: Math.max(...listings.map(l => l.price)),
        median: listings.map(l => l.price).sort((a, b) => a - b)[Math.floor(listings.length / 2)]
      } : null
    });
    
    return { listings, success: true };
    
  } catch (error) {
    console.error('❌ Market Search Agent Test Failed:', error);
    return { listings: [], success: false, error };
  }
}
