
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FollowUpAnswers, ServiceHistoryDetails } from '@/types/follow-up-answers';

interface ServiceHistoryTabProps {
  formData: FollowUpAnswers;
  onServiceHistoryChange: (serviceData: ServiceHistoryDetails) => void;
}

export function ServiceHistoryTab({ formData, onServiceHistoryChange }: ServiceHistoryTabProps) {
  const serviceData = formData.serviceHistory || {
    hasRecords: false,
    lastService: '',
    frequency: '',
    dealerMaintained: false,
    description: ''
  };

  const hasRecords = serviceData.hasRecords;

  const handleServiceToggle = (checked: boolean) => {
    const updatedData = {
      ...serviceData,
      hasRecords: checked,
      ...(checked ? {} : {
        lastService: '',
        frequency: '',
        dealerMaintained: false,
        description: ''
      })
    };
    onServiceHistoryChange(updatedData);
  };

  const handleFieldChange = (field: keyof ServiceHistoryDetails, value: any) => {
    const updatedData = {
      ...serviceData,
      [field]: value
    };
    onServiceHistoryChange(updatedData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service & Maintenance History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="service-records-toggle"
            checked={hasRecords}
            onCheckedChange={handleServiceToggle}
          />
          <Label htmlFor="service-records-toggle">
            Do you have service records for this vehicle?
          </Label>
        </div>

        {hasRecords && (
          <div className="space-y-4 pl-6 border-l-2 border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="last-service">Last Service Date</Label>
                <Input
                  id="last-service"
                  type="date"
                  value={serviceData.lastService || ''}
                  onChange={(e) => handleFieldChange('lastService', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="service-frequency">Service Frequency</Label>
                <Select
                  value={serviceData.frequency || ''}
                  onValueChange={(value) => handleFieldChange('frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular (Every 3-6 months)</SelectItem>
                    <SelectItem value="occasional">Occasional (6-12 months)</SelectItem>
                    <SelectItem value="rare">Rare (12+ months)</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="dealer-maintained-toggle"
                checked={serviceData.dealerMaintained || false}
                onCheckedChange={(checked) => handleFieldChange('dealerMaintained', checked)}
              />
              <Label htmlFor="dealer-maintained-toggle">Dealer Maintained</Label>
            </div>

            <div>
              <Label htmlFor="service-description">Service History Details</Label>
              <Textarea
                id="service-description"
                value={serviceData.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Describe the service history, major repairs, maintenance schedules..."
                rows={3}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
