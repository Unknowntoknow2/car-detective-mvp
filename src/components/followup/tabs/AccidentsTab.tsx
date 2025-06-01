
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FollowUpAnswers, AccidentDetails } from '@/types/follow-up-answers';

interface AccidentsTabProps {
  formData: FollowUpAnswers;
  onAccidentsChange: (accidentData: AccidentDetails) => void;
}

export function AccidentsTab({ formData, onAccidentsChange }: AccidentsTabProps) {
  const accidentData = formData.accident_history || {
    hadAccident: false,
    count: 0,
    location: '',
    severity: 'minor' as const,
    repaired: false,
    frameDamage: false,
    description: ''
  };

  const hasAccident = accidentData.hadAccident;

  const handleAccidentToggle = (checked: boolean) => {
    const updatedData = {
      ...accidentData,
      hadAccident: checked,
      ...(checked ? {} : {
        count: 0,
        location: '',
        severity: 'minor' as const,
        repaired: false,
        frameDamage: false,
        description: ''
      })
    };
    onAccidentsChange(updatedData);
  };

  const handleFieldChange = (field: keyof AccidentDetails, value: any) => {
    const updatedData = {
      ...accidentData,
      [field]: value
    };
    onAccidentsChange(updatedData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accident History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="accident-toggle"
            checked={hasAccident}
            onCheckedChange={handleAccidentToggle}
          />
          <Label htmlFor="accident-toggle">
            Has this vehicle been in an accident?
          </Label>
        </div>

        {hasAccident && (
          <div className="space-y-4 pl-6 border-l-2 border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="accident-count">Number of Accidents</Label>
                <Input
                  id="accident-count"
                  type="number"
                  min="1"
                  value={accidentData.count || ''}
                  onChange={(e) => handleFieldChange('count', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 1"
                />
              </div>
              
              <div>
                <Label htmlFor="accident-severity">Severity</Label>
                <Select
                  value={accidentData.severity}
                  onValueChange={(value) => handleFieldChange('severity', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="accident-location">Location of Damage</Label>
              <Input
                id="accident-location"
                value={accidentData.location || ''}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                placeholder="e.g., Front bumper, rear quarter panel"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="repaired-toggle"
                  checked={accidentData.repaired || false}
                  onCheckedChange={(checked) => handleFieldChange('repaired', checked)}
                />
                <Label htmlFor="repaired-toggle">Professionally Repaired</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="frame-damage-toggle"
                  checked={accidentData.frameDamage || false}
                  onCheckedChange={(checked) => handleFieldChange('frameDamage', checked)}
                />
                <Label htmlFor="frame-damage-toggle">Frame Damage</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="accident-description">Additional Details</Label>
              <Textarea
                id="accident-description"
                value={accidentData.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Describe the accident and any repairs..."
                rows={3}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
