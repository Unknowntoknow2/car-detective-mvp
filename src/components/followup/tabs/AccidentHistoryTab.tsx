
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FollowUpAnswers, AccidentDetails } from '@/types/follow-up-answers';
import { AlertTriangle } from 'lucide-react';

interface AccidentHistoryTabProps {
  formData: FollowUpAnswers;
  onAccidentsChange: (accidentData: AccidentDetails) => void;
}

export function AccidentHistoryTab({ formData, onAccidentsChange }: AccidentHistoryTabProps) {
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
    <div className="space-y-4">
      <div className="p-3 rounded-lg border bg-orange-50 border-orange-200">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <h3 className="font-medium text-sm">Accident History</h3>
        </div>
        
        <div className="flex items-center space-x-2 mb-3">
          <Switch
            id="accident-toggle"
            checked={hasAccident}
            onCheckedChange={handleAccidentToggle}
          />
          <Label htmlFor="accident-toggle" className="text-xs font-medium">
            Has this vehicle been in an accident?
          </Label>
        </div>

        {hasAccident && (
          <div className="space-y-3 p-2 bg-white rounded-md border border-orange-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="accident-count" className="text-xs font-medium text-gray-700">Number of Accidents</Label>
                <Input
                  id="accident-count"
                  type="number"
                  min="1"
                  value={accidentData.count || ''}
                  onChange={(e) => handleFieldChange('count', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 1"
                  className="mt-1 h-8 text-xs"
                />
              </div>
              
              <div>
                <Label htmlFor="accident-severity" className="text-xs font-medium text-gray-700">Severity</Label>
                <Select
                  value={accidentData.severity}
                  onValueChange={(value: 'minor' | 'moderate' | 'severe') => handleFieldChange('severity', value)}
                >
                  <SelectTrigger className="mt-1 h-8 text-xs">
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
              <Label htmlFor="accident-location" className="text-xs font-medium text-gray-700">Location of Damage</Label>
              <Input
                id="accident-location"
                value={accidentData.location || ''}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                placeholder="e.g., Front bumper, rear quarter panel"
                className="mt-1 h-8 text-xs"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="repaired-toggle"
                  checked={accidentData.repaired || false}
                  onCheckedChange={(checked) => handleFieldChange('repaired', checked)}
                />
                <Label htmlFor="repaired-toggle" className="text-xs font-medium">Professionally Repaired</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="frame-damage-toggle"
                  checked={accidentData.frameDamage || false}
                  onCheckedChange={(checked) => handleFieldChange('frameDamage', checked)}
                />
                <Label htmlFor="frame-damage-toggle" className="text-xs font-medium">Frame Damage</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="accident-description" className="text-xs font-medium text-gray-700">Additional Details</Label>
              <Textarea
                id="accident-description"
                value={accidentData.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Describe the accident and any repairs..."
                rows={2}
                className="mt-1 text-xs"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
