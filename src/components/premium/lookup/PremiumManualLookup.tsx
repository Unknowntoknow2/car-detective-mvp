
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BasicVehicleInfo } from './form-parts/BasicVehicleInfo';

export function PremiumManualLookup() {
  const [formData, setFormData] = useState({
    makeId: '',
    model: '',
    year: '',
    mileage: '',
    zipCode: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.makeId) {
      newErrors.makeId = 'Make is required';
    }
    
    if (!formData.model) {
      newErrors.model = 'Model is required';
    }
    
    if (!formData.year) {
      newErrors.year = 'Year is required';
    }
    
    if (!formData.mileage) {
      newErrors.mileage = 'Mileage is required';
    } else if (isNaN(Number(formData.mileage)) || Number(formData.mileage) < 0) {
      newErrors.mileage = 'Mileage must be a positive number';
    }
    
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'ZIP code must be 5 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Submitting valuation with data:', formData);
      // Handle form submission
    }
  };
  
  const handleYearChange = (year: string | number) => {
    setFormData(prev => ({
      ...prev,
      year: String(year)
    }));
  };
  
  return (
    <form onSubmit={handleFormSubmit}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-4">Enter your vehicle details manually</h2>
          
          <Card className="p-4">
            <div className="space-y-6">
              <BasicVehicleInfo
                selectedMakeId={formData.makeId}
                setSelectedMakeId={(makeId) => setFormData(prev => ({ ...prev, makeId }))}
                selectedModel={formData.model}
                setSelectedModel={(model) => setFormData(prev => ({ ...prev, model }))}
                selectedYear={formData.year}
                setSelectedYear={handleYearChange}
                mileage={formData.mileage}
                setMileage={(mileage) => setFormData(prev => ({ ...prev, mileage }))}
                zipCode={formData.zipCode}
                setZipCode={(zipCode) => setFormData(prev => ({ ...prev, zipCode }))}
                isDisabled={false}
                errors={errors}
              />
              
              <Button type="submit" className="w-full">
                Get Valuation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}

export default PremiumManualLookup;
