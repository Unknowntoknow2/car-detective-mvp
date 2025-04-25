
import { useState, useEffect } from 'react';
import type { ForecastResult } from '@/utils/forecasting/valuation-forecast';
import { generateValuationForecast } from '@/utils/forecasting/valuation-forecast';

export function useForecast(valuationId: string) {
  const [forecastData, setForecastData] = useState<ForecastResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForecast() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await generateValuationForecast(valuationId);
        setForecastData(data);
      } catch (err) {
        setError('Failed to load forecast data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (valuationId) {
      fetchForecast();
    }
  }, [valuationId]);

  return { forecastData, isLoading, error };
}
