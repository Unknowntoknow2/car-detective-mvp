// Quick validation script for marketSearchAgent normalization
import { fetchMarketComps } from '@/agents/marketSearchAgent';
import { MarketListing } from '@/types/marketListing';

/**
 * Simple test to validate marketSearchAgent output matches unified MarketListing type
 */
export const validateMarketSearchOutput = async () => {
  console.log('🎯 Validating Market Search Agent Output...');
  
  try {
    // Test with a realistic vehicle search
    const testInput = {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      zipCode: '90210'
    };
    
    const result = await fetchMarketComps(testInput);
    
    // Validate the result structure
    const isValidResult = (
      Array.isArray(result.listings) &&
      typeof result.confidence === 'number' &&
      typeof result.trust === 'number' &&
      Array.isArray(result.notes) &&
      typeof result.source === 'string'
    );
    
    // Validate each listing matches MarketListing interface
    const validListings = result.listings.every((listing: MarketListing) => {
      return (
        typeof listing.price === 'number' &&
        listing.price > 0 &&
        typeof listing.source === 'string' &&
        listing.source.length > 0
      );
    });
    
    console.log('✅ Market Search Agent Validation Results:', {
      isValidResult,
      validListings,
      listingsCount: result.listings.length,
      confidence: result.confidence,
      trust: result.trust,
      source: result.source
    });
    
    if (isValidResult && validListings) {
      console.log('🎯 Market Search Agent successfully normalized to canonical MarketListing format!');
      return true;
    } else {
      console.log('❌ Market Search Agent output validation failed');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Market Search Agent validation error:', error);
    return false;
  }
};

// Type assertion to ensure our validation works
type ValidationFunction = () => Promise<boolean>;
export const runValidation: ValidationFunction = validateMarketSearchOutput;