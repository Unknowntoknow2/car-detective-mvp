
import { supabase } from '@/integrations/supabase/client';

interface MarketFactors {
  auctionTrend: 'rising' | 'falling' | 'stable';
  auctionCount: number;
  marketplaceDaysOnMarket: number;
  marketplaceListingCount: number;
  seasonalIndex: number;
  regionalSaturation: number;
}

interface ForecastResult {
  trend: 'up' | 'down' | 'stable';
  predictedDelta: number;
  confidence: number;
  reasoning: string;
  marketFactors: MarketFactors;
}

export async function generateVinForecast(vin: string): Promise<ForecastResult> {
  try {
    // Get auction data trends
    const { data: auctionData } = await supabase
      .from('auction_results_by_vin')
      .select('price, sold_date')
      .eq('vin', vin)
      .order('sold_date', { ascending: false })
      .limit(10);

    // Get marketplace listings
    const { data: marketplaceData } = await supabase
      .from('scraped_listings')
      .select('price, created_at')
      .eq('vin', vin)
      .order('created_at', { ascending: false })
      .limit(20);

    // Calculate market factors
    const marketFactors = analyzeMarketFactors(auctionData || [], marketplaceData || []);
    
    // Generate prediction using simple ML model
    const forecast = calculateForecast(marketFactors);
    return forecast;

  } catch (error) {
    // Return neutral forecast on error
    return {
      trend: 'stable',
      predictedDelta: 0,
      confidence: 0.3,
      reasoning: 'Insufficient market data for accurate prediction',
      marketFactors: getDefaultMarketFactors()
    };
  }
}

function analyzeMarketFactors(auctionData: any[], marketplaceData: any[]): MarketFactors {
  // Analyze auction price trends
  let auctionTrend: 'rising' | 'falling' | 'stable' = 'stable';
  if (auctionData.length >= 3) {
    const recentPrices = auctionData.slice(0, 3).map(a => parseFloat(a.price) || 0);
    const olderPrices = auctionData.slice(3, 6).map(a => parseFloat(a.price) || 0);
    
    if (recentPrices.length > 0 && olderPrices.length > 0) {
      const recentAvg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
      const olderAvg = olderPrices.reduce((a, b) => a + b, 0) / olderPrices.length;
      
      if (recentAvg > olderAvg * 1.05) auctionTrend = 'rising';
      else if (recentAvg < olderAvg * 0.95) auctionTrend = 'falling';
    }
  }

  // Calculate days on market for marketplace listings
  const daysOnMarket = marketplaceData.length > 0 ? 
    marketplaceData.reduce((sum, listing) => {
      const days = Math.floor((Date.now() - new Date(listing.created_at).getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0) / marketplaceData.length : 30;

  // Get current month for seasonal adjustments
  const currentMonth = new Date().getMonth() + 1;
  const seasonalIndex = getSeasonalIndex(currentMonth);

  return {
    auctionTrend,
    auctionCount: auctionData.length,
    marketplaceDaysOnMarket: Math.round(daysOnMarket),
    marketplaceListingCount: marketplaceData.length,
    seasonalIndex,
    regionalSaturation: Math.min(marketplaceData.length / 5, 1) // 0-1 scale
  };
}

function calculateForecast(factors: MarketFactors): ForecastResult {
  let scoreImpact = 0;
  let confidenceFactors: number[] = [];
  let reasoningParts: string[] = [];

  // Auction trend impact (±15%)
  if (factors.auctionTrend === 'falling') {
    scoreImpact -= 0.12;
    reasoningParts.push('declining auction prices');
    confidenceFactors.push(Math.min(factors.auctionCount / 5, 1));
  } else if (factors.auctionTrend === 'rising') {
    scoreImpact += 0.08;
    reasoningParts.push('strengthening auction market');
    confidenceFactors.push(Math.min(factors.auctionCount / 5, 1));
  }

  // Days on market impact
  if (factors.marketplaceDaysOnMarket > 45) {
    scoreImpact -= 0.08;
    reasoningParts.push('extended time on market');
    confidenceFactors.push(0.7);
  } else if (factors.marketplaceDaysOnMarket < 15) {
    scoreImpact += 0.05;
    reasoningParts.push('quick marketplace turnover');
    confidenceFactors.push(0.6);
  }

  // Regional saturation
  if (factors.regionalSaturation > 0.8) {
    scoreImpact -= 0.06;
    reasoningParts.push('high local inventory');
    confidenceFactors.push(0.8);
  }

  // Seasonal adjustments
  scoreImpact += (factors.seasonalIndex - 1) * 0.05;
  if (factors.seasonalIndex < 0.95) {
    reasoningParts.push('seasonal market softening');
  } else if (factors.seasonalIndex > 1.05) {
    reasoningParts.push('seasonal demand increase');
  }

  // Calculate final prediction
  const baseValue = 25000; // Will be replaced with actual vehicle value
  const predictedDelta = Math.round(baseValue * scoreImpact);
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (Math.abs(predictedDelta) > 200) {
    trend = predictedDelta > 0 ? 'up' : 'down';
  }

  // Calculate confidence based on data availability
  const dataConfidence = Math.min(
    (factors.auctionCount + factors.marketplaceListingCount) / 10,
    1
  );
  const overallConfidence = confidenceFactors.length > 0 
    ? (confidenceFactors.reduce((a, b) => a + b, 0) / confidenceFactors.length) * dataConfidence
    : dataConfidence * 0.5;

  const reasoning = reasoningParts.length > 0 
    ? `Based on ${reasoningParts.join(', ')}`
    : 'Stable market conditions with limited data';

  return {
    trend,
    predictedDelta,
    confidence: Math.max(0.3, Math.min(0.95, overallConfidence)),
    reasoning,
    marketFactors: factors
  };
}

function getSeasonalIndex(month: number): number {
  // Simple seasonal adjustments (spring/summer higher, winter lower)
  const seasonalMap: { [key: number]: number } = {
    1: 0.92, 2: 0.94, 3: 1.02, 4: 1.08, 5: 1.12, 6: 1.15,
    7: 1.18, 8: 1.12, 9: 1.05, 10: 1.02, 11: 0.95, 12: 0.88
  };
  return seasonalMap[month] || 1.0;
}

function getDefaultMarketFactors(): MarketFactors {
  return {
    auctionTrend: 'stable',
    auctionCount: 0,
    marketplaceDaysOnMarket: 30,
    marketplaceListingCount: 0,
    seasonalIndex: 1.0,
    regionalSaturation: 0.5
  };
}
