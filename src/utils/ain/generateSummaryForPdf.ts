
import { askAIN } from '@/services/ainService';
import { ReportData } from '../pdf/types';

export interface AINSummaryData {
  vehicleOverview: string;
  marketPosition: string;
  priceJustification: string;
  competitorComparison?: string;
  auctionInsights?: string;
  recommendations: string;
}

/**
 * Generate an AI-powered summary for PDF inclusion
 */
export async function generateAINSummaryForPdf(data: ReportData): Promise<AINSummaryData> {
  try {
    // Build context for the AI summary
    const vehicleContext = {
      vin: data.vin,
      make: data.make,
      model: data.model,
      year: data.year,
      mileage: data.mileage,
      condition: data.condition,
      estimatedValue: data.estimatedValue,
      confidenceScore: data.confidenceScore
    };

    // Prepare competitor pricing context
    let competitorContext = '';
    if (data.competitorPrices && data.competitorAverage) {
      const competitorSources = [
        { name: 'Carvana', price: data.competitorPrices.carvana_value },
        { name: 'CarMax', price: data.competitorPrices.carmax_value },
        { name: 'Edmunds', price: data.competitorPrices.edmunds_value },
        { name: 'Carfax', price: data.competitorPrices.carfax_value },
        { name: 'Cars.com', price: data.competitorPrices.carsdotcom_value },
        { name: 'Autotrader', price: data.competitorPrices.autotrader_value },
      ].filter(source => source.price && source.price !== '0');

      const priceDifference = data.estimatedValue - data.competitorAverage;
      const percentDifference = Math.abs((priceDifference / data.competitorAverage) * 100);

      competitorContext = `
        Competitor pricing data from ${competitorSources.length} major platforms:
        ${competitorSources.map(s => `${s.name}: $${parseInt(s.price!).toLocaleString()}`).join(', ')}
        
        Market average: $${data.competitorAverage.toLocaleString()}
        Our valuation is ${Math.abs(priceDifference).toLocaleString()} ${priceDifference > 0 ? 'above' : 'below'} 
        the market average (${percentDifference.toFixed(1)}% difference).
      `;
    }

    // Prepare auction context
    let auctionContext = '';
    if (data.auctionResults && data.auctionResults.length > 0) {
      const recentAuctions = data.auctionResults.slice(0, 3);
      auctionContext = `
        Recent auction data from ${data.auctionResults.length} sales:
        ${recentAuctions.map(auction => 
          `$${parseInt(auction.price).toLocaleString()} (${auction.auction_source}, ${auction.condition_grade || 'condition unknown'})`
        ).join(', ')}
      `;
    }

    const prompt = `
      Create a professional valuation summary for a ${data.year} ${data.make} ${data.model} with ${data.mileage?.toLocaleString()} miles.
      
      Our estimated value: $${data.estimatedValue.toLocaleString()}
      Vehicle condition: ${data.condition}
      Confidence score: ${data.confidenceScore}%
      
      ${competitorContext}
      ${auctionContext}
      
      Please provide a concise, professional summary that:
      1. Justifies the valuation based on vehicle condition and market data
      2. Explains how our price compares to competitor listings
      3. References auction data if available to support the pricing
      4. Provides actionable insights for the vehicle owner
      
      Keep the response under 200 words and professional in tone.
    `;

    const response = await askAIN(prompt, vehicleContext);
    
    if (response.error) {
      console.warn('AIN summary generation failed:', response.error);
      return generateFallbackSummary(data);
    }

    // Parse the AI response into structured data
    return parseAINResponse(response.answer, data);

  } catch (error) {
    console.error('Error generating AIN summary:', error);
    return generateFallbackSummary(data);
  }
}

/**
 * Parse AIN response into structured summary data
 */
function parseAINResponse(aiResponse: string, data: ReportData): AINSummaryData {
  // For now, return the full response as vehicle overview
  // In the future, we could parse specific sections
  return {
    vehicleOverview: aiResponse,
    marketPosition: generateMarketPosition(data),
    priceJustification: generatePriceJustification(data),
    competitorComparison: generateCompetitorComparison(data),
    auctionInsights: generateAuctionInsights(data),
    recommendations: 'Contact our support team for personalized selling or buying recommendations.'
  };
}

