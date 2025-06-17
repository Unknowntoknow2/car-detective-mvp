
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ManualEntryFormData } from '@/types/manual-entry';

interface ManualFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
}

export const ManualForm: React.FC<ManualFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<Partial<ManualEntryFormData>>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    condition: 'good',
    zipCode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.make || !formData.model || !formData.year) {
      return;
    }
    
    onSubmit(formData as ManualEntryFormData);
  };

  const updateFormData = (field: keyof ManualEntryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            value={formData.make || ''}
            onChange={(e) => updateFormData('make', e.target.value)}
            placeholder="e.g., Toyota"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={formData.model || ''}
            onChange={(e) => updateFormData('model', e.target.value)}
            placeholder="e.g., Camry"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year">Year</Label>
          <Select 
            value={formData.year?.toString()} 
            onValueChange={(value) => updateFormData('year', parseInt(value))}
          >
            <SelectTrigger>
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
        </div>
        
        <div>
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage || ''}
            onChange={(e) => updateFormData('mileage', parseInt(e.target.value) || 0)}
            placeholder="Miles"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="condition">Condition</Label>
          <Select 
            value={formData.condition} 
            onValueChange={(value) => updateFormData('condition', value)}
          >
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
        
        <div>
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={formData.zipCode || ''}
            onChange={(e) => updateFormData('zipCode', e.target.value)}
            placeholder="12345"
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={!formData.make || !formData.model || !formData.year || isLoading}
        className="w-full"
      >
        {isLoading ? 'Processing...' : 'Get Valuation'}
      </Button>
    </form>
  );
};

export default ManualForm;
