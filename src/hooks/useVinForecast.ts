
import { useState, useEffect } from 'react';
import { VinForecast, getOrCreateVinForecast } from '@/services/vinForecastService';

export function useVinForecast(vin: string) {
  const [forecast, setForecast] = useState<VinForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadForecast = async () => {
      if (!vin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const forecastData = await getOrCreateVinForecast(vin);
        
        if (mounted) {
          setForecast(forecastData);
        }
      } catch {
        if (mounted) {
          setError('Failed to load forecast');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadForecast();

    return () => {
      mounted = false;
    };
  }, [vin]);

  return { forecast, loading, error };
}
