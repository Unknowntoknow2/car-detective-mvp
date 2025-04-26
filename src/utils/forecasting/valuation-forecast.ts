
import { linearRegression } from 'simple-statistics';
import { supabase } from '@/integrations/supabase/client';

export type ForecastPoint = {
  month: string;
  value: number;
};

export type ForecastResult = {
  forecast: ForecastPoint[];
  percentageChange: number;
  bestTimeToSell: string;
  valueTrend: 'increasing' | 'decreasing' | 'stable';
  confidenceScore: number;
  lowestValue: number;
  highestValue: number;
  months: string[];  // Added missing property
  values: number[];  // Added missing property
  trend: 'increasing' | 'decreasing' | 'stable';  // Added missing property
};

function runLinearForecast(prices: number[], months: string[]) {
  const x = prices.map((_, i) => i);
  const y = prices;

  // Fit linear model y = m*x + b
  const { m, b } = linearRegression(x.map((xi, i) => [xi, y[i]]));

  // Build forecast for next 12 months
  const lastDate = new Date(months[months.length - 1]);
  const forecastMonths: string[] = [];
  const forecastValues: number[] = [];

  for (let i = 1; i <= 12; i++) {
    const d = new Date(lastDate);
    d.setMonth(d.getMonth() + i);
    forecastMonths.push(d.toLocaleString('default', { month: 'short', year: 'numeric' }));
    forecastValues.push(Math.round(m * (x.length + i - 1) + b));
  }

  return { months: forecastMonths, values: forecastValues };
}

export async function generateValuationForecast(
  valuationId: string
): Promise<ForecastResult> {
  const { data, error } = await supabase.functions.invoke('valuation-forecast', {
    body: { valuationId }
  });

  if (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }

  const forecast: ForecastPoint[] = data.months.map((month: string, index: number) => ({
    month,
    value: data.values[index]
  }));

  return {
    forecast,
    percentageChange: parseFloat(data.percentageChange),
    bestTimeToSell: data.bestTimeToSell,
    valueTrend: data.trend,
    confidenceScore: data.confidenceScore,
    lowestValue: Math.min(...data.values),
    highestValue: Math.max(...data.values),
    months: data.months,  // Added to match the return type
    values: data.values,  // Added to match the return type
    trend: data.trend     // Added to match the return type
  };
}
