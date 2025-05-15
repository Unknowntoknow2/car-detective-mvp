
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConditionLevel, ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { AutoCompleteVehicleSelector } from '@/components/lookup/form-parts/AutoCompleteVehicleSelector';
import { ZipCodeInput } from '@/components/lookup/form-parts/ZipCodeInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PremiumManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
}

const PremiumManualEntryForm: React.FC<PremiumManualEntryFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ManualEntryFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    condition: ConditionLevel.Good,
    zipCode: '',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    vin: '',
    valuationId: '',
    confidenceScore: 0,
    accident: false, // Changed from string to boolean
    accidentDetails: {
      count: '0',
      severity: 'Minor',
      area: ''
    },
    selectedFeatures: []
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMakeChange = (make: string) => {
    setFormData(prev => ({ ...prev, make }));
  };

  const handleModelChange = (model: string) => {
    setFormData(prev => ({ ...prev, model }));
  };

  const handleZipCodeChange = (zipCode: string) => {
    setFormData(prev => ({ ...prev, zipCode }));
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const current = formData.selectedFeatures || [];
    const updated = checked
      ? [...current, feature]
      : current.filter(f => f !== feature);
    setFormData(prev => ({ ...prev, selectedFeatures: updated }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.make) errors.make = 'Make is required';
    if (!formData.model) errors.model = 'Model is required';
    if (!formData.year) errors.year = 'Year is required';
    if (!formData.mileage) errors.mileage = 'Mileage is required';
    if (!formData.zipCode) errors.zipCode = 'ZIP Code is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Ensure numeric fields are properly converted
      const processedData = {
        ...formData,
        year: typeof formData.year === 'string' ? parseInt(formData.year) : formData.year,
        mileage: typeof formData.mileage === 'string' ? parseInt(formData.mileage as string) : formData.mileage
      };
      onSubmit(processedData);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i); // Changed to number array

  const features = [
    'Leather Seats',
    'Sunroof',
    'Navigation System',
    'Bluetooth',
    'Backup Camera',
    'Heated Seats',
    'Third Row Seating',
    'Premium Sound System'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Make & Model</Label>
          <AutoCompleteVehicleSelector
            selectedMake={formData.make}
            setSelectedMake={handleMakeChange}
            selectedModel={formData.model}
            setSelectedModel={handleModelChange}
            required
          />
          {validationErrors.make && <p className="text-sm text-red-500">{validationErrors.make}</p>}
          {validationErrors.model && <p className="text-sm text-red-500">{validationErrors.model}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Year</Label>
            <Select
              value={formData.year.toString()} // Convert to string for Select component
              onValueChange={(val) => handleSelectChange('year', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.year && <p className="text-sm text-red-500">{validationErrors.year}</p>}
          </div>

          <div>
            <Label>Mileage</Label>
            <Input
              name="mileage"
              type="number"
              value={formData.mileage}
              onChange={handleInputChange}
              placeholder="e.g. 45000"
            />
            {validationErrors.mileage && <p className="text-sm text-red-500">{validationErrors.mileage}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Condition</Label>
            <Select
              value={formData.condition}
              onValueChange={(val) => handleSelectChange('condition', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Condition" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ConditionLevel).map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>ZIP Code</Label>
            <ZipCodeInput
              zipCode={formData.zipCode}
              setZipCode={handleZipCodeChange}
            />
            {validationErrors.zipCode && <p className="text-sm text-red-500">{validationErrors.zipCode}</p>}
          </div>
        </div>

        <div>
          <Label>Features (Optional)</Label>
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={(formData.selectedFeatures || []).includes(feature)}
                  onCheckedChange={(checked) => handleFeatureChange(feature, !!checked)}
                />
                <Label htmlFor={`feature-${feature}`}>{feature}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
};

export default PremiumManualEntryForm;
