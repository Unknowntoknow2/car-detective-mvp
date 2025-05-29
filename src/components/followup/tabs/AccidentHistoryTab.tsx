
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Shield } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface AccidentHistoryTabProps {
  formData: FollowUpAnswers;
  onUpdate: (updates: Partial<FollowUpAnswers>) => void;
}

export function AccidentHistoryTab({ formData, onUpdate }: AccidentHistoryTabProps) {
  const handleAccidentChange = (value: string) => {
    const hadAccident = value === 'yes';
    onUpdate({
      accidents: {
        ...formData.accidents,
        hadAccident,
        // Reset other fields if no accident
        ...(hadAccident ? {} : {
          count: undefined,
          location: undefined,
          severity: undefined,
          repaired: undefined,
          frameDamage: undefined,
          description: ''
        })
      }
    });
  };

  const updateAccidentDetails = (field: string, value: any) => {
    onUpdate({
      accidents: {
        ...formData.accidents,
        [field]: value
      }
    });
  };

  const hasAccident = formData.accidents?.hadAccident;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Accident History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Has Accident */}
          <div>
            <Label className="text-base font-medium">Has this vehicle been in any accidents?</Label>
            <RadioGroup
              value={hasAccident ? 'yes' : 'no'}
              onValueChange={handleAccidentChange}
              className="flex gap-6 mt-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no-accident" />
                <Label htmlFor="no-accident" className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  No accidents
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="has-accident" />
                <Label htmlFor="has-accident" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Yes, has accident history
                </Label>
              </div>
            </RadioGroup>
          </div>

          {hasAccident && (
            <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
              {/* Number of Accidents */}
              <div>
                <Label htmlFor="accident-count">Number of accidents</Label>
                <Select
                  value={formData.accidents?.count?.toString() || ''}
                  onValueChange={(value) => updateAccidentDetails('count', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 accident</SelectItem>
                    <SelectItem value="2">2 accidents</SelectItem>
                    <SelectItem value="3">3 accidents</SelectItem>
                    <SelectItem value="4">4+ accidents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Accident Location */}
              <div>
                <Label htmlFor="accident-location">Primary damage location</Label>
                <Select
                  value={formData.accidents?.location || ''}
                  onValueChange={(value) => updateAccidentDetails('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="front">Front end</SelectItem>
                    <SelectItem value="rear">Rear end</SelectItem>
                    <SelectItem value="side">Side impact</SelectItem>
                    <SelectItem value="multiple">Multiple areas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Accident Severity */}
              <div>
                <Label htmlFor="accident-severity">Accident severity</Label>
                <Select
                  value={formData.accidents?.severity || ''}
                  onValueChange={(value) => updateAccidentDetails('severity', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor (cosmetic damage only)</SelectItem>
                    <SelectItem value="moderate">Moderate (structural repair needed)</SelectItem>
                    <SelectItem value="major">Major (airbags deployed, extensive damage)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Repaired Status */}
              <div>
                <Label>Was the damage professionally repaired?</Label>
                <RadioGroup
                  value={formData.accidents?.repaired ? 'yes' : 'no'}
                  onValueChange={(value) => updateAccidentDetails('repaired', value === 'yes')}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="repaired-yes" />
                    <Label htmlFor="repaired-yes">Yes, professionally repaired</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="repaired-no" />
                    <Label htmlFor="repaired-no">No / DIY repair</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Frame Damage */}
              <div>
                <Label>Any frame or structural damage?</Label>
                <RadioGroup
                  value={formData.accidents?.frameDamage ? 'yes' : 'no'}
                  onValueChange={(value) => updateAccidentDetails('frameDamage', value === 'yes')}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="frame-no" />
                    <Label htmlFor="frame-no">No frame damage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="frame-yes" />
                    <Label htmlFor="frame-yes">Yes, frame damage reported</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="accident-description">Additional details (optional)</Label>
                <Textarea
                  id="accident-description"
                  placeholder="Describe the accident circumstances, repairs made, insurance claims, etc."
                  value={formData.accidents?.description || ''}
                  onChange={(e) => updateAccidentDetails('description', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {!hasAccident && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-800">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Clean accident history</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                No reported accidents help maintain higher resale value
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
