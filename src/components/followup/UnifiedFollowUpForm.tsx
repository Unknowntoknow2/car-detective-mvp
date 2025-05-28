
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FollowUpAnswers, AccidentDetails, ModificationDetails } from '@/types/follow-up-answers';

interface UnifiedFollowUpFormProps {
  vin?: string;
  onSubmit: (answers: FollowUpAnswers) => void;
}

export function UnifiedFollowUpForm({ vin, onSubmit }: UnifiedFollowUpFormProps) {
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin: vin || '',
    mileage: undefined,
    zip_code: '',
    condition: 'good',
    accidents: {
      hadAccident: false,
      count: 0,
      severity: 'minor',
      repaired: false,
      frameDamage: false
    },
    service_history: 'unknown',
    maintenance_status: 'Unknown',
    title_status: 'clean',
    previous_owners: 1,
    previous_use: 'personal',
    tire_condition: 'good',
    dashboard_lights: [],
    modifications: {
      modified: false,
      types: [],
      reversible: true
    },
    completion_percentage: 0,
    is_complete: false
  });

  const updateAccidents = (updates: Partial<AccidentDetails>) => {
    setFormData(prev => ({
      ...prev,
      accidents: {
        hadAccident: updates.hadAccident ?? prev.accidents?.hadAccident ?? false,
        count: updates.count ?? prev.accidents?.count ?? 0,
        severity: updates.severity ?? prev.accidents?.severity ?? 'minor',
        repaired: updates.repaired ?? prev.accidents?.repaired ?? false,
        frameDamage: updates.frameDamage ?? prev.accidents?.frameDamage ?? false
      }
    }));
  };

  const updateModifications = (updates: Partial<ModificationDetails>) => {
    setFormData(prev => ({
      ...prev,
      modifications: {
        modified: updates.modified ?? prev.modifications?.modified ?? false,
        types: updates.types ?? prev.modifications?.types ?? [],
        reversible: updates.reversible ?? prev.modifications?.reversible ?? true
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mileage">Current Mileage</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="Enter mileage"
                value={formData.mileage || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  mileage: e.target.value ? parseInt(e.target.value) : undefined
                }))}
              />
            </div>
            <div>
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                id="zip_code"
                placeholder="Enter ZIP code"
                value={formData.zip_code || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  zip_code: e.target.value
                }))}
              />
            </div>
          </div>

          <div>
            <Label>Vehicle Condition</Label>
            <RadioGroup
              value={formData.condition}
              onValueChange={(value: any) => setFormData(prev => ({
                ...prev,
                condition: value
              }))}
              className="flex flex-wrap gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="excellent" />
                <Label htmlFor="excellent">Excellent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="good" />
                <Label htmlFor="good">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="fair" />
                <Label htmlFor="fair">Fair</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="poor" />
                <Label htmlFor="poor">Poor</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accident History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Has this vehicle been in an accident?</Label>
            <RadioGroup
              value={formData.accidents?.hadAccident ? 'yes' : 'no'}
              onValueChange={(value) => updateAccidents({ hadAccident: value === 'yes' })}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no-accident" />
                <Label htmlFor="no-accident">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes-accident" />
                <Label htmlFor="yes-accident">Yes</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.accidents?.hadAccident && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="accident-count">Number of Accidents</Label>
                <Input
                  id="accident-count"
                  type="number"
                  min="1"
                  value={formData.accidents.count || 1}
                  onChange={(e) => updateAccidents({ count: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div>
                <Label>Accident Severity</Label>
                <Select
                  value={formData.accidents.severity}
                  onValueChange={(value: any) => updateAccidents({ severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="repaired"
                  checked={formData.accidents.repaired}
                  onCheckedChange={(checked) => updateAccidents({ repaired: !!checked })}
                />
                <Label htmlFor="repaired">Accident has been professionally repaired</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="frame-damage"
                  checked={formData.accidents.frameDamage}
                  onCheckedChange={(checked) => updateAccidents({ frameDamage: !!checked })}
                />
                <Label htmlFor="frame-damage">Frame damage occurred</Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service & Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Service History</Label>
            <Select
              value={formData.service_history}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                service_history: value
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dealer">Dealer-maintained</SelectItem>
                <SelectItem value="independent">Independent mechanic</SelectItem>
                <SelectItem value="owner">Owner-maintained</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Maintenance Status</Label>
            <Select
              value={formData.maintenance_status}
              onValueChange={(value: any) => setFormData(prev => ({
                ...prev,
                maintenance_status: value
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Up to date">Up to date</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        Calculate Vehicle Value
      </Button>
    </form>
  );
}
