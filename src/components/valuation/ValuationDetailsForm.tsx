
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { UnifiedConditionSelector } from '@/components/common/UnifiedConditionSelector';
import { LoadingButton } from '@/components/common/UnifiedLoadingSystem';

interface ValuationDetailsFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

interface FormData {
  year: string;
  make: string;
  model: string;
  mileage: string;
  condition: string;
  zipCode: string;
  fuelType: string;
  transmission: string;
  accidents: boolean;
  modifications: boolean;
  serviceHistory: string;
}

export function ValuationDetailsForm({ onSubmit, isLoading = false }: ValuationDetailsFormProps) {
  const [formData, setFormData] = useState<FormData>({
    year: '',
    make: '',
    model: '',
    mileage: '',
    condition: 'good',
    zipCode: '',
    fuelType: 'gasoline',
    transmission: 'automatic',
    accidents: false,
    modifications: false,
    serviceHistory: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof FormData) => (value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => handleInputChange('year')(e.target.value)}
                placeholder="2020"
              />
            </div>

            <div>
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleInputChange('make')(e.target.value)}
                placeholder="Toyota"
              />
            </div>

            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model')(e.target.value)}
                placeholder="Camry"
              />
            </div>

            <div>
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage')(e.target.value)}
                placeholder="50000"
              />
            </div>
          </div>

          <div>
            <Label>Vehicle Condition</Label>
            <UnifiedConditionSelector
              type="overall"
              value={formData.condition}
              onChange={handleInputChange('condition')}
              variant="buttons"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode')(e.target.value)}
                placeholder="12345"
              />
            </div>

            <div>
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select value={formData.fuelType} onValueChange={handleInputChange('fuelType')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="transmission">Transmission</Label>
            <Select value={formData.transmission} onValueChange={handleInputChange('transmission')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="cvt">CVT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="accidents"
                checked={formData.accidents}
                onCheckedChange={(checked) => handleInputChange('accidents')(Boolean(checked))}
              />
              <Label htmlFor="accidents">Vehicle has been in accidents</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="modifications"
                checked={formData.modifications}
                onCheckedChange={(checked) => handleInputChange('modifications')(Boolean(checked))}
              />
              <Label htmlFor="modifications">Vehicle has modifications</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="serviceHistory">Service History</Label>
            <Textarea
              id="serviceHistory"
              value={formData.serviceHistory}
              onChange={(e) => handleInputChange('serviceHistory')(e.target.value)}
              placeholder="Describe the vehicle's service history..."
            />
          </div>

          <LoadingButton
            type="submit"
            isLoading={isLoading}
            loadingText="Getting Valuation..."
            className="w-full"
          >
            Get Valuation
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}
