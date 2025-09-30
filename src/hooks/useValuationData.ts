
import { useState, useEffect } from 'react';
import { LegacyValuationResult, SavedValuation } from '@/types/valuation';

export interface UseValuationDataOptions {
  userId?: string;
  loadSaved?: boolean;
  loadHistory?: boolean;
}

export interface UseValuationDataReturn {
  valuations: LegacyValuationResult[];
  savedValuations: SavedValuation[];
  isLoading: boolean;
  error: string | null;
  deleteValuation: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export function useValuationData(options: UseValuationDataOptions = {}): UseValuationDataReturn {
  const { userId, loadSaved = false, loadHistory = false } = options;
  
  const [valuations, setValuations] = useState<LegacyValuationResult[]>([]);
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
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteValuation = async (id: string): Promise<void> => {
    try {
      setValuations(prev => prev.filter(v => v.id !== id));
      setSavedValuations(prev => prev.filter(v => v.id !== id));
    } catch {
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

// Test deduplication function for the test suite
export const testDeduplication = (valuations: any[]): any[] => {
  if (!valuations || !Array.isArray(valuations)) {
    return [];
  }

  const deduped = new Map();
  
  valuations.forEach(valuation => {
    const existing = deduped.get(valuation.id);
    
    if (!existing) {
      deduped.set(valuation.id, valuation);
    } else {
      // Prefer premium valuations
      if (valuation.is_premium && !existing.is_premium) {
        deduped.set(valuation.id, valuation);
      } else if (valuation.is_premium === existing.is_premium) {
        // If premium status is the same, prefer newer entries
        const currentDate = new Date(valuation.created_at);
        const existingDate = new Date(existing.created_at);
        if (currentDate > existingDate) {
          deduped.set(valuation.id, valuation);
        }
      }
    }
  });
  
  return Array.from(deduped.values());
};

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
