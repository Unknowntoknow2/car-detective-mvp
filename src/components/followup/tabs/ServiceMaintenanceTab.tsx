
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FollowUpAnswers, ServiceHistoryDetails } from '@/types/follow-up-answers';
import { Wrench, Calendar, Star } from 'lucide-react';

interface ServiceMaintenanceTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function ServiceMaintenanceTab({ formData, updateFormData }: ServiceMaintenanceTabProps) {
  const serviceData: ServiceHistoryDetails = typeof formData.serviceHistory === 'object' && formData.serviceHistory !== null 
    ? formData.serviceHistory 
    : {
        hasRecords: false,
        lastService: '',
        frequency: undefined,
        dealerMaintained: false,
        description: ''
      };

  const hasRecords = serviceData.hasRecords;

  const handleServiceToggle = (checked: boolean) => {
    const updatedData: ServiceHistoryDetails = {
      ...serviceData,
      hasRecords: checked,
      ...(checked ? {} : {
        lastService: '',
        frequency: undefined,
        dealerMaintained: false,
        description: ''
      })
    };
    updateFormData({ serviceHistory: updatedData });
  };

  const handleFieldChange = (field: keyof ServiceHistoryDetails, value: any) => {
    const updatedData: ServiceHistoryDetails = {
      ...serviceData,
      [field]: value
    };
    updateFormData({ serviceHistory: updatedData });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wrench className="h-5 w-5 text-blue-600" />
            Service & Maintenance History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="service-records-toggle"
              checked={hasRecords}
              onCheckedChange={handleServiceToggle}
            />
            <Label htmlFor="service-records-toggle" className="text-sm font-medium">
              Do you have service records for this vehicle?
            </Label>
          </div>

          {hasRecords && (
            <div className="space-y-4 p-4 bg-white rounded-lg border-2 border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="last-service" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Last Service Date
                  </Label>
                  <Input
                    id="last-service"
                    type="date"
                    value={serviceData.lastService || ''}
                    onChange={(e) => handleFieldChange('lastService', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="service-frequency" className="text-sm font-medium text-gray-700">Service Frequency</Label>
                  <Select
                    value={serviceData.frequency || ''}
                    onValueChange={(value: 'regular' | 'occasional' | 'rare' | 'unknown') => handleFieldChange('frequency', value)}
                  >
                    <SelectTrigger className="mt-1">
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
                <Label htmlFor="dealer-maintained-toggle" className="text-sm font-medium flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  Dealer Maintained
                </Label>
              </div>

              <div>
                <Label htmlFor="service-description" className="text-sm font-medium text-gray-700">Service History Details</Label>
                <Textarea
                  id="service-description"
                  value={serviceData.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Describe the service history, major repairs, maintenance schedules..."
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
