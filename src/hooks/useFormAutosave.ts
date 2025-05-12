
import { useEffect, useCallback } from 'react';
import { FormData } from '@/types/premium-valuation';

export function useFormAutosave(formData: FormData) {
  // Load saved form data from localStorage
  const loadSavedData = useCallback(() => {
    try {
      const savedData = localStorage.getItem('premium_valuation_form');
      if (savedData) {
        return JSON.parse(savedData) as FormData;
      }
      return null;
    } catch (error) {
      console.error('Error loading saved form data:', error);
      return null;
    }
  }, []);

  // Save form data to localStorage
  const saveFormData = useCallback((data: FormData) => {
    try {
      localStorage.setItem('premium_valuation_form', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, []);

  // Clear saved form data
  const clearSavedForm = useCallback(() => {
    try {
      localStorage.removeItem('premium_valuation_form');
    } catch (error) {
      console.error('Error clearing saved form data:', error);
    }
  }, []);

  // Autosave form data when it changes
  useEffect(() => {
    // Don't save if we're at initial state
    if (!formData.make && !formData.model && !formData.year) {
      return;
    }
    
    // Don't save if we have a valuation ID (form is submitted)
    if (formData.valuationId) {
      return;
    }
    
    saveFormData(formData);
  }, [formData, saveFormData]);

  return {
    loadSavedData,
    saveFormData,
    clearSavedForm
  };
}
