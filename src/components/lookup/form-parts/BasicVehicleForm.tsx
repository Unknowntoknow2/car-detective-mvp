
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManualEntryFormData, ConditionLevel } from '../types/manualEntry';
import { useMakeModels } from '@/hooks/useMakeModels';

interface BasicVehicleFormProps {
  formData: ManualEntryFormData;
  updateFormData: (updates: Partial<ManualEntryFormData>) => void;
  errors: Record<string, string>;
  isPremium?: boolean;
}

export function BasicVehicleForm({
  formData,
  updateFormData,
  errors,
  isPremium = false
}: BasicVehicleFormProps) {
  const { makes, models, isLoading, error, getModelsByMake } = useMakeModels();

  // Fetch models when make changes
  useEffect(() => {
    if (formData.make && formData.make !== '') {
      console.log('Make changed to:', formData.make, 'fetching models...');
      getModelsByMake(formData.make);
    }
  }, [formData.make, getModelsByMake]);

  const handleMakeChange = (value: string) => {
    console.log('Make selected:', value);
    updateFormData({ 
      make: value,
      model: '' // Reset model when make changes
    });
  };

  const handleModelChange = (value: string) => {
    console.log('Model selected:', value);
    updateFormData({ model: value });
  };

  const handleYearChange = (value: string) => {
    const yearNum = parseInt(value);
    updateFormData({ year: yearNum });
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    updateFormData({ mileage: value });
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    updateFormData({ zipCode: value });
  };

  const handleConditionChange = (value: string) => {
    updateFormData({ condition: value as ConditionLevel });
  };

  // Generate year options (current year + 1 down to 1990)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear + 1 - i);

  if (isLoading) {
    return <div>Loading vehicle data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading vehicle data: {error}</div>;
  }

  console.log('Rendering BasicVehicleForm with:', {
    makesCount: makes.length,
    modelsCount: models.length,
    selectedMake: formData.make,
    selectedModel: formData.model
  });

  return (
    <div className="space-y-6">
      {/* Make and Model Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make" className="text-sm font-medium">
            Make <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.make} onValueChange={handleMakeChange}>
            <SelectTrigger className={errors.make ? 'border-red-300' : ''}>
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              {makes.map((make) => (
                <SelectItem key={make.id} value={make.make_name}>
                  {make.make_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.make && <p className="text-red-500 text-sm">{errors.make}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium">
            Model <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.model} 
            onValueChange={handleModelChange}
            disabled={!formData.make || models.length === 0}
          >
            <SelectTrigger className={errors.model ? 'border-red-300' : ''}>
              <SelectValue placeholder={
                !formData.make 
                  ? "Select make first" 
                  : models.length === 0 
                    ? "No models available" 
                    : "Select model"
              } />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.model_name}>
                  {model.model_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
        </div>
      </div>

      {/* Year and Mileage Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year" className="text-sm font-medium">
            Year <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.year?.toString() || ''} onValueChange={handleYearChange}>
            <SelectTrigger className={errors.year ? 'border-red-300' : ''}>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage" className="text-sm font-medium">
            Mileage <span className="text-red-500">*</span>
          </Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage || ''}
            onChange={handleMileageChange}
            placeholder="Enter mileage"
            className={errors.mileage ? 'border-red-300' : ''}
          />
          {errors.mileage && <p className="text-red-500 text-sm">{errors.mileage}</p>}
        </div>
      </div>

      {/* Condition and ZIP Code Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="condition" className="text-sm font-medium">
            Condition <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.condition} onValueChange={handleConditionChange}>
            <SelectTrigger className={errors.condition ? 'border-red-300' : ''}>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ConditionLevel.Excellent}>Excellent</SelectItem>
              <SelectItem value={ConditionLevel.Good}>Good</SelectItem>
              <SelectItem value={ConditionLevel.Fair}>Fair</SelectItem>
              <SelectItem value={ConditionLevel.Poor}>Poor</SelectItem>
            </SelectContent>
          </Select>
          {errors.condition && <p className="text-red-500 text-sm">{errors.condition}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode" className="text-sm font-medium">
            ZIP Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="zipCode"
            type="text"
            value={formData.zipCode}
            onChange={handleZipCodeChange}
            placeholder="Enter ZIP code"
            maxLength={5}
            className={errors.zipCode ? 'border-red-300' : ''}
          />
          {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
        </div>
      </div>
    </div>
  );
}
