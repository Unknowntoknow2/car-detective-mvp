
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FollowUpAnswers, AccidentDetails } from '@/types/follow-up-answers';

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
      count: undefined,
      severity: undefined,
      repaired: undefined,
      frameDamage: undefined
    },
    service_history: '',
    maintenance_status: '',
    title_status: '',
    previous_owners: undefined,
    previous_use: '',
    tire_condition: '',
    dashboard_lights: [],
    frame_damage: false,
    modifications: {
      modified: false,
      types: undefined,
      reversible: undefined
    }
  });

  const handleAccidentChange = (field: keyof AccidentDetails, value: boolean | number | string) => {
    setFormData((prev: FollowUpAnswers): FollowUpAnswers => ({
      ...prev,
      accidents: {
        ...prev.accidents,
        [field]: value
      }
    }));
  };

  const handleInputChange = (field: keyof FollowUpAnswers, value: any) => {
    setFormData((prev: FollowUpAnswers): FollowUpAnswers => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Vehicle Details & Follow-up Questions</CardTitle>
        {vin && (
          <p className="text-sm text-muted-foreground">VIN: {vin}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Vehicle Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage || ''}
                onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || undefined)}
                placeholder="Enter mileage"
              />
            </div>
            <div>
              <Label htmlFor="zip_code">Zip Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code || ''}
                onChange={(e) => handleInputChange('zip_code', e.target.value)}
                placeholder="Enter zip code"
              />
            </div>
          </div>

          {/* Vehicle Condition */}
          <div>
            <Label>Vehicle Condition</Label>
            <RadioGroup
              value={formData.condition}
              onValueChange={(value) => handleInputChange('condition', value)}
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

          {/* Accident History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Accident History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Has this vehicle been in any accidents?</Label>
                <RadioGroup
                  value={formData.accidents?.hadAccident ? "yes" : "no"}
                  onValueChange={(value) => handleAccidentChange('hadAccident', value === 'yes')}
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
                <>
                  <div>
                    <Label htmlFor="accident-count">Number of accidents</Label>
                    <Input
                      id="accident-count"
                      type="number"
                      value={formData.accidents?.count || ''}
                      onChange={(e) => handleAccidentChange('count', parseInt(e.target.value) || undefined)}
                      placeholder="Enter number of accidents"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accident-severity">Severity of most recent accident</Label>
                    <Select
                      value={formData.accidents?.severity}
                      onValueChange={(value) => handleAccidentChange('severity', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minor">Minor</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="major">Major</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Was the damage properly repaired?</Label>
                    <RadioGroup
                      value={formData.accidents?.repaired ? "yes" : "no"}
                      onValueChange={(value) => handleAccidentChange('repaired', value === 'yes')}
                      className="flex gap-4 mt-2"
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
                </>
              )}
            </CardContent>
          </Card>

          {/* Service History */}
          <div>
            <Label htmlFor="service_history">Service History</Label>
            <Select
              value={formData.service_history}
              onValueChange={(value) => handleInputChange('service_history', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service history" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dealer">Dealer-maintained</SelectItem>
                <SelectItem value="independent">Independent mechanic</SelectItem>
                <SelectItem value="owner">Owner-maintained</SelectItem>
                <SelectItem value="unknown">No known history</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title Status */}
          <div>
            <Label htmlFor="title_status">Title Status</Label>
            <Select
              value={formData.title_status}
              onValueChange={(value) => handleInputChange('title_status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select title status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clean">Clean</SelectItem>
                <SelectItem value="salvage">Salvage</SelectItem>
                <SelectItem value="rebuilt">Rebuilt</SelectItem>
                <SelectItem value="branded">Branded</SelectItem>
                <SelectItem value="lemon">Lemon Law</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Previous Owners */}
          <div>
            <Label htmlFor="previous_owners">Number of Previous Owners</Label>
            <Input
              id="previous_owners"
              type="number"
              value={formData.previous_owners || ''}
              onChange={(e) => handleInputChange('previous_owners', parseInt(e.target.value) || undefined)}
              placeholder="Enter number of previous owners"
            />
          </div>

          <Button type="submit" className="w-full">
            Calculate Vehicle Valuation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
