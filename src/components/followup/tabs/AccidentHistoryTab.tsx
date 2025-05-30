
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, Shield } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface AccidentHistoryTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function AccidentHistoryTab({ formData, updateFormData }: AccidentHistoryTabProps) {
  const hasAccident = formData.accident_history?.hadAccident ?? false;

  const handleAccidentChange = (value: string) => {
    const hadAccident = value === 'yes';
    updateFormData({
      accident_history: {
        ...formData.accident_history,
        hadAccident,
        count: hadAccident ? formData.accident_history?.count || 1 : 0,
        severity: hadAccident ? formData.accident_history?.severity || 'minor' : undefined,
        repaired: hadAccident ? formData.accident_history?.repaired || false : undefined,
        frameDamage: hadAccident ? formData.accident_history?.frameDamage || false : undefined,
        description: hadAccident ? formData.accident_history?.description || '' : '',
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Accident History</h2>
          <p className="text-gray-600">Accident history significantly impacts vehicle value</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Accident Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Has this vehicle been in any accidents?</Label>
            <RadioGroup
              value={hasAccident ? 'yes' : 'no'}
              onValueChange={handleAccidentChange}
              className="flex space-x-6 mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no-accident" />
                <Label htmlFor="no-accident" className="font-normal">No accidents</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes-accident" />
                <Label htmlFor="yes-accident" className="font-normal">Yes, has accident history</Label>
              </div>
            </RadioGroup>
          </div>

          {!hasAccident && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Clean Accident History</span>
              </div>
              <p className="text-green-700 mt-1">
                No accident history helps maintain higher resale value
              </p>
            </div>
          )}

          {hasAccident && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="severity">Accident Severity</Label>
                <Select 
                  value={formData.accident_history?.severity || 'minor'} 
                  onValueChange={(value: 'minor' | 'moderate' | 'severe') => 
                    updateFormData({
                      accident_history: {
                        ...formData.accident_history,
                        hadAccident: true,
                        severity: value
                      }
                    })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor (cosmetic damage only)</SelectItem>
                    <SelectItem value="moderate">Moderate (required repairs)</SelectItem>
                    <SelectItem value="severe">Severe (structural damage)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium">Was the damage properly repaired?</Label>
                <RadioGroup
                  value={formData.accident_history?.repaired ? 'yes' : 'no'}
                  onValueChange={(value) => 
                    updateFormData({
                      accident_history: {
                        ...formData.accident_history,
                        hadAccident: true,
                        repaired: value === 'yes'
                      }
                    })
                  }
                  className="flex space-x-6 mt-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="repaired-yes" />
                    <Label htmlFor="repaired-yes" className="font-normal">Yes, properly repaired</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="repaired-no" />
                    <Label htmlFor="repaired-no" className="font-normal">No or unknown</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the accident and any repairs performed..."
                  value={formData.accident_history?.description || ''}
                  onChange={(e) => 
                    updateFormData({
                      accident_history: {
                        ...formData.accident_history,
                        hadAccident: true,
                        description: e.target.value
                      }
                    })
                  }
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
