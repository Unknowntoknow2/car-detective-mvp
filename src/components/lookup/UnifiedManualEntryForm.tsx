
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ManualEntryFormData } from '@/types/manual-entry';

interface UnifiedManualEntryFormProps {
  mode?: 'free' | 'premium';
  onSubmit: (data: ManualEntryFormData) => void;
}

const UnifiedManualEntryForm: React.FC<UnifiedManualEntryFormProps> = ({ 
  mode = 'free', 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<ManualEntryFormData>({
    year: '',
    make: '',
    model: '',
    trim: '',
    mileage: '',
    condition: '',
    zipCode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof ManualEntryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Vehicle Entry {mode === 'premium' && '(Premium)'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                placeholder="2020"
                min="1990"
                max="2024"
                required
              />
            </div>
            <div>
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleChange('make', e.target.value)}
                placeholder="Toyota"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
                placeholder="Camry"
                required
              />
            </div>
            <div>
              <Label htmlFor="trim">Trim</Label>
              <Input
                id="trim"
                value={formData.trim}
                onChange={(e) => handleChange('trim', e.target.value)}
                placeholder="LE"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => handleChange('mileage', e.target.value)}
                placeholder="50000"
                required
              />
            </div>
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Select value={formData.condition} onValueChange={(value) => handleChange('condition', value)}>
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
          </div>
          
          <div>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              placeholder="12345"
              maxLength={5}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Get Valuation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UnifiedManualEntryForm;
