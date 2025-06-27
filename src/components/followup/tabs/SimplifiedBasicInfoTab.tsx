
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { EnhancedZipCodeInput } from '../inputs/EnhancedZipCodeInput';
import { SimpleMileageInput } from '../inputs/SimpleMileageInput';

interface SimplifiedBasicInfoTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const conditionOptions = [
  { value: 'excellent', label: 'Excellent', description: 'Like new, no visible wear' },
  { value: 'good', label: 'Good', description: 'Normal wear, good condition' },
  { value: 'fair', label: 'Fair', description: 'Noticeable wear, some issues' },
  { value: 'poor', label: 'Poor', description: 'Significant issues present' }
];

export function SimplifiedBasicInfoTab({ formData, updateFormData }: SimplifiedBasicInfoTabProps) {
  return (
    <div className="space-y-6">
      {/* Vehicle Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Vehicle Location
          </CardTitle>
          <p className="text-sm text-gray-600">Location affects market value and demand</p>
        </CardHeader>
        <CardContent>
          <EnhancedZipCodeInput
            value={formData.zip_code || ''}
            onChange={(value) => updateFormData({ zip_code: value })}
            required
          />
        </CardContent>
      </Card>

      {/* Current Mileage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Mileage</CardTitle>
          <p className="text-sm text-gray-600">Actual odometer reading</p>
        </CardHeader>
        <CardContent>
          <SimpleMileageInput
            value={formData.mileage || 0}
            onChange={(value) => updateFormData({ mileage: value })}
            required
          />
        </CardContent>
      </Card>

      {/* Overall Vehicle Condition */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overall Vehicle Condition</CardTitle>
          <p className="text-sm text-gray-600">General assessment of the vehicle's condition</p>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="text-sm font-medium">
              Condition Rating <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.condition || ''} 
              onValueChange={(value) => updateFormData({ condition: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {conditionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-sm text-gray-500">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
