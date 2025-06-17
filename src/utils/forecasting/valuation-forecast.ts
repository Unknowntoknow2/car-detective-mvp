
// Mock implementation without simple-statistics dependency
export interface ForecastData {
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  timeframe: number;
  delta: number;
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
