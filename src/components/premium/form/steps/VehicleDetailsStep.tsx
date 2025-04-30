
import React, { useEffect, useState } from 'react';
import { FormData } from '@/types/premium-valuation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { CarFront, Fuel, Check, AlertTriangle } from 'lucide-react';

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

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      mileage: value === '' ? null : Number(value)
    }));
  };

  const handleFuelTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      fuelType: value
    }));
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      zipCode: e.target.value
    }));
  };

  const handleExteriorColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      exteriorColor: e.target.value
    }));
  };

  const handleInteriorColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      interiorColor: e.target.value
    }));
  };

  const handleBodyTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      bodyType: value
    }));
  };

  const handleTrimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      trim: e.target.value
    }));
  };

  const toggleAccidentHistory = (hasAccident: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasAccident,
      // Clear accident description if toggling to "No"
      ...(hasAccident === false ? { accidentDescription: '' } : {})
    }));
  };

  const handleAccidentDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      accidentDescription: e.target.value
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mileage */}
        <div className="space-y-2">
          <Label htmlFor="mileage">
            Mileage <span className="text-red-500">*</span>
          </Label>
          <Input
            id="mileage"
            type="number"
            placeholder="e.g. 45000"
            value={formData.mileage || ''}
            onChange={handleMileageChange}
            className={errors.mileage ? "border-red-500" : ""}
          />
          {errors.mileage && <FormValidationError error={errors.mileage} />}
          <p className="text-sm text-gray-500">Current mileage on your vehicle's odometer</p>
        </div>

        {/* Fuel Type */}
        <div className="space-y-2">
          <Label htmlFor="fuelType">
            Fuel Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.fuelType || ''}
            onValueChange={handleFuelTypeChange}
          >
            <SelectTrigger id="fuelType" className={errors.fuelType ? "border-red-500" : ""}>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gasoline">Gasoline</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
              <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
              <SelectItem value="Natural Gas">Natural Gas</SelectItem>
              <SelectItem value="Flex Fuel">Flex Fuel</SelectItem>
            </SelectContent>
          </Select>
          {errors.fuelType && <FormValidationError error={errors.fuelType} />}
        </div>

        {/* ZIP Code */}
        <div className="space-y-2">
          <Label htmlFor="zipCode">
            ZIP Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="zipCode"
            placeholder="e.g. 90210"
            value={formData.zipCode}
            onChange={handleZipCodeChange}
            maxLength={10}
            className={errors.zipCode ? "border-red-500" : ""}
          />
          {errors.zipCode && <FormValidationError error={errors.zipCode} />}
          <p className="text-sm text-gray-500">Used to determine regional market value</p>
        </div>

        {/* Exterior Color */}
        <div className="space-y-2">
          <Label htmlFor="exteriorColor">Exterior Color</Label>
          <Input
            id="exteriorColor"
            placeholder="e.g. Pearl White"
            value={formData.exteriorColor || ''}
            onChange={handleExteriorColorChange}
          />
        </div>

        {/* Interior Color */}
        <div className="space-y-2">
          <Label htmlFor="interiorColor">Interior Color</Label>
          <Input
            id="interiorColor"
            placeholder="e.g. Black Leather"
            value={formData.interiorColor || ''}
            onChange={handleInteriorColorChange}
          />
        </div>

        {/* Body Type */}
        <div className="space-y-2">
          <Label htmlFor="bodyType">Body Type</Label>
          <Select
            value={formData.bodyType || ''}
            onValueChange={handleBodyTypeChange}
          >
            <SelectTrigger id="bodyType">
              <SelectValue placeholder="Select body type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sedan">Sedan</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
              <SelectItem value="Van">Van</SelectItem>
              <SelectItem value="Coupe">Coupe</SelectItem>
              <SelectItem value="Convertible">Convertible</SelectItem>
              <SelectItem value="Wagon">Wagon</SelectItem>
              <SelectItem value="Hatchback">Hatchback</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Trim */}
        <div className="space-y-2">
          <Label htmlFor="trim">Trim Level</Label>
          <Input
            id="trim"
            placeholder="e.g. LX, EX-L, Limited"
            value={formData.trim || ''}
            onChange={handleTrimChange}
          />
          <p className="text-sm text-gray-500">The specific trim package of your vehicle</p>
        </div>
      </div>

      {/* Accident History */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Accident History</h3>
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => toggleAccidentHistory(false)}
            className={`flex items-center px-4 py-2 border rounded-md ${
              formData.hasAccident === false 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Check className="w-4 h-4 mr-2" />
            No Accidents
          </button>
          
          <button
            type="button"
            onClick={() => toggleAccidentHistory(true)}
            className={`flex items-center px-4 py-2 border rounded-md ${
              formData.hasAccident === true 
                ? 'bg-amber-50 border-amber-200 text-amber-700' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Has Accident History
          </button>
        </div>
        
        {formData.hasAccident && (
          <div className="space-y-2 mt-4">
            <Label htmlFor="accidentDescription">
              Accident Details <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="accidentDescription"
              placeholder="Please describe the accident(s), including severity, when it happened, and what parts of the vehicle were affected."
              value={formData.accidentDescription}
              onChange={handleAccidentDescriptionChange}
              className={errors.accidentDescription ? "border-red-500" : ""}
              rows={4}
            />
            {errors.accidentDescription && <FormValidationError error={errors.accidentDescription} />}
            <p className="text-sm text-gray-500">
              Providing accurate accident details helps ensure a more precise valuation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
