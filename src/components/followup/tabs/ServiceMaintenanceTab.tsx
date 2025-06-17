
import React from 'react';
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
  // Convert string to object if needed, or use default
  const getServiceData = (): ServiceHistoryDetails => {
    if (typeof formData.serviceHistory === 'object' && formData.serviceHistory !== null) {
      return formData.serviceHistory;
    }
    return {
      hasRecords: false,
      lastService: '',
      frequency: undefined,
      dealerMaintained: false,
      description: ''
    };
  };

  const serviceData = getServiceData();
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

  const handleMaintenanceChange = (checked: boolean, serviceType: string) => {
    const currentServices = serviceData.services || [];
    let updatedServices;

    if (checked) {
      updatedServices = [...currentServices, serviceType];
    } else {
      updatedServices = currentServices.filter((service: string) => service !== serviceType);
    }

    const updatedData: ServiceHistoryDetails = {
      ...serviceData,
      hasRecords: true,
      services: updatedServices
    };

    updateFormData({ serviceHistory: updatedData });
  };

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg border bg-blue-50 border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <Wrench className="h-4 w-4 text-blue-600" />
          <h3 className="font-medium text-sm">Service & Maintenance History</h3>
        </div>
        
        <div className="flex items-center space-x-2 mb-3">
          <Switch
            id="service-records-toggle"
            checked={hasRecords}
            onCheckedChange={handleServiceToggle}
          />
          <Label htmlFor="service-records-toggle" className="text-xs font-medium">
            Do you have service records for this vehicle?
          </Label>
        </div>

        {hasRecords && (
          <div className="space-y-3 p-2 bg-white rounded-md border border-blue-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="last-service" className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Last Service Date
                </Label>
                <Input
                  id="last-service"
                  type="date"
                  value={serviceData.lastService || ''}
                  onChange={(e) => handleFieldChange('lastService', e.target.value)}
                  className="mt-1 h-8 text-xs"
                />
              </div>
              
              <div>
                <Label htmlFor="service-frequency" className="text-xs font-medium text-gray-700">Service Frequency</Label>
                <Select
                  value={serviceData.frequency || ''}
                  onValueChange={(value: 'regular' | 'occasional' | 'rare' | 'unknown') => handleFieldChange('frequency', value)}
                >
                  <SelectTrigger className="mt-1 h-8 text-xs">
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
                onCheckedChange={(checked: boolean) => handleFieldChange('dealerMaintained', checked)}
              />
              <Label htmlFor="dealer-maintained-toggle" className="text-xs font-medium flex items-center gap-1">
                <Star className="h-3 w-3" />
                Dealer Maintained
              </Label>
            </div>

            <div>
              <Label htmlFor="service-description" className="text-xs font-medium text-gray-700">Service History Details</Label>
              <Textarea
                id="service-description"
                value={serviceData.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Describe the service history, major repairs, maintenance schedules..."
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
