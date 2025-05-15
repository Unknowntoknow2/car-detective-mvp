import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConditionLevel, ManualEntryFormData } from './types/manualEntry';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { AutoCompleteVehicleSelector } from './form-parts/AutoCompleteVehicleSelector';
import { ZipCodeInput } from './form-parts/ZipCodeInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ManualEntryFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    condition: ConditionLevel.Good,
    zipCode: '',
    trim: '',
    color: '',
    features: [],
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    accident: false,
    accidentDetails: {
      hasAccident: false,
      description: '',
      severity: 'Minor',
      repaired: true
    },
    selectedFeatures: []
  });

  const [hasAccident, setHasAccident] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value ? parseInt(value, 10) : 0 }));
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

  const handleAccidentChange = (checked: boolean) => {
    setHasAccident(checked);
    setFormData(prev => ({
      ...prev,
      accident: checked,
      accidentDetails: {
        ...prev.accidentDetails!,
        hasAccident: checked
      }
    }));
  };

  const handleAccidentDetailChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      accidentDetails: {
        ...prev.accidentDetails!,
        [field]: value
      }
    }));
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData(prev => {
      const currentFeatures = prev.selectedFeatures || [];
      const newFeatures = checked
        ? [...currentFeatures, feature]
        : currentFeatures.filter(f => f !== feature);
      
      return {
        ...prev,
        selectedFeatures: newFeatures
      };
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.make) errors.make = 'Make is required';
    if (!formData.model) errors.model = 'Model is required';
    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      errors.year = 'Please enter a valid year';
    }
    if (!formData.mileage && formData.mileage !== 0) errors.mileage = 'Mileage is required';
    if (!formData.zipCode) errors.zipCode = 'ZIP code is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  
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
          <Label htmlFor="make-model">Make & Model</Label>
          <AutoCompleteVehicleSelector
            selectedMake={formData.make}
            setSelectedMake={handleMakeChange}
            selectedModel={formData.model}
            setSelectedModel={handleModelChange}
            required
          />
          {validationErrors.make && <p className="text-sm text-red-500 mt-1">{validationErrors.make}</p>}
          {validationErrors.model && <p className="text-sm text-red-500 mt-1">{validationErrors.model}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="year">Year</Label>
            <Select
              value={formData.year.toString()}
              onValueChange={(value) => handleSelectChange('year', value)}
            >
              <SelectTrigger id="year">
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
            {validationErrors.year && <p className="text-sm text-red-500 mt-1">{validationErrors.year}</p>}
          </div>

          <div>
            <Label htmlFor="mileage">Mileage</Label>
            <Input
              id="mileage"
              name="mileage"
              type="number"
              value={formData.mileage || ''}
              onChange={handleNumberChange}
              placeholder="e.g. 45000"
              min="0"
            />
            {validationErrors.mileage && <p className="text-sm text-red-500 mt-1">{validationErrors.mileage}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select
              value={formData.condition}
              onValueChange={(value) => handleSelectChange('condition', value)}
            >
              <SelectTrigger id="condition">
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
            <Label htmlFor="zipCode">ZIP Code</Label>
            <ZipCodeInput
              zipCode={formData.zipCode}
              setZipCode={handleZipCodeChange}
            />
            {validationErrors.zipCode && <p className="text-sm text-red-500 mt-1">{validationErrors.zipCode}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="trim">Trim Level (Optional)</Label>
            <Input
              id="trim"
              name="trim"
              value={formData.trim || ''}
              onChange={handleInputChange}
              placeholder="e.g. EX-L, Sport, etc."
            />
          </div>

          <div>
            <Label htmlFor="color">Color (Optional)</Label>
            <Input
              id="color"
              name="color"
              value={formData.color || ''}
              onChange={handleInputChange}
              placeholder="e.g. Silver, Black, etc."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select
              value={formData.fuelType || 'Gasoline'}
              onValueChange={(value) => handleSelectChange('fuelType', value)}
            >
              <SelectTrigger id="fuelType">
                <SelectValue placeholder="Select Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gasoline">Gasoline</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="transmission">Transmission</Label>
            <Select
              value={formData.transmission || 'Automatic'}
              onValueChange={(value) => handleSelectChange('transmission', value)}
            >
              <SelectTrigger id="transmission">
                <SelectValue placeholder="Select Transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="CVT">CVT</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox 
              id="accident" 
              checked={hasAccident}
              onCheckedChange={handleAccidentChange}
            />
            <Label htmlFor="accident" className="cursor-pointer">Has this vehicle been in an accident?</Label>
          </div>
          
          {hasAccident && (
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div>
                  <Label htmlFor="accidentSeverity">Severity</Label>
                  <RadioGroup 
                    value={formData.accidentDetails?.severity || 'Minor'}
                    onValueChange={(value) => handleAccidentDetailChange('severity', value)}
                    className="flex space-x-4 mt-1"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="Minor" id="severity-minor" />
                      <Label htmlFor="severity-minor">Minor</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="Moderate" id="severity-moderate" />
                      <Label htmlFor="severity-moderate">Moderate</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="Severe" id="severity-severe" />
                      <Label htmlFor="severity-severe">Severe</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="accidentDescription">Description (Optional)</Label>
                  <Textarea
                    id="accidentDescription"
                    value={formData.accidentDetails?.description || ''}
                    onChange={(e) => handleAccidentDetailChange('description', e.target.value)}
                    placeholder="Briefly describe the accident..."
                    className="resize-none"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="repaired" 
                    checked={formData.accidentDetails?.repaired || false}
                    onCheckedChange={(checked) => handleAccidentDetailChange('repaired', checked)}
                  />
                  <Label htmlFor="repaired" className="cursor-pointer">Has the damage been repaired?</Label>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Label className="mb-2 block">Features (Optional)</Label>
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox 
                  id={`feature-${feature}`} 
                  checked={(formData.selectedFeatures || []).includes(feature)}
                  onCheckedChange={(checked) => handleFeatureChange(feature, !!checked)}
                />
                <Label htmlFor={`feature-${feature}`} className="cursor-pointer">{feature}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
};

export default ManualEntryForm;
