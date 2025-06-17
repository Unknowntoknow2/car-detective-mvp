
import { ReportData } from '@/utils/pdf/types';

export function generateSummaryForPdf(reportData: ReportData): string {
  const vehicle = `${reportData.year} ${reportData.make} ${reportData.model}`;
  const value = reportData.estimatedValue;
  const confidence = reportData.confidenceScore;
  
  let summary = `This ${vehicle} has been valued at $${value.toLocaleString()} with ${confidence}% confidence based on current market conditions.`;

  // Competitor pricing analysis
  if (reportData.competitorPrices && reportData.competitorPrices.length > 0 && reportData.competitorAverage) {
    const difference = value - reportData.competitorAverage;
    const percentDiff = ((difference / reportData.competitorAverage) * 100).toFixed(1);
    
    if (difference > 0) {
      summary += ` Our valuation is ${Math.abs(parseFloat(percentDiff))}% higher than competitor averages of $${reportData.competitorAverage.toLocaleString()}.`;
    } else if (difference < 0) {
      summary += ` Our valuation is ${Math.abs(parseFloat(percentDiff))}% lower than competitor averages of $${reportData.competitorAverage.toLocaleString()}.`;
    } else {
      summary += ` Our valuation aligns closely with competitor averages of $${reportData.competitorAverage.toLocaleString()}.`;
    }
  }

  // Marketplace listings analysis
  if (reportData.marketplaceListings && reportData.marketplaceListings.length > 0) {
    const avgMarketPrice = reportData.marketplaceListings.reduce((sum: number, listing: any) => sum + listing.price, 0) / reportData.marketplaceListings.length;
    const marketDiff = value - avgMarketPrice;
    const marketPercentDiff = ((marketDiff / avgMarketPrice) * 100).toFixed(1);
    
    summary += ` Based on ${reportData.marketplaceListings.length} similar marketplace listings with an average price of $${avgMarketPrice.toLocaleString()}, `;
    
    if (marketDiff > 0) {
      summary += `our valuation is ${Math.abs(parseFloat(marketPercentDiff))}% above market average.`;
    } else {
      summary += `our valuation is ${Math.abs(parseFloat(marketPercentDiff))}% below market average.`;
    }
  }

  // Auction results analysis
  if (reportData.auctionResults && reportData.auctionResults.length > 0) {
    const auctionCount = reportData.auctionResults.length;
    summary += ` Our analysis includes ${auctionCount} recent auction sale${auctionCount > 1 ? 's' : ''} for similar vehicles.`;
  }

  // Market conditions
  summary += ` Market conditions and vehicle-specific factors have been analyzed to provide the most accurate valuation possible.`;

  // Key adjustments
  if (reportData.adjustments && reportData.adjustments.length > 0) {
    const positiveAdj = reportData.adjustments.filter(adj => adj.impact > 0);
    const negativeAdj = reportData.adjustments.filter(adj => adj.impact < 0);
    
    if (positiveAdj.length > 0) {
      summary += ` Positive factors include: ${positiveAdj.map(adj => adj.factor.toLowerCase()).join(', ')}.`;
    }
    
    if (negativeAdj.length > 0) {
      summary += ` Areas for consideration include: ${negativeAdj.map(adj => adj.factor.toLowerCase()).join(', ')}.`;
    }
  }

  // Competitive analysis conclusion
  if (reportData.competitorAverage && reportData.competitorAverage > 0) {
    const isAboveCompetitors = value > reportData.competitorAverage;
    
    if (isAboveCompetitors) {
      summary += ` This vehicle shows strong value retention compared to industry standards.`;
    } else {
      summary += ` This valuation reflects current market pricing trends and competitive positioning.`;
    }
  }

  return summary;
}
