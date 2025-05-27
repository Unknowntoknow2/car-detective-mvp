
import { useState } from 'react';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { ValuationResponse } from '@/types/vehicle';
import { FormData } from '@/types/premium-valuation';
import { toast } from 'sonner';

export function useValuationSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const submitVehicleData = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Determine which identifier to use (VIN, plate, or other)
      const identifierType = formData.identifierType || 'vin';
      const identifier = formData.identifier || formData.vin || '';
      
      // Basic validation
      if (!identifier) {
        throw new Error('Vehicle identifier is required.');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockValuationData: ValuationResponse = {
        make: formData.make || 'Generic Make',
        model: formData.model || 'Generic Model',
        year: formData.year || 2020,
        mileage: formData.mileage,
        condition: formData.condition?.toString() || 'Good',
        estimatedValue: 20000,
        confidenceScore: 80,
        valuationId: `mock-${Date.now()}`,
        zipCode: formData.zipCode,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        bodyStyle: formData.bodyStyle,
        color: formData.color || formData.exteriorColor,
        trim: formData.trim,
        vin: formData.vin,
        isPremium: true,
        price_range: {
          low: 18000,
          high: 22000
        },
        adjustments: [],
        aiCondition: {
          condition: formData.condition?.toString() || 'Good',
          confidenceScore: 80,
          issuesDetected: []
        },
        userId: ''
      };
      
      toast.success('Vehicle data submitted successfully!');
      return {
        success: true,
        data: mockValuationData
      };
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit vehicle data';
      setError(errorMessage);
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    error,
    submitVehicleData
  };
}
