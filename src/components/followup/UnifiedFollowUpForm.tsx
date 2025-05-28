
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface UnifiedFollowUpFormProps {
  vin?: string;
  onSubmit: (answers: FollowUpAnswers) => Promise<void>;
}

export function UnifiedFollowUpForm({ vin, onSubmit }: UnifiedFollowUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin: vin || '',
    mileage: 0,
    zip_code: '',
    condition: 'good',
    accidents: {
      hadAccident: false,
      count: 0,
      severity: 'minor',
      repaired: false,
      frameDamage: false
    },
    service_history: 'independent',
    maintenance_status: 'Up to date',
    title_status: 'clean',
    previous_owners: 1,
    previous_use: 'personal',
    tire_condition: 'good',
    dashboard_lights: [],
    frame_damage: false,
    modifications: {
      modified: false,
      types: [],
      reversible: false
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof FollowUpAnswers, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAccidents = (field: keyof FollowUpAnswers['accidents'], value: any) => {
    setFormData(prev => ({
      ...prev,
      accidents: { ...prev.accidents!, [field]: value }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Vehicle Details</h2>
        <p className="text-gray-600">Please provide additional details about your vehicle for accurate valuation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mileage">Current Mileage</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage || ''}
            onChange={(e) => updateFormData('mileage', parseInt(e.target.value) || 0)}
            placeholder="e.g., 85000"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={formData.zip_code || ''}
            onChange={(e) => updateFormData('zip_code', e.target.value)}
            placeholder="e.g., 10001"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Vehicle Condition</Label>
        <RadioGroup
          value={formData.condition}
          onValueChange={(value) => updateFormData('condition', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="excellent" id="excellent" />
            <Label htmlFor="excellent">Excellent - No cosmetic/mechanical issues</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="good" />
            <Label htmlFor="good">Good - Minor wear, no major damage</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fair" id="fair" />
            <Label htmlFor="fair">Fair - Visible damage or mechanical issues</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="poor" id="poor" />
            <Label htmlFor="poor">Poor - Needs repair or structural concerns</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Accident History</Label>
        <RadioGroup
          value={formData.accidents?.hadAccident ? 'yes' : 'no'}
          onValueChange={(value) => updateAccidents('hadAccident', value === 'yes')}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no-accident" />
            <Label htmlFor="no-accident">No accidents</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes-accident" />
            <Label htmlFor="yes-accident">Has been in accident(s)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serviceHistory">Service History</Label>
          <Select
            value={formData.service_history}
            onValueChange={(value) => updateFormData('service_history', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dealer">Dealer-maintained</SelectItem>
              <SelectItem value="independent">Independent mechanic</SelectItem>
              <SelectItem value="owner">Owner-maintained</SelectItem>
              <SelectItem value="unknown">No known history</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="titleStatus">Title Status</Label>
          <Select
            value={formData.title_status}
            onValueChange={(value) => updateFormData('title_status', value)}
          >
            <SelectTrigger>
              <SelectValue />
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="previousOwners">Number of Previous Owners</Label>
        <Select
          value={formData.previous_owners?.toString()}
          onValueChange={(value) => updateFormData('previous_owners', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 owner</SelectItem>
            <SelectItem value="2">2 owners</SelectItem>
            <SelectItem value="3">3 owners</SelectItem>
            <SelectItem value="4">4+ owners</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Calculating Valuation...' : 'Get Vehicle Valuation'}
      </Button>
    </form>
  );
}
