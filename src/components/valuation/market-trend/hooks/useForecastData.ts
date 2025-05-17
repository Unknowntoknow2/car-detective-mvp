
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

interface ForecastPoint {
  month: string;
  value: number;
}

interface ForecastData {
  forecast: ForecastPoint[];
  analysis?: string;
  percentageChange: string;
  bestTimeToSell?: string;
  confidenceScore: number;
}

interface ForecastResult {
  forecastData: ForecastData | null;
  loading: boolean;
  error: string | null;
  trend: {
    direction: 'up' | 'down' | 'neutral';
    percentage: string;
  };
}

export function useForecastData({
  valuationId,
  make,
  model,
  year,
  estimatedValue,
  isPremium
}: ForecastParams): ForecastResult {
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
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
        
        // Transform the data into a more structured format
        const formattedData: ForecastData = {
          forecast: data.months.map((month: string, index: number) => ({
            month,
            value: data.values[index]
          })),
          percentageChange: data.percentageChange,
          bestTimeToSell: data.bestTimeToSell,
          confidenceScore: data.confidenceScore
        };
        
        setForecastData(formattedData);
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
