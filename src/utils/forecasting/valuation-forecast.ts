
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
};

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
    highestValue: Math.max(...data.values)
  };
}
