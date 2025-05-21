
import React, { useState, useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { VehicleDetailsFields } from './vehicle-details/VehicleDetailsFields';
import { AccidentHistorySection } from './vehicle-details/AccidentHistorySection';
import { ValuationResults } from '@/components/premium/common/ValuationResults';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VehicleDetailsStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function VehicleDetailsStep({
  step,
  formData,
  setFormData,
  updateValidity
}: VehicleDetailsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [valuationSubmitted, setValuationSubmitted] = useState(false);
  const [valuationResult, setValuationResult] = useState<any>(null);

  // Validate required fields
  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.mileage) {
      newErrors.mileage = 'Mileage is required';
    } else if (formData.mileage < 0) {
      newErrors.mileage = 'Mileage cannot be negative';
    } else if (formData.mileage > 1000000) {
      newErrors.mileage = 'Mileage value seems unusually high';
    }

    if (!formData.fuelType) {
      newErrors.fuelType = 'Fuel type is required';
    }

    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 5-digit ZIP code';
    }

    // Convert hasAccident to string for comparison if it's a boolean
    const hasAccidentStr = typeof formData.hasAccident === 'boolean'
      ? formData.hasAccident ? 'yes' : 'no'
      : formData.hasAccident || 'no';
    
    // Only validate accident description if hasAccident is 'yes'
    if (hasAccidentStr === 'yes' && !formData.accidentDescription?.trim()) {
      newErrors.accidentDescription = 'Please provide accident details';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update validity whenever relevant form data changes
  useEffect(() => {
    const isValid = validateFields();
    updateValidity(step, isValid);
  }, [
    formData.mileage,
    formData.fuelType,
    formData.zipCode,
    formData.hasAccident,
    formData.accidentDescription,
    step,
    updateValidity
  ]);

  const runValuation = async () => {
    if (!validateFields()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert hasAccident for API call
      const accident = typeof formData.hasAccident === 'boolean'
        ? formData.hasAccident ? 'yes' : 'no'
        : formData.hasAccident === 'yes' ? 'yes' : 'no';
      
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('car-price-prediction', {
        body: {
          make: formData.make,
          model: formData.model,
          year: formData.year,
          mileage: formData.mileage,
          condition: formData.conditionLabel?.toLowerCase() || 'good',
          fuelType: formData.fuelType,
          zipCode: formData.zipCode,
          accident,
          accidentDetails: accident === 'yes' ? {
            count: '1',
            severity: 'minor',
            area: 'front'
          } : undefined,
          includeCarfax: true,
          exteriorColor: formData.exteriorColor || '',
          colorMultiplier: formData.colorMultiplier || 1.0
        }
      });

      if (error) {
        throw new Error(`Valuation failed: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data received from valuation service');
      }

      // Store the valuationId in the formData
      setFormData(prev => ({
        ...prev,
        valuationId: data.id,
        valuation: data.estimatedValue,
        confidenceScore: data.confidenceScore
      }));

      setValuationResult(data);
      setValuationSubmitted(true);
      toast.success("Valuation completed successfully!");
      
      // Set step validity to true to allow proceeding to next step
      updateValidity(step, true);
    } catch (error) {
      console.error('Valuation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate valuation');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert the edge function response format to match the ValuationResults component
  const formatAdjustmentsForDisplay = () => {
    if (!valuationResult || !valuationResult.valuationFactors) return [];
    
    return valuationResult.valuationFactors.map((factor: any) => ({
      label: factor.factor,
      value: factor.impact
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Details</h2>
        <p className="text-gray-600 mb-6">
          Provide additional information about your vehicle to ensure an accurate valuation.
        </p>
      </div>

      <VehicleDetailsFields 
        formData={formData} 
        setFormData={setFormData} 
        errors={errors} 
      />

      <AccidentHistorySection 
        formData={formData} 
        setFormData={setFormData} 
        errors={errors} 
      />

      {!valuationSubmitted ? (
        <Button 
          onClick={runValuation} 
          className="w-full mt-6" 
          disabled={isLoading || Object.keys(errors).length > 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating Valuation...
            </>
          ) : (
            'Submit for Valuation'
          )}
        </Button>
      ) : valuationResult && (
        <ValuationResults
          estimatedValue={valuationResult.estimatedValue}
          confidenceScore={valuationResult.confidenceScore}
          priceRange={valuationResult.priceRange}
          adjustments={formatAdjustmentsForDisplay()}
        />
      )}
    </div>
  );
}
