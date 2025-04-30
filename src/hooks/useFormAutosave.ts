
import { useEffect, useCallback } from 'react';
import { FormData } from '@/types/premium-valuation';
import { toast } from 'sonner';

export function useFormAutosave(formData: FormData, formKey: string = 'valuationForm') {
  // Save form data on changes
  useEffect(() => {
    // Only save if we have some meaningful data
    if (formData.make || formData.model || formData.identifierType) {
      localStorage.setItem(formKey, JSON.stringify(formData));
      console.log('Saved form data to localStorage');
    }
  }, [formData, formKey]);

  // Load saved form data on initial mount
  const loadSavedData = useCallback(() => {
    try {
      const savedData = localStorage.getItem(formKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Check if the saved data is complete and valid before using it
        if (parsedData && (parsedData.make || parsedData.identifierType)) {
          console.log('Loaded saved form data from localStorage');
          toast.info('Your previous form progress has been restored.');
          return parsedData;
        }
      }
    } catch (error) {
      console.error('Error parsing saved form data:', error);
      localStorage.removeItem(formKey);
    }
    return null;
  }, [formKey]);

  // Function to clear saved form data
  const clearSavedForm = useCallback(() => {
    localStorage.removeItem(formKey);
    console.log('Cleared saved form data from localStorage');
    toast.success('Form data has been reset.');
  }, [formKey]);

  return { loadSavedData, clearSavedForm };
}
