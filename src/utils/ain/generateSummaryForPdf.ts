
import { ReportData } from '../pdf/types';
import { generateMarketplaceAnalysisText } from '@/services/scrapedListingsService';

export async function generateAINSummaryForPdf(data: ReportData): Promise<string> {
  try {
    const vehicleInfo = `${data.year} ${data.make} ${data.model}`;
    const estimatedValue = data.estimatedValue || 0;
    
    let summary = `AIN™ Analysis for ${vehicleInfo}\n\n`;
    
    // Vehicle condition and valuation context
    summary += `Our AI pricing model estimates this vehicle at $${estimatedValue.toLocaleString()} `;
    summary += `with a ${data.confidenceScore || 75}% confidence score based on `;
    summary += `${data.condition || 'Good'} condition and ${data.mileage || 0} miles.\n\n`;

    // Competitor pricing analysis
    if (data.competitorPrices && data.competitorAverage) {
      const difference = estimatedValue - data.competitorAverage;
      const percentDiff = Math.abs((difference / data.competitorAverage) * 100);
      
      summary += `Competitive Analysis: Compared to national dealers (Carvana, CarMax, Edmunds), `;
      summary += `your valuation is `;
      
      if (Math.abs(difference) > data.competitorAverage * 0.05) {
        summary += `${percentDiff.toFixed(1)}% ${difference > 0 ? 'above' : 'below'} `;
        summary += `the average of $${data.competitorAverage.toLocaleString()}`;
      } else {
        summary += `aligned with the competitive average of $${data.competitorAverage.toLocaleString()}`;
      }
      summary += '.\n\n';
    }

    // Marketplace analysis
    if (data.marketplaceListings && data.marketplaceListings.length > 0) {
      const marketplaceAnalysis = generateMarketplaceAnalysisText(data.marketplaceListings, estimatedValue);
      summary += `Marketplace Analysis: ${marketplaceAnalysis}\n\n`;
    }

    // Auction data analysis
    if (data.auctionResults && data.auctionResults.length > 0) {
      const validAuctions = data.auctionResults.filter((auction: any) => 
        auction.price && !isNaN(parseInt(auction.price))
      );
      
      if (validAuctions.length > 0) {
        const auctionPrices = validAuctions.map((auction: any) => parseInt(auction.price));
        const avgAuctionPrice = Math.round(auctionPrices.reduce((sum: number, price: number) => sum + price, 0) / auctionPrices.length);
        
        summary += `Auction Intelligence: Based on ${validAuctions.length} recent auction records, `;
        summary += `similar vehicles averaged $${avgAuctionPrice.toLocaleString()} at wholesale. `;
        
        const retailMarkup = ((estimatedValue - avgAuctionPrice) / avgAuctionPrice) * 100;
        if (retailMarkup > 0) {
          summary += `This suggests a ${retailMarkup.toFixed(1)}% retail markup, which is `;
          summary += retailMarkup > 25 ? 'above typical' : retailMarkup > 15 ? 'within normal range' : 'conservative';
          summary += ' for retail pricing.\n\n';
        } else {
          summary += 'Your valuation is competitive with wholesale pricing.\n\n';
        }
      }
    }

    // Market recommendations
    summary += 'Market Recommendation: ';
    if (data.competitorAverage && estimatedValue > data.competitorAverage * 1.1) {
      summary += 'Consider negotiating or waiting for market conditions to improve for optimal value.';
    } else if (data.competitorAverage && estimatedValue < data.competitorAverage * 0.9) {
      summary += 'This represents good value in the current market. Act quickly as similar vehicles may be priced higher.';
    } else {
      summary += 'Pricing appears fair and competitive in the current market conditions.';
    }

    return summary;
  } catch (error) {
    console.error('Error generating AIN summary:', error);
    return 'Unable to generate detailed market analysis at this time.';
  }
}

export function formatAINSummaryForPdf(summary: string): string {
  // Format the summary for PDF inclusion
  return summary.replace(/\n\n/g, '\n').trim();
}
