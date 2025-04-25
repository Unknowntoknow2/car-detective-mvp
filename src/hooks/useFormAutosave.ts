
import { useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';

export function useFormAutosave(formData: FormData, formKey: string = 'valuationForm') {
  // Load saved form data on initial mount
  useEffect(() => {
    const savedData = localStorage.getItem(formKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Check if the saved data is complete and valid before using it
        if (parsedData && parsedData.identifierType) {
          console.log('Loaded saved form data from localStorage');
          return parsedData;
        }
      } catch (error) {
        console.error('Error parsing saved form data:', error);
        localStorage.removeItem(formKey);
      }
    }
    return null;
  }, []);

  // Save form data on changes
  useEffect(() => {
    // Only save if we have some meaningful data
    if (formData.identifierType) {
      localStorage.setItem(formKey, JSON.stringify(formData));
      console.log('Saved form data to localStorage');
    }
  }, [formData, formKey]);

  // Function to clear saved form data
  const clearSavedForm = () => {
    localStorage.removeItem(formKey);
    console.log('Cleared saved form data from localStorage');
  };

  return { clearSavedForm };
}
