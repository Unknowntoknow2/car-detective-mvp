
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ForecastData {
  months: string[];
  values: number[];
  trend: 'increasing' | 'decreasing' | 'stable';
  confidenceScore: number;
  percentageChange: number;
  bestTimeToSell: string;
}

export function useForecastData(valuationId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: fnError } = await supabase.functions.invoke('valuation-forecast', {
          body: { valuationId }
        });
        
        if (fnError) throw new Error(fnError.message);
        if (!data) throw new Error('No forecast data returned');
        
        setForecastData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate forecast';
        console.error('Forecast error:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (valuationId) {
      fetchForecast();
    }
  }, [valuationId]);

  return { forecastData, isLoading, error };
}
