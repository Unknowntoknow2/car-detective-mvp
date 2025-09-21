
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
  throw new Error('This mock forecast function is deprecated. Use the real valuation-forecast Edge Function instead.');
}
