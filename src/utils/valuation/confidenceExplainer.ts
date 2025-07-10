// Confidence Score Explanation Generator

export interface ConfidenceExplanation {
  score: number;
  level: 'High' | 'Medium' | 'Low';
  reasons: string[];
  suggestions: string[];
  canRetry: boolean;
}

/**
 * Generate detailed explanation for confidence score
 */
export function explainConfidenceScore(
  score: number,
  marketListings: number,
  hasVin: boolean,
  hasExactMatch: boolean,
  dataQuality: {
    hasMileage?: boolean;
    hasCondition?: boolean;
    hasTrim?: boolean;
    hasFeatures?: boolean;
  }
): ConfidenceExplanation {
  const reasons: string[] = [];
  const suggestions: string[] = [];
  
  // Market data quality
  if (marketListings === 0) {
    reasons.push('No market listings found for comparison');
    suggestions.push('Try searching in a wider geographic area');
    suggestions.push('Check back later as new listings become available');
  } else if (marketListings < 3) {
    reasons.push(`Limited market data (${marketListings} listing${marketListings > 1 ? 's' : ''} found)`);
    suggestions.push('More comparable listings would improve accuracy');
  } else if (marketListings >= 5) {
    reasons.push(`Good market data available (${marketListings} comparable listings)`);
  }
  
  // VIN availability
  if (hasVin) {
    if (hasExactMatch) {
      reasons.push('Exact VIN match found in market listings');
    } else {
      reasons.push('VIN provided for detailed analysis');
    }
  } else {
    reasons.push('No VIN provided - estimates based on general vehicle data');
    suggestions.push('Provide VIN for more accurate valuation');
  }
  
  // Data completeness
  if (!dataQuality.hasMileage) {
    reasons.push('Mileage information missing');
    suggestions.push('Provide current mileage for better accuracy');
  }
  
  if (!dataQuality.hasCondition) {
    reasons.push('Vehicle condition not specified');
    suggestions.push('Specify vehicle condition (excellent, good, fair, poor)');
  }
  
  if (!dataQuality.hasTrim) {
    reasons.push('Trim level not specified');
    suggestions.push('Provide specific trim level for package value adjustments');
  }
  
  // Determine confidence level and suggestions
  let level: 'High' | 'Medium' | 'Low';
  let canRetry = false;
  
  if (score >= 80) {
    level = 'High';
    if (marketListings >= 3 && hasVin) {
      reasons.push('High-quality data with good market coverage');
    }
  } else if (score >= 60) {
    level = 'Medium';
    canRetry = marketListings < 3;
    if (canRetry) {
      suggestions.push('Retry search to find more market listings');
    }
  } else {
    level = 'Low';
    canRetry = true;
    reasons.push('Limited data quality affects accuracy');
    suggestions.push('Retry search for updated market data');
    suggestions.push('Consider professional appraisal for high-value transactions');
  }
  
  return {
    score,
    level,
    reasons,
    suggestions,
    canRetry
  };
}

/**
 * Generate user-friendly confidence explanation text
 */
export function getConfidenceText(explanation: ConfidenceExplanation): string {
  const levelEmoji = {
    'High': '✅',
    'Medium': '⚠️',
    'Low': '❌'
  };
  
  return `${levelEmoji[explanation.level]} ${explanation.level} Confidence (${explanation.score}%)`;
}