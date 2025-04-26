
import { useState, useEffect } from 'react';
import { generateValuationForecast, ForecastResult } from '@/utils/forecasting/valuation-forecast';

export function useForecastData(valuationId: string) {
  const [forecastData, setForecastData] = useState<ForecastResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecastData = async () => {
      if (!valuationId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // For demo purposes, simulate API call timing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get forecast data
        const result = await generateValuationForecast(valuationId);
        setForecastData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load forecast data');
        console.error('Forecast data error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecastData();
  }, [valuationId]);

  return { forecastData, isLoading, error };
}
