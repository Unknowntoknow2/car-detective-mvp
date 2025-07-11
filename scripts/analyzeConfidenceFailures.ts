// Confidence Failure Analysis Script
import { supabase } from "../src/integrations/supabase/client";

interface ConfidenceFailure {
  vin: string;
  confidence_score: number;
  estimated_value: number;
  created_at: string;
  exact_vin_match: boolean;
  market_listings_count: number;
  sources: string[];
  notes: string;
}

/**
 * Analyze valuations with confidence scores below target thresholds
 */
export async function analyzeConfidenceFailures(threshold: number = 90): Promise<ConfidenceFailure[]> {
  console.log(`🔍 Analyzing valuations with confidence < ${threshold}%...`);

  try {
    // Query recent valuations with low confidence
    const { data: lowConfidenceValuations, error } = await supabase
      .from('valuations')
      .select(`
        id,
        vin,
        confidence_score,
        estimated_value,
        created_at,
        sources,
        market_listings_count,
        value_breakdown
      `)
      .lt('confidence_score', threshold)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('❌ Database query error:', error);
      return [];
    }

    if (!lowConfidenceValuations || lowConfidenceValuations.length === 0) {
      console.log('✅ No low-confidence valuations found in the last 7 days');
      return [];
    }

    console.log(`📊 Found ${lowConfidenceValuations.length} low-confidence valuations`);

    // Analyze each valuation for failure reasons
    const failures: ConfidenceFailure[] = lowConfidenceValuations.map(valuation => {
      const sources = Array.isArray(valuation.sources) ? valuation.sources : [];
      const exactVinMatch = sources.includes('exact_vin_match');
      const marketListingsCount = valuation.market_listings_count || 0;
      
      // Determine likely failure reasons
      const reasons: string[] = [];
      if (!exactVinMatch) reasons.push('No exact VIN match detected');
      if (marketListingsCount < 3) reasons.push(`Only ${marketListingsCount} market listings found`);
      if (!sources.includes('msrp_db_lookup')) reasons.push('Missing MSRP database lookup');
      if (!sources.includes('openai_market_search')) reasons.push('Market search failed');
      if (valuation.confidence_score < 50) reasons.push('Critical confidence failure');

      return {
        vin: valuation.vin || 'Unknown',
        confidence_score: valuation.confidence_score || 0,
        estimated_value: valuation.estimated_value || 0,
        created_at: valuation.created_at,
        exact_vin_match: exactVinMatch,
        market_listings_count: marketListingsCount,
        sources: sources,
        notes: reasons.join('; ')
      };
    });

    return failures;
  } catch (error) {
    console.error('❌ Analysis error:', error);
    return [];
  }
}

/**
 * Get confidence score statistics
 */
export async function getConfidenceStats(): Promise<{
  total: number;
  above90: number;
  above80: number;
  below50: number;
  averageScore: number;
}> {
  try {
    const { data: stats, error } = await supabase
      .from('valuations')
      .select('confidence_score')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

    if (error || !stats) {
      console.error('❌ Stats query error:', error);
      return { total: 0, above90: 0, above80: 0, below50: 0, averageScore: 0 };
    }

    const scores = stats.map(s => s.confidence_score || 0);
    const total = scores.length;
    const above90 = scores.filter(s => s >= 90).length;
    const above80 = scores.filter(s => s >= 80).length;
    const below50 = scores.filter(s => s < 50).length;
    const averageScore = scores.reduce((a, b) => a + b, 0) / total;

    return { total, above90, above80, below50, averageScore };
  } catch (error) {
    console.error('❌ Stats error:', error);
    return { total: 0, above90: 0, above80: 0, below50: 0, averageScore: 0 };
  }
}

/**
 * Generate detailed audit report
 */
export async function generateConfidenceAuditReport(): Promise<string> {
  console.log('📊 Generating confidence audit report...');
  
  const failures = await analyzeConfidenceFailures(90);
  const stats = await getConfidenceStats();
  
  let report = `
🛠️ CONFIDENCE SCORE AUDIT REPORT
Generated: ${new Date().toISOString()}

📈 OVERALL STATISTICS (Last 30 Days)
- Total Valuations: ${stats.total}
- Above 90% Confidence: ${stats.above90} (${((stats.above90/stats.total)*100).toFixed(1)}%)
- Above 80% Confidence: ${stats.above80} (${((stats.above80/stats.total)*100).toFixed(1)}%)
- Below 50% Confidence: ${stats.below50} (${((stats.below50/stats.total)*100).toFixed(1)}%)
- Average Confidence Score: ${stats.averageScore.toFixed(1)}%

🚨 CONFIDENCE FAILURES (Last 7 Days, <90% Confidence)
Total Failures: ${failures.length}

`;

  if (failures.length > 0) {
    report += `TOP FAILURE CASES:\n`;
    failures.slice(0, 10).forEach((failure, i) => {
      report += `
${i + 1}. VIN: ${failure.vin}
   Confidence: ${failure.confidence_score}%
   Value: $${failure.estimated_value?.toLocaleString() || 'N/A'}
   Market Listings: ${failure.market_listings_count}
   Exact VIN Match: ${failure.exact_vin_match ? 'Yes' : 'No'}
   Issues: ${failure.notes}
   Date: ${new Date(failure.created_at).toLocaleString()}
`;
    });

    // Identify common failure patterns
    const noVinMatch = failures.filter(f => !f.exact_vin_match).length;
    const lowListings = failures.filter(f => f.market_listings_count < 3).length;
    const criticalFailures = failures.filter(f => f.confidence_score < 50).length;

    report += `
🔍 FAILURE PATTERN ANALYSIS:
- Missing Exact VIN Match: ${noVinMatch}/${failures.length} (${((noVinMatch/failures.length)*100).toFixed(1)}%)
- Insufficient Listings (<3): ${lowListings}/${failures.length} (${((lowListings/failures.length)*100).toFixed(1)}%)
- Critical Failures (<50%): ${criticalFailures}/${failures.length} (${((criticalFailures/failures.length)*100).toFixed(1)}%)
`;
  } else {
    report += `✅ No significant confidence failures detected in the last 7 days.\n`;
  }

  report += `
💡 RECOMMENDATIONS:
${stats.above90 / stats.total < 0.8 ? '- Improve VIN match detection in market search pipeline' : '✅ VIN matching performance is good'}
${stats.averageScore < 80 ? '- Enhance market listing quality and quantity' : '✅ Average confidence score is acceptable'}
${failures.filter(f => f.market_listings_count < 3).length > failures.length * 0.3 ? '- Improve market data coverage and search algorithms' : '✅ Market listing coverage is good'}
${failures.filter(f => !f.exact_vin_match).length > failures.length * 0.5 ? '- Fix exact VIN match logic in valuation engine' : '✅ VIN matching logic is working'}

TARGET: 80%+ of valuations should achieve 90%+ confidence
CURRENT: ${((stats.above90/stats.total)*100).toFixed(1)}% of valuations achieve 90%+ confidence

`;

  return report;
}

// Main execution function for command line usage
if (require.main === module) {
  (async () => {
    console.log('🚀 Starting confidence failure analysis...');
    
    const report = await generateConfidenceAuditReport();
    console.log(report);
    
    // Also export individual failures for debugging
    const failures = await analyzeConfidenceFailures(90);
    console.log('\n📄 Individual failure details:');
    failures.forEach(failure => {
      console.log(`🚨 VIN: ${failure.vin}, Score: ${failure.confidence_score}% - ${failure.notes}`);
    });
  })();
}