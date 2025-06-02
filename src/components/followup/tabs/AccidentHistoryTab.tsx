
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FollowUpAnswers, AccidentDetails } from '@/types/follow-up-answers';

interface AccidentHistoryTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function AccidentHistoryTab({ formData, updateFormData }: AccidentHistoryTabProps) {
  const accidentData: AccidentDetails = formData.accident_history || {
    hadAccident: false,
    count: 0,
    location: '',
    severity: 'minor',
    repaired: false,
    frameDamage: false,
    description: ''
  };

  const handleAccidentToggle = (value: string) => {
    const hadAccident = value === 'yes';
    updateFormData({
      accident_history: {
        ...accidentData,
        hadAccident,
        ...(hadAccident ? {} : {
          count: 0,
          location: '',
          severity: 'minor',
          repaired: false,
          frameDamage: false,
          description: ''
        })
      }
    });
  };

  const handleAccidentFieldChange = (field: keyof AccidentDetails, value: any) => {
    updateFormData({
      accident_history: {
        ...accidentData,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🚗</span>
            Accident History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Has this vehicle been in any accidents?</Label>
            <RadioGroup
              value={accidentData.hadAccident ? 'yes' : 'no'}
              onValueChange={handleAccidentToggle}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no-accidents" />
                <Label htmlFor="no-accidents">No Accidents</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="has-accidents" />
                <Label htmlFor="has-accidents">Yes, has been in accident(s)</Label>
              </div>
            </RadioGroup>
          </div>

          {accidentData.hadAccident && (
            <div className="space-y-4 pl-6 border-l-2 border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accident-count">Number of Accidents</Label>
                  <Input
                    id="accident-count"
                    type="number"
                    min="1"
                    max="10"
                    value={accidentData.count || ''}
                    onChange={(e) => handleAccidentFieldChange('count', parseInt(e.target.value) || 0)}
                    placeholder="e.g., 1"
                  />
                </div>

                <div>
                  <Label htmlFor="accident-severity">Severity</Label>
                  <Select
                    value={accidentData.severity || 'minor'}
                    onValueChange={(value: 'minor' | 'moderate' | 'severe') => 
                      handleAccidentFieldChange('severity', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor (Cosmetic damage)</SelectItem>
                      <SelectItem value="moderate">Moderate (Structural damage)</SelectItem>
                      <SelectItem value="severe">Severe (Major damage)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="accident-location">Area of Damage</Label>
                <Input
                  id="accident-location"
                  value={accidentData.location || ''}
                  onChange={(e) => handleAccidentFieldChange('location', e.target.value)}
                  placeholder="e.g., Front bumper, driver side door, rear quarter panel"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="accident-repaired"
                    checked={accidentData.repaired || false}
                    onCheckedChange={(checked) => handleAccidentFieldChange('repaired', checked)}
                  />
                  <Label htmlFor="accident-repaired">
                    Accident damage has been properly repaired
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="frame-damage"
                    checked={accidentData.frameDamage || false}
                    onCheckedChange={(checked) => handleAccidentFieldChange('frameDamage', checked)}
                  />
                  <Label htmlFor="frame-damage">
                    Accident involved frame/structural damage
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="accident-description">Accident Details</Label>
                <Textarea
                  id="accident-description"
                  value={accidentData.description || ''}
                  onChange={(e) => handleAccidentFieldChange('description', e.target.value)}
                  placeholder="Describe the accident, repairs performed, insurance claims, etc."
                  rows={3}
                />
              </div>

              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">
                  <strong>Impact on Value:</strong> Accidents typically reduce vehicle value. 
                  The impact depends on severity, quality of repairs, and whether frame damage occurred.
                  {accidentData.frameDamage && (
                    <span className="block mt-1">
                      <strong>Frame damage significantly reduces value.</strong>
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
