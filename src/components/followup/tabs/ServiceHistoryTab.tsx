
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Wrench, CheckCircle, Clock, Building } from 'lucide-react';
import { FollowUpAnswers, ServiceHistoryDetails } from '@/types/follow-up-answers';

interface ServiceHistoryTabProps {
  formData: FollowUpAnswers;
  onServiceHistoryChange: (serviceData: ServiceHistoryDetails) => void;
}

export function ServiceHistoryTab({ formData, onServiceHistoryChange }: ServiceHistoryTabProps) {
  const serviceData = formData.service_history || formData.serviceHistory || {
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
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <Wrench className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service History</h2>
          <p className="text-gray-600">Maintenance records and service information</p>
        </div>
      </div>

      {/* Primary Question */}
      <Card className="border-gray-200 bg-gray-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-700">
            <Wrench className="h-5 w-5 mr-2" />
            Do you have service records for this vehicle?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="service-records-toggle"
              checked={hasRecords}
              onCheckedChange={handleServiceToggle}
            />
            <Label htmlFor="service-records-toggle">
              {hasRecords ? 'Yes, I have service records' : 'No service records available'}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      {hasRecords && (
        <div className="space-y-4">
          <Card className="border-gray-200 bg-gray-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-gray-700">
                <Clock className="h-5 w-5 mr-2" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectValue placeholder="How often is it serviced?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="every-3-months">Every 3 months</SelectItem>
                      <SelectItem value="every-6-months">Every 6 months</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                      <SelectItem value="as-needed">As needed</SelectItem>
                      <SelectItem value="rarely">Rarely</SelectItem>
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
                <Label htmlFor="dealer-maintained-toggle" className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  Dealer maintained
                </Label>
              </div>

              <div>
                <Label htmlFor="service-description">Service Notes</Label>
                <Textarea
                  id="service-description"
                  value={serviceData.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Describe the maintenance history, recent services, or any issues..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Well-Maintained Vehicles</h4>
                  <p className="text-sm text-green-600 mt-1">
                    Regular maintenance and dealer service records can significantly increase your vehicle's value. 
                    Complete service history demonstrates proper care and can add substantial value to your appraisal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
