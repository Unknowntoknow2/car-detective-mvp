import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function analyzeFailures() {
  const { data, error } = await supabase
    .from('valuations')
    .select('*')
    .gt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
    .lt('confidence_score', 90); // Filter <90%

  if (error) {
    console.error('❌ Error fetching valuations:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('✅ All recent valuations >= 90% confidence.');
    return;
  }

  console.log(`🔍 Found ${data.length} low-confidence valuations:\n`);

  data.forEach((v: any, i: number) => {
    console.log(`#${i + 1}: VIN ${v.vin}`);
    console.log(`   Value: $${v.estimated_value} | Confidence: ${v.confidence_score}%`);
    console.log(`   Source(s): ${v.sources?.join(', ') || 'None'}`);
    if (!v.sources?.includes('exact_vin_match')) {
      console.log(`   ⚠️  Exact VIN match NOT used.`);
    }
    console.log(`   Created: ${v.created_at}`);
    console.log('---');
  });
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
  
  // For the report, we'll reuse the query logic from analyzeFailures
  const { data: failures, error } = await supabase
    .from('valuations')
    .select('*')
    .gt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .lt('confidence_score', 90);
  
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

analyzeFailures();