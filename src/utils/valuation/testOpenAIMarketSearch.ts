/**
 * Test OpenAI-powered market listings search validation
 * This validates Prompt 2.2 requirements for live web search
 */

import { searchMarketListings } from '@/services/valuation/marketSearchAgent';
import { supabase } from '@/integrations/supabase/client';

interface TestResults {
  success: boolean;
  testCase: string;
  listingsFound: number;
  sources: string[];
  confidenceScore: number;
  hasRealPrices: boolean;
  hasRealLinks: boolean;
  openAIUsed: boolean;
  details: any;
}

export async function testOpenAIMarketSearch(): Promise<TestResults[]> {
  console.log('🧪 Starting OpenAI Market Search Validation (Prompt 2.2)');
  
  const testCases = [
    {
      name: 'Ford F-150 XLT 2021 Test Case',
      input: {
        vin: '1FTEW1CP7MKD73632',
        make: 'Ford',
        model: 'F-150',
        year: 2021,
        trim: 'XLT',
        zipCode: '95821',
        mileage: 84000
      },
      expectedMinListings: 2,
      expectedMinConfidence: 70
    },
    {
      name: 'Direct OpenAI Function Test',
      input: {
        make: 'Ford',
        model: 'F-150',
        year: 2021,
        trim: 'XLT',
        zip: '95821',
        mileage: 84000
      },
      expectedMinListings: 3,
      expectedMinConfidence: 75
    }
  ];

  const results: TestResults[] = [];

  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.name}`);
    
    try {
      let listings: any[] = [];
      let openAIUsed = false;
      let rawResponse = null;

      if (testCase.name.includes('Direct OpenAI')) {
        // Test the OpenAI function directly
        console.log('📞 Calling OpenAI Market Search function directly...');
        
        const { data, error } = await supabase.functions.invoke(
          'openai-market-search',
          {
            body: testCase.input
          }
        );

        if (!error && data?.success) {
          listings = data.data || [];
          openAIUsed = true;
          rawResponse = data.meta?.openAIRawResponse;
          
          console.log('🎯 Direct OpenAI Results:', {
            success: data.success,
            listingsCount: listings.length,
            sources: data.meta?.sources || [],
            confidence: data.meta?.confidence || 0
          });
          
          console.log('📄 OpenAI Raw Response Preview:', 
            rawResponse ? rawResponse.substring(0, 500) + '...' : 'Not available'
          );
        } else {
          console.error('❌ Direct OpenAI test failed:', error);
        }
      } else {
        // Test via the market search agent
        console.log('📞 Calling Market Search Agent...');
        listings = await searchMarketListings(testCase.input);
        
        // Check if OpenAI was used by looking for live sourceType
        openAIUsed = listings.some(l => l.sourceType === 'live');
      }

      // Validate results
      const hasRealPrices = listings.every(l => 
        l.price && 
        l.price > 1000 && 
        l.price < 200000
      );

      const hasRealLinks = listings.some(l => 
        l.link && 
        (l.link.includes('http') || l.link.includes('www'))
      );

      const sources = [...new Set(listings.map(l => l.source).filter(Boolean))];
      
      const avgConfidence = listings.length > 0 
        ? listings.reduce((sum, l) => sum + (l.confidenceScore || 0), 0) / listings.length
        : 0;

      const result: TestResults = {
        success: listings.length >= testCase.expectedMinListings && avgConfidence >= testCase.expectedMinConfidence,
        testCase: testCase.name,
        listingsFound: listings.length,
        sources,
        confidenceScore: Math.round(avgConfidence),
        hasRealPrices,
        hasRealLinks,
        openAIUsed,
        details: {
          expectedMinListings: testCase.expectedMinListings,
          expectedMinConfidence: testCase.expectedMinConfidence,
          listings: listings.map(l => ({
            price: l.price,
            source: l.source,
            link: l.link ? 'Available' : 'Missing',
            confidence: l.confidenceScore,
            sourceType: l.sourceType
          })),
          rawResponseAvailable: !!rawResponse
        }
      };

      results.push(result);

      // Log detailed results
      console.log(`✅ Test Results for ${testCase.name}:`);
      console.log(`   Listings Found: ${listings.length} (expected: ${testCase.expectedMinListings}+)`);
      console.log(`   Confidence Score: ${Math.round(avgConfidence)}% (expected: ${testCase.expectedMinConfidence}%+)`);
      console.log(`   Sources: ${sources.join(', ')}`);
      console.log(`   Real Prices: ${hasRealPrices ? 'YES' : 'NO'}`);
      console.log(`   Real Links: ${hasRealLinks ? 'YES' : 'NO'}`);
      console.log(`   OpenAI Used: ${openAIUsed ? 'YES' : 'NO'}`);
      console.log(`   Test Success: ${result.success ? 'PASS' : 'FAIL'}`);

      if (listings.length > 0) {
        console.log(`   Sample Listing:`, {
          price: listings[0].price,
          source: listings[0].source,
          link: listings[0].link ? 'Available' : 'Not provided',
          location: listings[0].location
        });
      }

    } catch (error) {
      console.error(`❌ Test failed for ${testCase.name}:`, error);
      
      results.push({
        success: false,
        testCase: testCase.name,
        listingsFound: 0,
        sources: [],
        confidenceScore: 0,
        hasRealPrices: false,
        hasRealLinks: false,
        openAIUsed: false,
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    }
  }

  // Summary
  console.log('\n📊 OpenAI Market Search Validation Summary:');
  console.log('=' .repeat(50));
  
  const passedTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  
  console.log(`✅ Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`🔍 Total Listings Found: ${results.reduce((sum, r) => sum + r.listingsFound, 0)}`);
  console.log(`🌐 OpenAI Used: ${results.some(r => r.openAIUsed) ? 'YES' : 'NO'}`);
  console.log(`📈 Avg Confidence: ${Math.round(results.reduce((sum, r) => sum + r.confidenceScore, 0) / results.length)}%`);
  
  const allSources = [...new Set(results.flatMap(r => r.sources))];
  console.log(`📋 Sources Found: ${allSources.join(', ')}`);

  // Validation criteria check
  console.log('\n🎯 Prompt 2.2 Validation Criteria:');
  console.log(`✅ At least 2-3 real listings: ${results.some(r => r.listingsFound >= 2) ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Realistic prices and links: ${results.some(r => r.hasRealPrices && r.hasRealLinks) ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Confidence ≥70%: ${results.some(r => r.confidenceScore >= 70) ? 'PASS' : 'FAIL'}`);
  console.log(`✅ OpenAI integration working: ${results.some(r => r.openAIUsed) ? 'PASS' : 'FAIL'}`);

  return results;
}

// Export for debugging individual components
export async function testDirectOpenAIFunction(params: any) {
  const { data, error } = await supabase.functions.invoke('openai-market-search', { body: params });
  return { data, error };
}