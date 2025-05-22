
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateVIN } from '@/utils/validation/vin-validation';

interface ManualEntryFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ 
  onSubmit, 
  isLoading = false,
  submitButtonText = "Get Valuation",
  isPremium = false
}) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear().toString(),
    mileage: '',
    condition: 'good',
    zipCode: '',
    vin: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user changes a field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.make) newErrors.make = 'Make is required';
    if (!formData.model) newErrors.model = 'Model is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.mileage) newErrors.mileage = 'Mileage is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    
    // If VIN is provided, validate it
    if (formData.vin) {
      const vinValidation = validateVIN(formData.vin);
      if (!vinValidation.isValid) {
        newErrors.vin = vinValidation.error || 'Invalid VIN';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert year and mileage to numbers
      const submitData = {
        ...formData,
        year: parseInt(formData.year, 10),
        mileage: parseInt(formData.mileage, 10)
      };
      
      onSubmit(submitData);
    }
  };
  
  // Generate a list of years from current year down to 1980
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1979 }, (_, i) => currentYear - i);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            value={formData.make}
            onChange={(e) => handleChange('make', e.target.value)}
            placeholder="e.g. Toyota"
            className={errors.make ? 'border-red-500' : ''}
          />
          {errors.make && <p className="text-red-500 text-sm">{errors.make}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
            placeholder="e.g. Camry"
            className={errors.model ? 'border-red-500' : ''}
          />
          {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select
            value={formData.year}
            onValueChange={(value) => handleChange('year', value)}
          >
            <SelectTrigger id="year" className={errors.year ? 'border-red-500' : ''}>
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
          {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage}
            onChange={(e) => handleChange('mileage', e.target.value)}
            placeholder="e.g. 50000"
            min="0"
            className={errors.mileage ? 'border-red-500' : ''}
          />
          {errors.mileage && <p className="text-red-500 text-sm">{errors.mileage}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select
            value={formData.condition}
            onValueChange={(value) => handleChange('condition', value)}
          >
            <SelectTrigger id="condition">
              <SelectValue placeholder="Select Condition" />
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
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            placeholder="e.g. 90210"
            maxLength={5}
            className={errors.zipCode ? 'border-red-500' : ''}
          />
          {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="vin">VIN (Optional)</Label>
        <Input
          id="vin"
          value={formData.vin}
          onChange={(e) => handleChange('vin', e.target.value.toUpperCase())}
          placeholder="e.g. 1HGCM82633A004352"
          maxLength={17}
          className={errors.vin ? 'border-red-500' : ''}
        />
        {errors.vin && <p className="text-red-500 text-sm">{errors.vin}</p>}
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Processing...' : submitButtonText}
      </Button>
    </form>
  );
};

export default ManualEntryForm;
