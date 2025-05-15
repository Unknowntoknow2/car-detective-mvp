
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { manualEntrySchema, validateForm } from '@/components/form/validation';
import { ManualEntryFormData } from './types/manualEntry';
import { VehicleFormTooltip } from '@/components/form/VehicleFormToolTip';

interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
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
  const [formData, setFormData] = useState<ManualEntryFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    condition: 'Good',
    zipCode: '',
    trim: '',
    color: '',
    features: []
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field if it exists
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }
  };
  
  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field if it exists
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('MANUAL ENTRY: Validating form data', formData);
    
    // Validate the form data
    const validation = validateForm(manualEntrySchema, formData);
    
    if (!validation.success) {
      console.log('MANUAL ENTRY: Validation failed', validation.errors);
      setValidationErrors(validation.errors || {});
      return;
    }
    
    // Clear validation errors
    setValidationErrors({});
    
    // Log form submission
    console.log('MANUAL ENTRY: Form submitted successfully', formData);
    
    // Call the onSubmit handler
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">
            Make
          </Label>
          <Input
            id="make"
            name="make"
            value={formData.make}
            onChange={handleChange}
            placeholder="e.g., Toyota"
            className={validationErrors.make ? 'border-red-500' : ''}
          />
          {validationErrors.make && (
            <p className="text-sm text-red-500">{validationErrors.make}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">
            Model
          </Label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="e.g., Camry"
            className={validationErrors.model ? 'border-red-500' : ''}
          />
          {validationErrors.model && (
            <p className="text-sm text-red-500">{validationErrors.model}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">
            Year
          </Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            placeholder="e.g., 2019"
            className={validationErrors.year ? 'border-red-500' : ''}
          />
          {validationErrors.year && (
            <p className="text-sm text-red-500">{validationErrors.year}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mileage">
            Mileage
          </Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            value={formData.mileage}
            onChange={handleChange}
            placeholder="e.g., 45000"
            className={validationErrors.mileage ? 'border-red-500' : ''}
          />
          {validationErrors.mileage && (
            <p className="text-sm text-red-500">{validationErrors.mileage}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="condition">Condition</Label>
            <VehicleFormTooltip 
              content="Vehicle condition affects valuation significantly. Be honest for the most accurate estimate."
            />
          </div>
          <Select
            value={formData.condition}
            onValueChange={(value) => handleSelectChange('condition', value)}
          >
            <SelectTrigger 
              id="condition"
              className={validationErrors.condition ? 'border-red-500' : ''}
            >
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.condition && (
            <p className="text-sm text-red-500">{validationErrors.condition}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <VehicleFormTooltip 
            content="Your ZIP code helps us provide a more accurate valuation based on local market conditions."
          />
        </div>
        <Input
          id="zipCode"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          placeholder="e.g., 90210"
          className={validationErrors.zipCode ? 'border-red-500' : ''}
        />
        {validationErrors.zipCode && (
          <p className="text-sm text-red-500">{validationErrors.zipCode}</p>
        )}
      </div>
      
      {isPremium && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trim">Trim (Optional)</Label>
              <Input
                id="trim"
                name="trim"
                value={formData.trim}
                onChange={handleChange}
                placeholder="e.g., SE, Limited"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Color (Optional)</Label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g., Blue, Silver"
              />
            </div>
          </div>
        </>
      )}
      
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          submitButtonText
        )}
      </Button>
    </form>
  );
};

export default ManualEntryForm;
