
import { supabase } from '@/integrations/supabase/client';
import { generateVinForecast } from '@/utils/forecasting/generateVinForecast';

export interface VinForecast {
  id: string;
  vin: string;
  forecast_trend: 'up' | 'down' | 'stable';
  predicted_delta: number;
  timeframe_days: number;
  confidence: number;
  reasoning: string;
  market_factors: any;
  created_at: string;
  expires_at: string;
}

export async function getOrCreateVinForecast(vin: string): Promise<VinForecast | null> {
  try {
    // First check if we have a recent forecast
    const { data: existingForecast } = await supabase
      .from('vin_forecasts')
      .select('*')
      .eq('vin', vin)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingForecast) {
      return existingForecast;
    }

    // Generate new forecast
    const forecastData = await generateVinForecast(vin);

    // Store in database
    const { data: newForecast, error } = await supabase
      .from('vin_forecasts')
      .insert({
        vin,
        forecast_trend: forecastData.trend,
        predicted_delta: forecastData.predictedDelta,
        timeframe_days: 60,
        confidence: forecastData.confidence,
        reasoning: forecastData.reasoning,
        market_factors: forecastData.marketFactors
      })
      .select()
      .single();

    if (error) {
      return null;
    }
    return newForecast;

  } catch (error) {
    return null;
  }
}

export function formatForecastText(forecast: VinForecast): string {
  const { forecast_trend, predicted_delta, timeframe_days, confidence } = forecast;
  
  const direction = forecast_trend === 'up' ? 'gain' : forecast_trend === 'down' ? 'lose' : 'remain stable';
  const amount = Math.abs(predicted_delta);
  const confidencePercent = Math.round(confidence * 100);
  
  if (forecast_trend === 'stable') {
    return `Expected to remain stable over the next ${timeframe_days} days (${confidencePercent}% confidence)`;
  }
  
  return `May ${direction} $${amount.toLocaleString()} over the next ${timeframe_days} days (${confidencePercent}% confidence)`;
}
