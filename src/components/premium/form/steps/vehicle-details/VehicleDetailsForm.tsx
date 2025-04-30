
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { AccidentToggle } from './AccidentToggle';
import { TransmissionSelect } from './TransmissionSelect';
import { FormValidationError } from '@/components/premium/common/FormValidationError';

interface VehicleDetailsFormProps {
  initialData: {
    mileage: number | null;
    fuelType: string | null;
    zipCode: string;
    condition?: number;
    hasAccident?: boolean | null;
    accidentDescription?: string;
    transmissionType?: string;
  };
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const FUEL_TYPES = [
  { value: 'Gasoline', label: 'Gasoline' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Electric', label: 'Electric' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'Plug-in Hybrid', label: 'Plug-in Hybrid' },
];

const CONDITION_LABELS = [
  { value: 1, label: 'Poor' },
  { value: 2, label: 'Fair' },
  { value: 3, label: 'Good' },
  { value: 4, label: 'Excellent' },
  { value: 5, label: 'Like New' },
];

export function VehicleDetailsForm({ initialData, onSubmit, isLoading = false }: VehicleDetailsFormProps) {
  const [formData, setFormData] = useState({
    mileage: initialData.mileage || null,
    fuelType: initialData.fuelType || null,
    zipCode: initialData.zipCode || '',
    condition: initialData.condition || 3,
    hasAccident: initialData.hasAccident || false,
    accidentDescription: initialData.accidentDescription || '',
    transmissionType: initialData.transmissionType || 'Automatic',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [conditionLabel, setConditionLabel] = useState(CONDITION_LABELS[2].label); // Default to "Good"
  
  useEffect(() => {
    const label = CONDITION_LABELS.find(c => c.value === formData.condition)?.label || 'Good';
    setConditionLabel(label);
  }, [formData.condition]);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
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
    
    if (!formData.transmissionType) {
      newErrors.transmissionType = 'Transmission type is required';
    }
    
    // Only validate accident description if hasAccident is true
    if (formData.hasAccident && !formData.accidentDescription.trim()) {
      newErrors.accidentDescription = 'Please provide accident details';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        conditionLabel
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Vehicle Details</h3>
        <p className="text-sm text-gray-500">
          Please provide additional details about your vehicle to ensure an accurate valuation.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mileage">
            Mileage <span className="text-red-500">*</span>
          </Label>
          <Input
            id="mileage"
            type="number"
            placeholder="Enter vehicle mileage"
            value={formData.mileage || ''}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value, 10) : null;
              setFormData(prev => ({ ...prev, mileage: value }));
            }}
            className={errors.mileage ? "border-red-500" : ""}
          />
          {errors.mileage && <FormValidationError error={errors.mileage} />}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fuelType">
            Fuel Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.fuelType || undefined}
            onValueChange={(value) => setFormData(prev => ({ ...prev, fuelType: value }))}
          >
            <SelectTrigger id="fuelType" className={errors.fuelType ? "border-red-500" : ""}>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              {FUEL_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.fuelType && <FormValidationError error={errors.fuelType} />}
        </div>
        
        <TransmissionSelect
          value={formData.transmissionType}
          onChange={(value) => setFormData(prev => ({ ...prev, transmissionType: value }))}
          disabled={isLoading}
        />
        {errors.transmissionType && <FormValidationError error={errors.transmissionType} />}
        
        <div className="space-y-2">
          <Label htmlFor="zipCode">
            ZIP Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="zipCode"
            placeholder="Enter ZIP code (e.g., 90210)"
            value={formData.zipCode}
            onChange={(e) => {
              // Allow only numbers and limit to 5 digits
              const value = e.target.value.replace(/\D/g, '').slice(0, 5);
              setFormData(prev => ({ ...prev, zipCode: value }));
            }}
            className={errors.zipCode ? "border-red-500" : ""}
            maxLength={5}
          />
          {errors.zipCode && <FormValidationError error={errors.zipCode} />}
          <p className="text-sm text-gray-500">
            Your location helps us determine regional pricing factors
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>
            Vehicle Condition: <span className="font-medium text-primary">{conditionLabel}</span>
          </Label>
          <Slider
            value={[formData.condition]}
            min={1}
            max={5}
            step={1}
            onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value[0] }))}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Poor</span>
            <span>Fair</span>
            <span>Good</span>
            <span>Excellent</span>
            <span>Like New</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Accident History</h3>
        
        <AccidentToggle 
          hasAccident={formData.hasAccident} 
          onToggle={(hasAccident) => {
            setFormData(prev => ({
              ...prev,
              hasAccident,
              // Clear accident description if toggling to "No"
              ...(hasAccident === false ? { accidentDescription: '' } : {})
            }));
          }} 
        />
        
        {formData.hasAccident && (
          <div className="space-y-2 mt-4">
            <Label htmlFor="accidentDescription">
              Accident Details <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="accidentDescription"
              placeholder="Please describe the accident(s), including severity, when it happened, and what parts of the vehicle were affected."
              value={formData.accidentDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, accidentDescription: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md ${errors.accidentDescription ? "border-red-500" : "border-gray-300"}`}
              rows={4}
            />
            {errors.accidentDescription && <FormValidationError error={errors.accidentDescription} />}
          </div>
        )}
      </div>
      
      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Calculating Valuation...' : 'Submit for Valuation'}
        </Button>
      </div>
    </form>
  );
}
