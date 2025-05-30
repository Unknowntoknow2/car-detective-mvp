
import { useState } from 'react';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { ValuationResponse } from '@/types/vehicle';
import { FormData } from '@/types/premium-valuation';
import { ReportData } from '@/utils/pdf/types';
import { submitValuation } from '@/lib/valuation/submitValuation';
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
      
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Build report data from form data
      const reportData: ReportData = {
        make: formData.make || 'Generic Make',
        model: formData.model || 'Generic Model',
        year: formData.year || 2020,
        mileage: formData.mileage,
        condition: formData.condition.toString(),
        estimatedValue: 20000, // This would come from your pricing engine
        confidenceScore: 80,
        zipCode: formData.zipCode,
        adjustments: [],
        generatedAt: new Date().toISOString(),
        vin: formData.vin
      };

      // Submit valuation with dealer notifications
      const result = await submitValuation({
        vin: formData.vin,
        zipCode: formData.zipCode,
        reportData,
        isPremium: true,
        notifyDealers: true
      });
      
      toast.success('Vehicle data submitted successfully!');
      
      if (result.notificationsSent) {
        toast.info('Dealers in your area have been notified');
      }
      
      return {
        success: true,
        data: {
          success: true,
          make: reportData.make,
          model: reportData.model,
          year: reportData.year,
          mileage: reportData.mileage,
          condition: reportData.condition,
          estimatedValue: reportData.estimatedValue,
          confidenceScore: reportData.confidenceScore,
          valuationId: `val-${Date.now()}`,
          zipCode: formData.zipCode,
          fuelType: formData.fuelType,
          transmission: formData.transmission,
          bodyType: formData.bodyStyle,
          color: formData.color,
          trim: formData.trim,
          vin: formData.vin,
          isPremium: true,
          price_range: {
            low: 18000,
            high: 22000
          },
          adjustments: [],
          aiCondition: {
            condition: formData.condition.toString(),
            confidenceScore: 80,
            issuesDetected: []
          },
          userId: ''
        } as ValuationResponse
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
