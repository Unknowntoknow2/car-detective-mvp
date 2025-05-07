
import { useState, useEffect } from 'react';
import { type ValuationData } from '@/hooks/useValuationResult';

// Type for the price range
export type PriceRange = [number, number];

// Type for market trend analysis
export type MarketTrend = 'rising' | 'falling' | 'stable';

// Type for recommendation
export type Recommendation = 'sell' | 'hold' | 'upgrade';

// Calculate price range from a base value and confidence score
export const calculatePriceRange = (
  baseValue: number, 
  confidenceScore: number = 75
): PriceRange => {
  // Higher confidence = tighter range
  const rangeFactor = Math.max(0.05, (100 - confidenceScore) / 100);
  
  const min = Math.round(baseValue * (1 - rangeFactor));
  const max = Math.round(baseValue * (1 + rangeFactor));
  
  return [min, max];
};

// Format currency with locale
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

// Determine confidence level from score
export const getConfidenceLevel = (score: number): string => {
  if (score >= 90) return 'Very High';
  if (score >= 80) return 'High';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Moderate';
  return 'Low';
};

// Determine confidence level color
export const getConfidenceColor = (score: number): string => {
  if (score >= 90) return 'border-green-500 text-green-500';
  if (score >= 80) return 'border-green-400 text-green-400';
  if (score >= 70) return 'border-yellow-500 text-yellow-500';
  if (score >= 60) return 'border-yellow-400 text-yellow-400';
  return 'border-red-500 text-red-500';
};

// Analyze market trend based on adjustments
export const analyzeMarketTrend = (
  adjustments: { factor: string; impact: number }[]
): MarketTrend => {
  const marketFactors = adjustments.filter(adj => 
    adj.factor.toLowerCase().includes('market') || 
    adj.factor.toLowerCase().includes('demand'));
  
  if (!marketFactors.length) return 'stable';
  
  const totalImpact = marketFactors.reduce((sum, factor) => sum + factor.impact, 0);
  
  if (totalImpact > 300) return 'rising';
  if (totalImpact < -300) return 'falling';
  return 'stable';
};

// Get recommendation based on condition, market trend and confidence
export const getRecommendation = (
  condition: string,
  marketTrend: MarketTrend,
  confidenceScore: number
): Recommendation => {
  // Poor condition = upgrade recommendation
  if (condition.toLowerCase() === 'poor' || condition.toLowerCase() === 'fair') {
    return 'upgrade';
  }
  
  // Low confidence = hold recommendation
  if (confidenceScore < 70) {
    return 'hold';
  }
  
  // Market trend based recommendation
  if (marketTrend === 'rising') {
    return 'hold';
  } else if (marketTrend === 'falling') {
    return 'sell';
  }
  
  // Default recommendation
  return 'sell';
};

// Get recommendation explanation
export const getRecommendationExplanation = (
  recommendation: Recommendation,
  marketTrend: MarketTrend,
  condition: string
): string => {
  switch (recommendation) {
    case 'sell':
      return `Based on the current ${marketTrend} market and your vehicle's ${condition.toLowerCase()} condition, now may be a good time to sell.`;
    case 'hold':
      return marketTrend === 'rising' 
        ? `Market values are rising. Holding your vehicle may result in a higher valuation in the coming months.`
        : `Due to current market conditions, holding your vehicle may be the best option for now.`;
    case 'upgrade':
      return `With your vehicle's ${condition.toLowerCase()} condition, investing in improvements could significantly increase its value.`;
    default:
      return 'Our analysis provides a personalized recommendation based on your vehicle details and current market conditions.';
  }
};

// Function to use all these utilities together
export const useValuationLogic = (valuationData: ValuationData | null) => {
  const [priceRange, setPriceRange] = useState<PriceRange>([0, 0]);
  const [marketTrend, setMarketTrend] = useState<MarketTrend>('stable');
  const [recommendation, setRecommendation] = useState<Recommendation>('hold');
  const [recommendationText, setRecommendationText] = useState<string>('');
  
  useEffect(() => {
    if (!valuationData) return;
    
    const estimatedValue = valuationData.estimatedValue;
    const confidenceScore = valuationData.confidenceScore || 75;
    const condition = valuationData.condition || 'Good';
    const adjustments = valuationData.adjustments || [];
    
    // Calculate derived fields
    const range = valuationData.priceRange || calculatePriceRange(estimatedValue, confidenceScore);
    const trend = analyzeMarketTrend(adjustments);
    const rec = getRecommendation(condition, trend, confidenceScore);
    const recText = getRecommendationExplanation(rec, trend, condition);
    
    // Update state
    setPriceRange(range);
    setMarketTrend(trend);
    setRecommendation(rec);
    setRecommendationText(recText);
  }, [valuationData]);
  
  return {
    priceRange,
    marketTrend,
    recommendation,
    recommendationText,
    confidenceLevel: valuationData ? getConfidenceLevel(valuationData.confidenceScore || 75) : '',
    confidenceColor: valuationData ? getConfidenceColor(valuationData.confidenceScore || 75) : '',
  };
};
