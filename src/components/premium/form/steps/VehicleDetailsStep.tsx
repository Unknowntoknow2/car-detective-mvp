
import React, { useEffect, useState } from 'react';
import { FormData } from '@/types/premium-valuation';
import { VehicleDetailsFields } from './vehicle-details/VehicleDetailsFields';
import { AccidentHistorySection } from './vehicle-details/AccidentHistorySection';

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

    // Only validate accident description if hasAccident is true
    if (formData.hasAccident && !formData.accidentDescription.trim()) {
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
    </div>
  );
}
