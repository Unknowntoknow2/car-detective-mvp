
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ManualEntryFormData } from '@/types/manual-entry';
import { submitManualValuation } from '@/services/valuation/submitManualValuation';
import { useValuationResult, ValuationResult } from '@/hooks/useValuationResult';

export const useValuationFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const processValuation = async (data: ManualEntryFormData) => {
    setIsLoading(true);
    try {
      const result = await submitManualValuation(data);
      navigate(`/valuation/result/${result.id}`);
      return result;
    } catch (error) {
      console.error('Valuation processing failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    processValuation,
    isLoading
  };
};
