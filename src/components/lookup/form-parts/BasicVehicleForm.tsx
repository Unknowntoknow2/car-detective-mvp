
import React, { useEffect } from 'react';
import { useMakeModels } from '@/hooks/useMakeModels';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormValidationError } from '@/components/premium/common/FormValidationError';

interface BasicVehicleFormProps {
  formData: any;
  updateFormData: (updates: any) => void;
  errors?: Record<string, string>;
  isPremium?: boolean;
}

export function BasicVehicleForm({
  formData,
  updateFormData,
  errors = {},
  isPremium = false
}: BasicVehicleFormProps) {
  const { makes, models, isLoading, getModelsByMakeId } = useMakeModels();

  // Get current year for year options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 35 }, (_, i) => currentYear - i);

  // Handle make selection
  const handleMakeChange = async (makeName: string) => {
    console.log('Make selected:', makeName);
    const selectedMake = makes.find(make => make.make_name === makeName);
    
    if (selectedMake) {
      console.log('Found make ID:', selectedMake.id);
      updateFormData({ 
        make: makeName,
        model: '' // Reset model when make changes
      });
      
      // Fetch models for this make
      await getModelsByMakeId(selectedMake.id);
    }
  };

  // Handle model selection
  const handleModelChange = (modelName: string) => {
    console.log('Model selected:', modelName);
    updateFormData({ model: modelName });
  };

  // Handle year selection - ensure we convert to number
  const handleYearChange = (yearValue: string) => {
    const yearNumber = parseInt(yearValue, 10);
    if (!isNaN(yearNumber)) {
      updateFormData({ year: yearNumber });
    }
  };

  // Handle ZIP code input
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    updateFormData({ zipCode: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Make Selection */}
        <div className="space-y-2">
          <Label htmlFor="make" className="text-sm font-medium text-slate-700">
            Make
          </Label>
          <Select
            value={formData.make || ''}
            onValueChange={handleMakeChange}
          >
            <SelectTrigger 
              id="make"
              className={`h-10 transition-all duration-200 ${errors.make ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
            >
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>Loading makes...</SelectItem>
              ) : (
                makes.map(make => (
                  <SelectItem key={make.id} value={make.make_name}>
                    {make.make_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.make && <FormValidationError error={errors.make} />}
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium text-slate-700">
            Model
          </Label>
          <Select
            value={formData.model || ''}
            onValueChange={handleModelChange}
            disabled={!formData.make}
          >
            <SelectTrigger 
              id="model"
              className={`h-10 transition-all duration-200 ${errors.model ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
            >
              <SelectValue placeholder={formData.make ? "Select model" : "Select make first"} />
            </SelectTrigger>
            <SelectContent>
              {models.length === 0 && formData.make ? (
                <SelectItem value="no-models" disabled>No models available</SelectItem>
              ) : (
                models.map(model => (
                  <SelectItem key={model.id} value={model.model_name}>
                    {model.model_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {errors.model && <FormValidationError error={errors.model} />}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Year Selection */}
        <div className="space-y-2">
          <Label htmlFor="year" className="text-sm font-medium text-slate-700">
            Year
          </Label>
          <Select
            value={formData.year ? formData.year.toString() : ''}
            onValueChange={handleYearChange}
          >
            <SelectTrigger 
              id="year"
              className={`h-10 transition-all duration-200 ${errors.year ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
            >
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.year && <FormValidationError error={errors.year} />}
        </div>

        {/* Mileage Input */}
        <div className="space-y-2">
          <Label htmlFor="mileage" className="text-sm font-medium text-slate-700">
            Mileage
          </Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage || ''}
            onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || 0 })}
            placeholder="Enter mileage"
            className={`h-10 transition-all duration-200 ${errors.mileage ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
          />
          {errors.mileage && <FormValidationError error={errors.mileage} />}
        </div>
      </div>

      {/* ZIP Code */}
      <div className="sm:w-1/2">
        <div className="space-y-2">
          <Label htmlFor="zipCode" className="text-sm font-medium text-slate-700">
            ZIP Code
          </Label>
          <Input
            id="zipCode"
            type="text"
            value={formData.zipCode || ''}
            onChange={handleZipCodeChange}
            placeholder="Enter ZIP code"
            maxLength={5}
            className={`h-10 transition-all duration-200 ${errors.zipCode ? 'border-red-300 focus:ring-red-200' : 'focus:ring-primary/20 focus:border-primary hover:border-primary/30'}`}
          />
          {errors.zipCode && <FormValidationError error={errors.zipCode} />}
          <p className="text-xs text-slate-500">
            Your location helps us determine regional market values
          </p>
        </div>
      </div>

      {/* Premium fields */}
      {isPremium && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Trim Selection */}
          <div className="space-y-2">
            <Label htmlFor="trim" className="text-sm font-medium text-slate-700">
              Trim
            </Label>
            <Input
              id="trim"
              type="text"
              value={formData.trim || ''}
              onChange={(e) => updateFormData({ trim: e.target.value })}
              placeholder="Enter trim level"
              className="h-10 transition-all duration-200 focus:ring-primary/20 focus:border-primary hover:border-primary/30"
            />
          </div>

          {/* Fuel Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="fuelType" className="text-sm font-medium text-slate-700">
              Fuel Type
            </Label>
            <Select
              value={formData.fuelType || ''}
              onValueChange={(value) => updateFormData({ fuelType: value })}
            >
              <SelectTrigger 
                id="fuelType"
                className="h-10 transition-all duration-200 focus:ring-primary/20 focus:border-primary hover:border-primary/30"
              >
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasoline">Gasoline</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
