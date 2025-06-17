
import { useCallback } from 'react';

export const useLocalization = () => {
  const formatCurrency = useCallback((amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }, []);

  const formatNumber = useCallback((num: number) => {
    return num.toLocaleString();
  }, []);

  const capitalize = useCallback((str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }, []);

  return {
    formatCurrency,
    formatNumber,
    capitalize,
    t: (key: string) => key, // Simple passthrough for now
  };
};
