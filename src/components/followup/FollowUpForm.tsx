
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FollowUpAnswers } from '@/types/follow-up-answers';

export interface FollowUpFormData {
  vin: string;
  mileage: number;
  condition: string;
  zipCode: string;
  previousUse: string;
  exteriorCondition: string;
  interiorCondition: string;
  tireCondition: string;
  serviceHistory: string;
  accidentHistory: boolean;
  additionalNotes: string;
}

interface FollowUpFormProps {
  vin: string;
  onSubmit: (data: FollowUpFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function FollowUpForm({ 
  vin, 
  onSubmit, 
  onCancel,
  isLoading = false 
}: FollowUpFormProps) {
  const [formData, setFormData] = useState<FollowUpFormData>({
    vin,
    mileage: 0,
    condition: 'good',
    zipCode: '',
    previousUse: 'personal',
    exteriorCondition: 'good',
    interiorCondition: 'good',
    tireCondition: 'good',
    serviceHistory: 'unknown',
    accidentHistory: false,
    additionalNotes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof FollowUpFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVehicleUsageChange = (value: string) => {
    setFormData(prev => ({ ...prev, previousUse: value }));
  };

  const handleConditionChange = (conditionType: keyof FollowUpFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [conditionType]: value
    }));
  };

  const validateForm = (data: FollowUpFormData): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    if (!data.zipCode || data.zipCode.length !== 5) {
      newErrors.zipCode = 'Please enter a valid 5-digit ZIP code';
    }
    
    if (!data.mileage || data.mileage <= 0) {
      newErrors.mileage = 'Please enter a valid mileage';
    }
    
    return newErrors;
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
        <CardTitle>Vehicle Follow-up Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="mileage">Current Mileage</Label>
              <Input
                type="number"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                placeholder="Enter mileage"
              />
              {errors.mileage && <p className="text-red-500 text-sm">{errors.mileage}</p>}
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="Enter ZIP code"
                maxLength={5}
              />
              {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
            </div>
          </div>

          <div>
            <Label>Overall Condition</Label>
            <Select 
              value={formData.condition} 
              onValueChange={(value) => handleInputChange('condition', value)}
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
            <Label>Previous Use</Label>
            <Select 
              value={formData.previousUse} 
              onValueChange={handleVehicleUsageChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select previous use" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="rental">Rental</SelectItem>
                <SelectItem value="fleet">Fleet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Exterior Condition</Label>
            <Select 
              value={formData.exteriorCondition} 
              onValueChange={(value) => handleConditionChange('exteriorCondition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select exterior condition" />
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
            <Label>Service History</Label>
            <Select 
              value={formData.serviceHistory} 
              onValueChange={(value) => handleInputChange('serviceHistory', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service history" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dealer">Dealer maintained</SelectItem>
                <SelectItem value="independent">Independent mechanic</SelectItem>
                <SelectItem value="owner">Owner maintained</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              placeholder="Any additional information about the vehicle"
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-6">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
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
