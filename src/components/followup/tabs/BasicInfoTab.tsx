
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface BasicInfoTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function BasicInfoTab({ formData, updateFormData }: BasicInfoTabProps) {
  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    updateFormData({ mileage: value ? parseInt(value) : 0 });
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5); // Only digits, max 5
    updateFormData({ zip_code: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📍 Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mileage" className="text-sm font-medium">
              Current Mileage <span className="text-red-500">*</span>
            </Label>
            <Input
              id="mileage"
              type="text"
              value={formData.mileage ? formData.mileage.toString() : ''}
              onChange={handleMileageChange}
              placeholder="Enter current mileage"
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the current odometer reading
            </p>
          </div>
          
          <div>
            <Label htmlFor="zip_code" className="text-sm font-medium">
              ZIP Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="zip_code"
              type="text"
              value={formData.zip_code || ''}
              onChange={handleZipCodeChange}
              placeholder="Enter your ZIP code"
              className="mt-1"
              required
              maxLength={5}
            />
            <p className="text-xs text-gray-500 mt-1">
              Used for local market analysis
            </p>
          </div>

          <div>
            <Label htmlFor="condition" className="text-sm font-medium">
              Overall Condition <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.condition || ''} 
              onValueChange={(value) => updateFormData({ condition: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Select the overall condition of your vehicle
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
