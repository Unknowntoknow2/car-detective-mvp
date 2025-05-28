
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMakeModels } from '@/hooks/useMakeModels';
import { ManualEntryFormData } from '../types/manualEntry';
import { FormValidationError } from '@/components/premium/common/FormValidationError';
import { Loader2 } from 'lucide-react';

interface BasicVehicleFormProps {
  formData: ManualEntryFormData;
  updateFormData: (updates: Partial<ManualEntryFormData>) => void;
  errors?: Record<string, string>;
  isPremium?: boolean;
}

export function BasicVehicleForm({
  formData,
  updateFormData,
  errors = {},
  isPremium = false
}: BasicVehicleFormProps) {
  const { makes, models, isLoading, isLoadingModels, getModelsByMakeId } = useMakeModels();
  const [selectedMakeId, setSelectedMakeId] = useState<string>('');

  // Find make ID when formData.make changes
  useEffect(() => {
    if (formData.make && makes.length > 0) {
      const foundMake = makes.find(make => make.make_name === formData.make);
      if (foundMake && foundMake.id !== selectedMakeId) {
        setSelectedMakeId(foundMake.id);
      }
    }
  }, [formData.make, makes, selectedMakeId]);

  // Load models when make is selected
  useEffect(() => {
    if (selectedMakeId) {
      console.log('Loading models for make ID:', selectedMakeId);
      getModelsByMakeId(selectedMakeId);
    }
  }, [selectedMakeId, getModelsByMakeId]);

  const handleMakeChange = (makeId: string) => {
    const selectedMake = makes.find(make => make.id === makeId);
    if (selectedMake) {
      console.log('Make selected:', selectedMake.make_name);
      setSelectedMakeId(makeId);
      updateFormData({
        make: selectedMake.make_name,
        makeName: selectedMake.make_name,
        model: '', // Reset model when make changes
        modelName: '',
        trim: '', // Reset trim when make changes
        trimName: ''
      });
    }
  };

  const handleModelChange = (modelName: string) => {
    console.log('Model selected:', modelName);
    updateFormData({
      model: modelName,
      modelName: modelName,
      trim: '', // Reset trim when model changes
      trimName: ''
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      updateFormData({ year: value });
    }
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      updateFormData({ mileage: value });
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    updateFormData({ zipCode: value });
  };

  // Generate year options
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear + 1; year >= 1990; year--) {
      years.push(year);
    }
    return years;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Make Selection */}
        <div className="space-y-2">
          <Label htmlFor="make" className="text-sm font-medium">
            Make *
          </Label>
          <Select
            value={selectedMakeId}
            onValueChange={handleMakeChange}
            disabled={isLoading}
          >
            <SelectTrigger 
              id="make"
              className={errors.make ? 'border-red-300' : ''}
            >
              <SelectValue placeholder={isLoading ? "Loading makes..." : "Select make"} />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              {makes.map(make => (
                <SelectItem key={make.id} value={make.id}>
                  {make.make_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.make && <FormValidationError error={errors.make} />}
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium">
            Model *
          </Label>
          <Select
            value={formData.model || ''}
            onValueChange={handleModelChange}
            disabled={!selectedMakeId || isLoadingModels || models.length === 0}
          >
            <SelectTrigger 
              id="model"
              className={errors.model ? 'border-red-300' : ''}
            >
              <SelectValue placeholder={
                !selectedMakeId 
                  ? "Select make first"
                  : isLoadingModels 
                    ? "Loading models..."
                    : models.length === 0
                      ? "No models available"
                      : "Select model"
              } />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              {models.map(model => (
                <SelectItem key={model.id} value={model.model_name}>
                  {model.model_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.model && <FormValidationError error={errors.model} />}
          {isLoadingModels && (
            <div className="flex items-center text-sm text-gray-500">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Loading models...
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Year */}
        <div className="space-y-2">
          <Label htmlFor="year" className="text-sm font-medium">
            Year *
          </Label>
          <Select
            value={formData.year?.toString() || ''}
            onValueChange={(value) => updateFormData({ year: parseInt(value, 10) })}
          >
            <SelectTrigger 
              id="year"
              className={errors.year ? 'border-red-300' : ''}
            >
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              {getYearOptions().map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.year && <FormValidationError error={errors.year} />}
        </div>

        {/* Mileage */}
        <div className="space-y-2">
          <Label htmlFor="mileage" className="text-sm font-medium">
            Mileage
          </Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage || ''}
            onChange={handleMileageChange}
            placeholder="Enter mileage"
            min="0"
            className={errors.mileage ? 'border-red-300' : ''}
          />
          {errors.mileage && <FormValidationError error={errors.mileage} />}
        </div>
      </div>

      {/* ZIP Code */}
      <div className="sm:w-1/2">
        <div className="space-y-2">
          <Label htmlFor="zipCode" className="text-sm font-medium">
            ZIP Code *
          </Label>
          <Input
            id="zipCode"
            type="text"
            value={formData.zipCode || ''}
            onChange={handleZipCodeChange}
            placeholder="Enter ZIP code"
            maxLength={5}
            className={errors.zipCode ? 'border-red-300' : ''}
          />
          {errors.zipCode && <FormValidationError error={errors.zipCode} />}
          <p className="text-xs text-gray-500">
            Your location helps us determine regional market values
          </p>
        </div>
      </div>
    </div>
  );
}
