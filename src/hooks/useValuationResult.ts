
import { useState, useEffect } from 'react';

export function useValuationResult(valuationId?: string) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock implementation
    const timer = setTimeout(() => {
      setData({
        id: valuationId,
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        estimatedValue: 25000,
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [valuationId]);

  return { data, isLoading, error };
}
