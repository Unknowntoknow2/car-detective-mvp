
import { useState, useEffect } from 'react';
import { generateValuationForecast, ForecastResult } from '@/utils/forecasting/valuation-forecast';
import { toast } from 'sonner';

export function useForecastData(valuationId: string) {
  const [forecastData, setForecastData] = useState<ForecastResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForecastData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const forecast = await generateValuationForecast(valuationId);
      setForecastData(forecast);
    } catch (err) {
      console.error('Error fetching forecast data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load forecast data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (valuationId) {
      fetchForecastData();
    } else {
      setError('No valuation ID provided');
      setIsLoading(false);
    }
  }, [valuationId]);

  return {
    forecastData,
    isLoading,
    error,
    refetch: fetchForecastData
  };
}
