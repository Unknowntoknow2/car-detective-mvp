
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ManualEntryFormData } from '@/types/manual-entry';
import { submitManualValuation } from '@/services/valuation/submitManualValuation';

export const useValuationFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const processValuation = async (data: ManualEntryFormData) => {
    setIsLoading(true);
    try {
      const resultId = await submitManualValuation(data);
      navigate(`/valuation/result/${resultId}`);
      return resultId;
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
