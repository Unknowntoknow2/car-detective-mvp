
import React, { useEffect, useState } from 'react';
import { useMakeModels } from '@/hooks/useMakeModels';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ManualEntryFormData } from '../types/manualEntry';

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
  const [loadingModels, setLoadingModels] = useState(false);

  console.log('Rendering BasicVehicleForm with:', {
    makesCount: makes.length,
    modelsCount: models.length,
    selectedMake: formData.make,
    selectedModel: formData.model
  });

  // Handle make selection and fetch models
  const handleMakeChange = async (makeName: string) => {
    console.log('Make changed to:', makeName, 'fetching models...');
    updateFormData({ make: makeName, model: '' }); // Clear model when make changes
    
    if (makeName && makes.length > 0) {
      setLoadingModels(true);
      try {
        await getModelsByMake(makeName);
      } finally {
        setLoadingModels(false);
      }
    }
  };

  const handleModelChange = (modelName: string) => {
    console.log('Model changed to:', modelName);
    updateFormData({ model: modelName });
  };

  const handleYearChange = (yearString: string) => {
    const year = parseInt(yearString, 10);
    updateFormData({ year: year });
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mileage = parseInt(e.target.value, 10) || 0;
    updateFormData({ mileage });
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    updateFormData({ zipCode: value });
  };

  const handleConditionChange = (condition: string) => {
    updateFormData({ condition });
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  if (isLoading) {
    return <div>Loading vehicle data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading vehicle data: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Make and Model Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make *</Label>
          <Select value={formData.make} onValueChange={handleMakeChange}>
            <SelectTrigger className={errors.make ? 'border-red-500' : ''}>
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
          <Label htmlFor="model">Model *</Label>
          <Select 
            value={formData.model} 
            onValueChange={handleModelChange}
            disabled={!formData.make || loadingModels}
          >
            <SelectTrigger className={errors.model ? 'border-red-500' : ''}>
              <SelectValue placeholder={
                !formData.make ? "Select make first" : 
                loadingModels ? "Loading models..." : 
                "Select model"
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
          <Label htmlFor="year">Year *</Label>
          <Select value={formData.year?.toString() || ''} onValueChange={handleYearChange}>
            <SelectTrigger className={errors.year ? 'border-red-500' : ''}>
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
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage || ''}
            onChange={handleMileageChange}
            placeholder="Enter mileage"
            className={errors.mileage ? 'border-red-500' : ''}
          />
          {errors.mileage && <p className="text-red-500 text-sm">{errors.mileage}</p>}
        </div>
      </div>

      {/* Condition and ZIP Code Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select value={formData.condition} onValueChange={handleConditionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            type="text"
            value={formData.zipCode}
            onChange={handleZipCodeChange}
            placeholder="Enter ZIP code"
            maxLength={5}
            className={errors.zipCode ? 'border-red-500' : ''}
          />
          {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
        </div>
      </div>
    </div>
  );
}
