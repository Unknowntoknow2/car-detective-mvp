
import { useState } from 'react';
import { FormData } from '@/types/premium-valuation';
import { z } from 'zod';
import { createPremiumValuation } from '@/services/valuationService';

// Schema for form validation
const premiumValuationSchema = z.object({
  vin: z.string().optional(),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900, "Invalid year").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  mileage: z.union([z.coerce.number().min(0, "Mileage cannot be negative"), z.null()]).optional(),
  zipCode: z.string().min(5, "Valid ZIP code required").max(10),
  condition: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  bodyType: z.string().optional(),
  features: z.array(z.string()).optional().default([]),
  email: z.string().email("Valid email required").optional(),
  agreeToTerms: z.boolean().optional()
});

export const usePremiumValuationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    identifierType: 'vin',
    identifier: '',
    vin: '',
    make: '',
    model: '',
    year: 2020,
    mileage: null,
    zipCode: '',
    condition: 'Good',
    hasAccident: 'no',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    features: [],
    photos: [],
    drivingProfile: 'average',
    isPremium: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [valuationId, setValuationId] = useState<string | null>(null);
  
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };
  
  const submitValuation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const validationResult = premiumValuationSchema.safeParse(formData);
      
      if (!validationResult.success) {
        const errors = validationResult.error.format();
        setError('Please fix the validation errors and try again.');
        console.error('Validation errors:', errors);
        return;
      }
      
      const response = await createPremiumValuation(formData);
      
      // Save response
      setResult(response);
      
      // Save valuation ID
      if (response.id) {
        setValuationId(response.id);
        
        // Store the ID in localStorage for persistence
        localStorage.setItem('latest_valuation_id', response.id);
      }
      
      return response;
    } catch (err) {
      console.error('Error submitting valuation:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit valuation.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    formData,
    updateFormData,
    isLoading,
    error,
    result,
    submitValuation,
    valuationId
  };
};
