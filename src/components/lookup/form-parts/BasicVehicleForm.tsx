
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMakeModels } from '@/hooks/useMakeModels';
import { ConditionLevel, ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { ValidationError } from '@/components/common/ValidationError';

interface BasicVehicleFormProps {
  formData: ManualEntryFormData;
  updateFormData: (updates: Partial<ManualEntryFormData>) => void;
  errors: Record<string, string>;
  isPremium?: boolean;
}

export const BasicVehicleForm: React.FC<BasicVehicleFormProps> = ({ 
  formData, 
  updateFormData, 
  errors, 
  isPremium 
}) => {
  const { makes, models, isLoading, getModelsByMake } = useMakeModels();
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  useEffect(() => {
    if (formData.make && formData.make !== selectedMake) {
      setSelectedMake(formData.make);
      setIsLoadingModels(true);
      
      getModelsByMake(formData.make).finally(() => {
        setIsLoadingModels(false);
      });
    }
  }, [formData.make, selectedMake, getModelsByMake]);

  const handleMakeChange = (value: string) => {
    updateFormData({ make: value, model: '' }); // Clear model when make changes
  };

  const handleModelChange = (value: string) => {
    updateFormData({ model: value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || new Date().getFullYear();
    updateFormData({ year: value });
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    updateFormData({ mileage: value });
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 5);
    updateFormData({ zipCode: value });
  };

  const handleConditionChange = (value: string) => {
    updateFormData({ condition: value as ConditionLevel });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Select onValueChange={handleMakeChange} value={formData.make}>
            <SelectTrigger>
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
          {errors.make && <ValidationError message={errors.make} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select 
            onValueChange={handleModelChange} 
            value={formData.model}
            disabled={!selectedMake || isLoadingModels}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                isLoadingModels ? "Loading..." : 
                !selectedMake ? "Select make first" : 
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
          {errors.model && <ValidationError message={errors.model} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input 
            id="year"
            type="number" 
            placeholder="e.g. 2020" 
            value={formData.year || ''}
            onChange={handleYearChange}
          />
          {errors.year && <ValidationError message={errors.year} />}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input 
            id="mileage"
            type="number" 
            placeholder="e.g. 50000" 
            value={formData.mileage || ''}
            onChange={handleMileageChange}
          />
          {errors.mileage && <ValidationError message={errors.mileage} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input 
            id="zipCode"
            placeholder="e.g. 90210" 
            value={formData.zipCode}
            onChange={handleZipCodeChange}
            maxLength={5}
          />
          {errors.zipCode && <ValidationError message={errors.zipCode} />}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="condition">Condition</Label>
        <Select 
          onValueChange={handleConditionChange}
          value={formData.condition}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ConditionLevel.Excellent}>Excellent</SelectItem>
            <SelectItem value={ConditionLevel.VeryGood}>Very Good</SelectItem>
            <SelectItem value={ConditionLevel.Good}>Good</SelectItem>
            <SelectItem value={ConditionLevel.Fair}>Fair</SelectItem>
            <SelectItem value={ConditionLevel.Poor}>Poor</SelectItem>
          </SelectContent>
        </Select>
        {errors.condition && <ValidationError message={errors.condition} />}
      </div>
    </div>
  );
};

export default BasicVehicleForm;
