import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FollowUpFormProps {
  vin?: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

interface FollowUpFormData {
  vin: string;
  zipCode: string;
  mileage: number;
  condition: string;
  transmission: string;
  titleStatus: string;
  previousUse: string;
  previousOwners: number;
  serviceHistory: string;
}

const defaultFormData: FollowUpFormData = {
  vin: '',
  zipCode: '',
  mileage: 0,
  condition: 'good',
  transmission: 'automatic',
  titleStatus: 'clean',
  previousUse: 'personal',
  previousOwners: 1,
  serviceHistory: 'yes',
};

export function FollowUpForm({ 
  vin, 
  onSubmit, 
  onCancel,
  isLoading = false 
}: FollowUpFormProps) {
  const [formData, setFormData] = useState<FollowUpFormData>({
    ...defaultFormData,
    vin: vin || '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVehicleUsageChange = (value: string) => {
    setFormData(prev => ({ ...prev, previousUse: value as any }));
  };

  const handleConditionChange = (conditionType: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [conditionType]: value
    }));
  };

  const validateField = (fieldName: string, value: string) => {
    switch (fieldName) {
      case 'zipCode':
        if (!/^\d{5}(-\d{4})?$/.test(value)) {
          return 'Invalid ZIP code';
        }
        break;
      case 'mileage':
        if (isNaN(Number(value)) || Number(value) < 0) {
          return 'Mileage must be a positive number';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const validateForm = (data: FollowUpFormData) => {
    const errors: { [key: string]: string } = {};
    for (const key in data) {
      const error = validateField(key, String(data[key]));
      if (error) {
        errors[key] = error;
      }
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Submit error:', error);
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Vehicle Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vin">VIN</Label>
            <Input
              type="text"
              id="vin"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
            />
            {errors.zipCode && <p className="text-red-500">{errors.zipCode}</p>}
          </div>
          <div>
            <Label htmlFor="mileage">Mileage</Label>
            <Input
              type="number"
              id="mileage"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
            />
            {errors.mileage && <p className="text-red-500">{errors.mileage}</p>}
          </div>
          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select
              id="condition"
              name="condition"
              value={formData.condition}
              onValueChange={(value) => handleConditionChange('condition', value)}
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
            <Label htmlFor="transmission">Transmission</Label>
            <Select
              id="transmission"
              name="transmission"
              value={formData.transmission}
              onValueChange={(value) => handleChange({ target: { name: 'transmission', value } } as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="titleStatus">Title Status</Label>
            <Select
              id="titleStatus"
              name="titleStatus"
              value={formData.titleStatus}
              onValueChange={(value) => handleChange({ target: { name: 'titleStatus', value } } as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select title status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clean">Clean</SelectItem>
                <SelectItem value="salvage">Salvage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="previousUse">Previous Use</Label>
            <Select
              id="previousUse"
              name="previousUse"
              value={formData.previousUse}
              onValueChange={(value) => handleVehicleUsageChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select previous use" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="rental">Rental</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="previousOwners">Previous Owners</Label>
            <Input
              type="number"
              id="previousOwners"
              name="previousOwners"
              value={formData.previousOwners}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="serviceHistory">Service History</Label>
            <Select
              id="serviceHistory"
              name="serviceHistory"
              value={formData.serviceHistory}
              onValueChange={(value) => handleChange({ target: { name: 'serviceHistory', value } } as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service history" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            {onCancel && (
              <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default FollowUpForm;
