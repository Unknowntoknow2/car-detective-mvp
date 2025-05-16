
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ForecastParams {
  valuationId: string;
  make: string;
  model: string;
  year: number;
  estimatedValue: number;
  isPremium: boolean;
}

export function useForecastData({
  valuationId,
  make,
  model,
  year,
  estimatedValue,
  isPremium
}: ForecastParams) {
  const [forecastData, setForecastData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecastData = async () => {
      if (!isPremium) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('valuation-forecast', {
          body: {
            make,
            model,
            year,
            currentValue: estimatedValue,
            months: 12,
            valuationId
          }
        });
        
        if (error) throw error;
        setForecastData(data);
      } catch (err) {
        console.error('Error fetching forecast data:', err);
        setError('Failed to load market trend data');
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [valuationId, make, model, year, estimatedValue, isPremium]);

  // Calculate market trend direction and percentage
  const calculatedTrend = () => {
    if (!forecastData || !forecastData.forecast || forecastData.forecast.length < 2) {
      return { direction: 'neutral' as const, percentage: '0' };
    }
    
    const startValue = forecastData.forecast[0].value;
    const endValue = forecastData.forecast[forecastData.forecast.length - 1].value;
    const percentage = ((endValue - startValue) / startValue) * 100;
    
    return {
      direction: percentage > 0 ? 'up' as const : percentage < 0 ? 'down' as const : 'neutral' as const,
      percentage: Math.abs(percentage).toFixed(1)
    };
  };

  return {
    forecastData,
    loading,
    error,
    trend: calculatedTrend()
  };
}
