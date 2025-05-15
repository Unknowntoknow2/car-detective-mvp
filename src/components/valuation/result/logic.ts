
import { useMemo } from 'react';

export const useValuationLogic = (valuationData: any) => {
  // Derive market trend from data or provide default
  const marketTrend = useMemo(() => {
    if (!valuationData) return 'stable';
    
    // Logic to determine market trend based on valuation data
    const trendValue = valuationData.marketTrend || valuationData.trend;
    
    if (trendValue) {
      return trendValue;
    }
    
    // Default to 'stable' if no trend data is available
    return 'stable';
  }, [valuationData]);
  
  // Calculate price range
  const priceRange = useMemo(() => {
    if (!valuationData || !valuationData.estimatedValue) {
      return { low: 0, high: 0 };
    }
    
    const value = valuationData.estimatedValue;
    
    if (valuationData.priceRange) {
      return valuationData.priceRange;
    }
    
    // Default calculation: ±5% of estimated value
    return {
      low: Math.round(value * 0.95),
      high: Math.round(value * 1.05)
    };
  }, [valuationData]);
  
  // Calculate recommendation type
  const recommendation = useMemo(() => {
    if (!valuationData) return 'hold';
    
    if (valuationData.recommendation) {
      return valuationData.recommendation;
    }
    
    // Logic to determine recommendation based on market trend
    if (marketTrend === 'rising' || marketTrend === 'up') {
      return 'sell';
    } else if (marketTrend === 'falling' || marketTrend === 'down') {
      return 'buy';
    } else {
      return 'hold';
    }
  }, [valuationData, marketTrend]);
  
  // Generate recommendation text
  const recommendationText = useMemo(() => {
    if (recommendation === 'sell') {
      return "Good time to sell. Market is trending upward.";
    } else if (recommendation === 'buy') {
      return "Good time to buy. Market is trending downward.";
    } else {
      return "Market is stable. Hold if already owned.";
    }
  }, [recommendation]);
  
  // Calculate confidence level and color
  const confidenceLevel = useMemo(() => {
    if (!valuationData) return 'medium';
    
    const score = valuationData.confidenceScore || 75;
    
    if (score >= 85) return 'high';
    if (score >= 70) return 'medium';
    return 'low';
  }, [valuationData]);
  
  const confidenceColor = useMemo(() => {
    switch (confidenceLevel) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-red-600';
      default: return 'text-amber-600';
    }
  }, [confidenceLevel]);
  
  return {
    priceRange,
    marketTrend,
    recommendation,
    recommendationText,
    confidenceLevel,
    confidenceColor
  };
};
