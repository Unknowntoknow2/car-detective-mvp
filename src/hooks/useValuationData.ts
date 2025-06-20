
import { useState, useEffect } from 'react';
import { ValuationResult, SavedValuation } from '@/types/valuation';

export interface UseValuationDataOptions {
  userId?: string;
  loadSaved?: boolean;
  loadHistory?: boolean;
}

export interface UseValuationDataReturn {
  valuations: ValuationResult[];
  savedValuations: SavedValuation[];
  isLoading: boolean;
  error: string | null;
  deleteValuation: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export function useValuationData(options: UseValuationDataOptions = {}): UseValuationDataReturn {
  const { userId, loadSaved = false, loadHistory = false } = options;
  
  const [valuations, setValuations] = useState<ValuationResult[]>([]);
  const [savedValuations, setSavedValuations] = useState<SavedValuation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock implementation - replace with actual data fetching
      if (loadHistory) {
        setValuations([]);
      }
      
      if (loadSaved) {
        setSavedValuations([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteValuation = async (id: string): Promise<void> => {
    try {
      setValuations(prev => prev.filter(v => v.id !== id));
      setSavedValuations(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError('Failed to delete valuation');
    }
  };

  useEffect(() => {
    if (userId && (loadSaved || loadHistory)) {
      refreshData();
    }
  }, [userId, loadSaved, loadHistory]);

  return {
    valuations,
    savedValuations,
    isLoading,
    error,
    deleteValuation,
    refreshData
  };
}

// Specific hooks for backward compatibility
export const useValuationHistory = () => {
  const result = useValuationData({ loadHistory: true });
  return {
    valuations: result.valuations,
    isLoading: result.isLoading,
    error: result.error,
  };
};

export const useSavedValuations = () => {
  const result = useValuationData({ loadSaved: true });
  return {
    valuations: result.savedValuations,
    isLoading: result.isLoading,
    error: result.error,
    deleteValuation: result.deleteValuation,
    loading: result.isLoading, // Legacy alias
  };
};
