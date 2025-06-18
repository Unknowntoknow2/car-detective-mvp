
// Export all the types and functions that components need
export interface ForecastData {
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  timeframe: number;
  delta: number;
}

export interface ForecastResult {
  forecast: Array<{
    month: string;
    value: number;
  }>;
  analysis?: string;
  percentageChange: string;
  bestTimeToSell?: string;
  confidenceScore: number;
  valueTrend: 'up' | 'down' | 'stable';
  lowestValue: number;
  highestValue: number;
}

export function generateForecast(data: any[]): ForecastData {
  // Simple mock forecast logic
  const randomTrend = Math.random();
  let trend: 'up' | 'down' | 'stable';
  
  if (randomTrend > 0.6) {
    trend = 'up';
  } else if (randomTrend < 0.4) {
    trend = 'down';
  } else {
    trend = 'stable';
  }

  return {
    trend,
    confidence: 0.75 + Math.random() * 0.2,
    timeframe: 30,
    delta: (Math.random() - 0.5) * 2000
  };
}

export async function generateValuationForecast(valuationId: string): Promise<ForecastResult> {
  // Mock implementation for now
  const currentValue = 25000; // This would come from the actual valuation
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const forecast = months.map((month, index) => ({
    month,
    value: currentValue + (Math.random() - 0.5) * 2000 + (index * 100)
  }));

  const percentageChange = ((forecast[forecast.length - 1].value - forecast[0].value) / forecast[0].value * 100).toFixed(1);
  
  // Calculate min and max values
  const values = forecast.map(f => f.value);
  const lowestValue = Math.min(...values);
  const highestValue = Math.max(...values);
  
  // Determine trend
  const valueTrend = parseFloat(percentageChange) > 0 ? 'up' : parseFloat(percentageChange) < 0 ? 'down' : 'stable';

  return {
    forecast,
    percentageChange: `${percentageChange}%`,
    bestTimeToSell: 'Spring (March-May)',
    confidenceScore: 0.85,
    analysis: `Market analysis suggests ${percentageChange.includes('-') ? 'depreciation' : 'appreciation'} over the next 12 months.`,
    valueTrend,
    lowestValue,
    highestValue
  };
}