/**
 * Generate fallback summary when AI is unavailable
 */
function generateFallbackSummary(data: ReportData): AINSummaryData {
  return {
    vehicleOverview: `This ${data.year} ${data.make} ${data.model} with ${data.mileage?.toLocaleString()} miles has been valued at $${data.estimatedValue.toLocaleString()} based on current market conditions and vehicle condition assessment.`,
    marketPosition: generateMarketPosition(data),
    priceJustification: generatePriceJustification(data),
    competitorComparison: generateCompetitorComparison(data),
    auctionInsights: generateAuctionInsights(data),
    recommendations: 'This valuation reflects current market conditions. Consider market trends and local demand when making decisions.'
  };
}

function generateMarketPosition(data: ReportData): string {
  if (data.competitorAverage && data.estimatedValue) {
    const difference = data.estimatedValue - data.competitorAverage;
    const percent = Math.abs((difference / data.competitorAverage) * 100);
    
    if (Math.abs(difference) < data.competitorAverage * 0.05) {
      return 'This vehicle is priced competitively with the current market average.';
    } else if (difference > 0) {
      return `This vehicle is valued ${percent.toFixed(1)}% above the market average, reflecting premium condition or features.`;
    } else {
      return `This vehicle is valued ${percent.toFixed(1)}% below the market average, representing a potential value opportunity.`;
    }
  }
  return 'Market positioning analysis requires competitor pricing data.';
}

function generatePriceJustification(data: ReportData): string {
  const factors = [];
  
  if (data.condition) {
    factors.push(`${data.condition} condition rating`);
  }
  
  if (data.mileage) {
    const avgMileagePerYear = data.mileage / (new Date().getFullYear() - data.year);
    if (avgMileagePerYear < 12000) {
      factors.push('below-average mileage');
    } else if (avgMileagePerYear > 15000) {
      factors.push('higher mileage consideration');
    }
  }
  
  if (data.confidenceScore && data.confidenceScore > 80) {
    factors.push('high confidence assessment');
  }
  
  return factors.length > 0 
    ? `Valuation based on ${factors.join(', ')}.`
    : 'Valuation based on comprehensive market analysis.';
}

function generateCompetitorComparison(data: ReportData): string | undefined {
  if (!data.competitorPrices || !data.competitorAverage) return undefined;
  
  const sources = [
    { name: 'Carvana', price: data.competitorPrices.carvana_value },
    { name: 'CarMax', price: data.competitorPrices.carmax_value },
    { name: 'Edmunds', price: data.competitorPrices.edmunds_value },
    { name: 'Carfax', price: data.competitorPrices.carfax_value },
    { name: 'Cars.com', price: data.competitorPrices.carsdotcom_value },
    { name: 'Autotrader', price: data.competitorPrices.autotrader_value },
  ].filter(s => s.price && s.price !== '0');
  
  return `Compared against ${sources.length} major platforms with an average of $${data.competitorAverage.toLocaleString()}.`;
}

function generateAuctionInsights(data: ReportData): string | undefined {
  if (!data.auctionResults || data.auctionResults.length === 0) return undefined;
  
  const avgAuctionPrice = data.auctionResults.reduce((sum, auction) => 
    sum + parseInt(auction.price), 0) / data.auctionResults.length;
    
  return `${data.auctionResults.length} recent auction sales averaged $${Math.round(avgAuctionPrice).toLocaleString()}, supporting current market valuation.`;
}

/**
 * Format AIN summary data for PDF inclusion
 */
export function formatAINSummaryForPdf(summaryData: AINSummaryData): string {
  const sections = [];
  
  if (summaryData.vehicleOverview) {
    sections.push(summaryData.vehicleOverview);
  }
  
  if (summaryData.competitorComparison) {
    sections.push(summaryData.competitorComparison);
  }
  
  if (summaryData.auctionInsights) {
    sections.push(summaryData.auctionInsights);
  }
  
  if (summaryData.marketPosition) {
    sections.push(summaryData.marketPosition);
  }
  
  return sections.join(' ');
}
