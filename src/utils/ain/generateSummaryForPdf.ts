
import { ReportData } from '../pdf/types';

export interface AINSummaryData {
  summary: string;
  keyInsights: string[];
  riskFactors: string[];
  marketPosition: string;
  auctionAnalysis?: string;
  valueDrivers?: string[];
}

export async function generateAINSummaryForPdf(reportData: ReportData): Promise<AINSummaryData> {
  try {
    console.log('🧠 Generating enhanced AIN summary for PDF');
    const prompt = createEnhancedAINPrompt(reportData);
    
    const response = await fetch('/api/openai/generate-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        vehicleData: {
          year: reportData.year,
          make: reportData.make,
          model: reportData.model,
          vin: reportData.vin,
          mileage: reportData.mileage,
          condition: reportData.condition,
          estimatedValue: reportData.estimatedValue,
          confidenceScore: reportData.confidenceScore,
          auctionResults: reportData.auctionResults || [],
          adjustments: reportData.adjustments || []
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate AIN summary');
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error('❌ Error generating AIN summary:', error);
    return generateFallbackSummary(reportData);
  }
}

function createEnhancedAINPrompt(reportData: ReportData): string {
  const auctionData = reportData.auctionResults || [];
  const auctionInfo = auctionData.length > 0 
    ? `Auction History: Found ${auctionData.length} auction records with average price of $${calculateAverageAuctionPrice(auctionData)}`
    : 'No auction history available';

  return `
As AIN (Automotive Intelligence Network), analyze this comprehensive vehicle valuation data and provide a professional summary for dealers and consumers:

VEHICLE DETAILS:
- Vehicle: ${reportData.year} ${reportData.make} ${reportData.model}
- VIN: ${reportData.vin || 'Not provided'}
- Mileage: ${reportData.mileage?.toLocaleString() || 'Unknown'} miles
- Condition: ${reportData.condition}
- ZIP Code: ${reportData.zipCode || 'Not specified'}

VALUATION RESULTS:
- Estimated Value: $${reportData.estimatedValue?.toLocaleString() || 'TBD'}
- Confidence Score: ${reportData.confidenceScore || 'N/A'}%
- Price Range: $${reportData.priceRange?.[0]?.toLocaleString() || 'TBD'} - $${reportData.priceRange?.[1]?.toLocaleString() || 'TBD'}

MARKET DATA:
- ${auctionInfo}
- Condition Impact: ${reportData.aiCondition?.summary || 'Standard condition assessment'}

ADJUSTMENTS APPLIED:
${(reportData.adjustments || []).map(adj => `- ${adj.factor}: ${adj.impact > 0 ? '+' : ''}$${adj.impact} (${adj.description || 'Market adjustment'})`).join('\n')}

Please provide a comprehensive analysis with:
1. Executive Summary (2-3 sentences about the vehicle's market position)
2. Key Value Drivers (3-4 factors that positively impact value)
3. Risk Factors (2-3 concerns or negative factors)
4. Market Position Assessment (competitive positioning)
5. Auction Analysis (if auction data available)

Keep the tone professional, data-driven, and actionable for both dealers and consumers. Focus on transparency and market intelligence.
  `.trim();
}

function calculateAverageAuctionPrice(auctionResults: any[]): string {
  if (!auctionResults || auctionResults.length === 0) return '0';
  
  const prices = auctionResults
    .map(result => parseInt(result.price) || 0)
    .filter(price => price > 0);
  
  if (prices.length === 0) return '0';
  
  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  return average.toLocaleString();
}

function generateFallbackSummary(reportData: ReportData): AINSummaryData {
  const avgAuctionPrice = calculateAverageAuctionPrice(reportData.auctionResults || []);
  
  return {
    summary: `This ${reportData.year} ${reportData.make} ${reportData.model} is valued at $${reportData.estimatedValue?.toLocaleString()} based on comprehensive market analysis including mileage, condition, and regional demand factors.`,
    keyInsights: [
      `Vehicle mileage of ${reportData.mileage?.toLocaleString()} miles is ${getMileageAssessment(reportData.mileage, reportData.year)}`,
      `Current condition (${reportData.condition}) aligns with market expectations for this year/model`,
      `Market confidence score of ${reportData.confidenceScore}% indicates ${getConfidenceAssessment(reportData.confidenceScore)}`,
      reportData.auctionResults?.length ? `${reportData.auctionResults.length} auction records support pricing with average of $${avgAuctionPrice}` : 'Limited auction data available for comparison'
    ],
    riskFactors: [
      reportData.mileage && reportData.mileage > 100000 ? 'High mileage may impact resale value' : 'Mileage within acceptable range',
      reportData.confidenceScore && reportData.confidenceScore < 80 ? 'Lower confidence due to limited market data' : 'Market data supports valuation confidence'
    ],
    marketPosition: `Competitively positioned in the ${reportData.condition.toLowerCase()} condition market segment`,
    auctionAnalysis: reportData.auctionResults?.length 
      ? `Analysis of ${reportData.auctionResults.length} auction records shows market alignment with estimated value`
      : 'No auction data available for direct comparison',
    valueDrivers: [
      'Current market demand for this make/model',
      'Regional pricing factors',
      'Condition assessment and documentation',
      'Comprehensive market data analysis'
    ]
  };
}

function getMileageAssessment(mileage?: number, year?: number): string {
  if (!mileage || !year) return 'within typical range';
  
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - year;
  const averageMilesPerYear = 12000;
  const expectedMileage = vehicleAge * averageMilesPerYear;
  
  if (mileage < expectedMileage * 0.8) return 'below average (positive)';
  if (mileage > expectedMileage * 1.3) return 'above average (concern)';
  return 'within typical range';
}

function getConfidenceAssessment(score?: number): string {
  if (!score) return 'moderate data availability';
  if (score >= 90) return 'high data confidence';
  if (score >= 80) return 'good data confidence';
  if (score >= 70) return 'moderate data confidence';
  return 'limited data availability';
}

export function formatAINSummaryForPdf(summary: AINSummaryData): string {
  return `
MARKET INTELLIGENCE SUMMARY

Executive Summary:
${summary.summary}

Key Value Drivers:
${summary.keyInsights.map(insight => `• ${insight}`).join('\n')}

Risk Assessment:
${summary.riskFactors.map(risk => `• ${risk}`).join('\n')}

Market Position: 
${summary.marketPosition}

${summary.auctionAnalysis ? `
Auction Analysis:
${summary.auctionAnalysis}
` : ''}

${summary.valueDrivers ? `
Primary Value Drivers:
${summary.valueDrivers.map(driver => `• ${driver}`).join('\n')}
` : ''}

Analysis powered by AIN (Automotive Intelligence Network)
  `.trim();
}
