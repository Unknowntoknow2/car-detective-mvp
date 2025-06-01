
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface AccidentsTabProps {
  formData: FollowUpAnswers;
  onAccidentsChange: (accidentData: any) => void;
}

export function AccidentsTab({ formData, onAccidentsChange }: AccidentsTabProps) {
  const hasAccident = formData.accident_history?.hadAccident || formData.accidents?.hadAccident;
  
  const handleAccidentStatusChange = (hasAccident: boolean) => {
    const accidentData = {
      hadAccident,
      count: hasAccident ? 1 : 0,
      severity: hasAccident ? 'minor' : undefined,
      repaired: hasAccident ? false : undefined,
      frameDamage: false,
      description: ''
    };
    onAccidentsChange(accidentData);
  };

  const handleAccidentDetailsChange = (field: string, value: any) => {
    const currentData = formData.accident_history || formData.accidents || { hadAccident: false };
    const updatedData = {
      ...currentData,
      [field]: value
    };
    onAccidentsChange(updatedData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Accident History</h2>
          <p className="text-gray-600">Information about any accidents or damage</p>
        </div>
      </div>

      {/* Primary Question */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Has this vehicle been in any accidents?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={hasAccident ? 'yes' : 'no'}
            onValueChange={(value) => handleAccidentStatusChange(value === 'yes')}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-accident" />
              <Label htmlFor="no-accident" className="flex items-center cursor-pointer">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                No accidents
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-accident" />
              <Label htmlFor="yes-accident" className="flex items-center cursor-pointer">
                <XCircle className="h-4 w-4 mr-1 text-red-500" />
                Yes, there have been accidents
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Accident Details */}
      {hasAccident && (
        <div className="space-y-4">
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-orange-700">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Accident Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="severity">Accident Severity</Label>
                <Select 
                  value={formData.accident_history?.severity || formData.accidents?.severity || ''}
                  onValueChange={(value) => handleAccidentDetailsChange('severity', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor (cosmetic damage only)</SelectItem>
                    <SelectItem value="moderate">Moderate (some structural damage)</SelectItem>
                    <SelectItem value="severe">Severe (major structural damage)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Was the damage repaired?</Label>
                  <RadioGroup
                    value={
                      (formData.accident_history?.repaired || formData.accidents?.repaired) !== undefined
                        ? (formData.accident_history?.repaired || formData.accidents?.repaired) ? 'yes' : 'no'
                        : ''
                    }
                    onValueChange={(value) => handleAccidentDetailsChange('repaired', value === 'yes')}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="repaired-yes" />
                      <Label htmlFor="repaired-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="repaired-no" />
                      <Label htmlFor="repaired-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Any frame damage?</Label>
                  <RadioGroup
                    value={
                      (formData.accident_history?.frameDamage || formData.accidents?.frameDamage) !== undefined
                        ? (formData.accident_history?.frameDamage || formData.accidents?.frameDamage) ? 'yes' : 'no'
                        : ''
                    }
                    onValueChange={(value) => handleAccidentDetailsChange('frameDamage', value === 'yes')}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="frame-no" />
                      <Label htmlFor="frame-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="frame-yes" />
                      <Label htmlFor="frame-yes">Yes</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the accident, location of damage, repairs done, etc."
                  value={formData.accident_history?.description || formData.accidents?.description || ''}
                  onChange={(e) => handleAccidentDetailsChange('description', e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
