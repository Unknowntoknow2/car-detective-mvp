
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FollowUpAnswers, ServiceHistoryDetails } from '@/types/follow-up-answers';

interface MaintenanceHistoryStepProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function MaintenanceHistoryStep({ formData, updateFormData }: MaintenanceHistoryStepProps) {
  const defaultServiceHistory: ServiceHistoryDetails = {
    hasRecords: false,
    lastService: '',
    frequency: 'unknown',
    dealerMaintained: false,
    description: '',
    services: []
  };

  const serviceHistory = formData.serviceHistory || defaultServiceHistory;

  const updateServiceHistory = (updates: Partial<ServiceHistoryDetails>) => {
    const updatedDetails: ServiceHistoryDetails = {
      ...serviceHistory,
      ...updates
    };
    updateFormData({ serviceHistory: updatedDetails });
  };

  const handleFrequencyChange = (value: string) => {
    updateServiceHistory({ frequency: value as 'regular' | 'occasional' | 'rare' | 'unknown' });
  };

  const handleDealerMaintenanceChange = (checked: boolean) => {
    updateServiceHistory({ dealerMaintained: checked });
  };

  const handleDescriptionChange = (value: string) => {
    updateServiceHistory({ description: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="maintenance-frequency">Maintenance Frequency</Label>
        <Select value={serviceHistory.frequency} onValueChange={handleFrequencyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="occasional">Occasional</SelectItem>
            <SelectItem value="rare">Rare</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="dealer-maintained"
          checked={serviceHistory.dealerMaintained || false}
          onCheckedChange={(checked: boolean) => handleDealerMaintenanceChange(checked)}
        />
        <Label htmlFor="dealer-maintained">Dealer maintained</Label>
      </div>

      <div>
        <Label htmlFor="maintenance-description">Maintenance Description</Label>
        <Textarea
          id="maintenance-description"
          value={serviceHistory.description || ''}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Describe maintenance history..."
        />
      </div>
    </div>
  );
}
