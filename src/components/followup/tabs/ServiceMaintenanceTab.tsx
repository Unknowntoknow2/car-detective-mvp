
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Wrench, Calendar, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ServiceMaintenanceTabProps {
  formData: FollowUpAnswers;
  onServiceHistoryChange: (serviceHistory: {
    hasRecords: boolean;
    lastService?: string;
    frequency?: string;
    dealerMaintained?: boolean;
    description?: string;
  }) => void;
}

export function ServiceMaintenanceTab({ formData, onServiceHistoryChange }: ServiceMaintenanceTabProps) {
  const serviceHistory = formData.service_history || { hasRecords: false };

  const handleRecordsChange = (hasRecords: boolean) => {
    onServiceHistoryChange({
      ...serviceHistory,
      hasRecords
    });
  };

  const handleFieldChange = (field: string, value: string | boolean) => {
    onServiceHistoryChange({
      ...serviceHistory,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <Wrench className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service & Maintenance</h2>
          <p className="text-gray-600">Vehicle maintenance history and records</p>
        </div>
      </div>

      {/* Primary Question */}
      <Card className="border-gray-200 bg-gray-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-700">
            <FileText className="h-5 w-5 mr-2" />
            Service Records Available
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={serviceHistory.hasRecords ? 'yes' : 'no'}
            onValueChange={(value) => handleRecordsChange(value === 'yes')}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="has-records" />
              <Label htmlFor="has-records" className="flex items-center cursor-pointer">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                Service records available
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-records" />
              <Label htmlFor="no-records" className="flex items-center cursor-pointer">
                <AlertCircle className="h-4 w-4 mr-1 text-orange-500" />
                Limited or no records
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Service Details */}
      {serviceHistory.hasRecords && (
        <div className="space-y-4">
          <Card className="border-gray-200 bg-gray-50/50">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-2" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Last Service Date */}
              <div>
                <Label htmlFor="last-service" className="text-gray-700 mb-2 block">
                  Last Service Date
                </Label>
                <Input
                  id="last-service"
                  type="date"
                  value={serviceHistory.lastService || ''}
                  onChange={(e) => handleFieldChange('lastService', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Service Frequency */}
              <div>
                <Label htmlFor="frequency" className="text-gray-700 mb-2 block">
                  Service Frequency
                </Label>
                <RadioGroup
                  value={serviceHistory.frequency || ''}
                  onValueChange={(value) => handleFieldChange('frequency', value)}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regular" id="regular-service" />
                    <Label htmlFor="regular-service">Regular (every 3-6 months)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="occasional" id="occasional-service" />
                    <Label htmlFor="occasional-service">Occasional (6-12 months)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="minimal-service" />
                    <Label htmlFor="minimal-service">Minimal (as needed only)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Dealer Maintained */}
              <div>
                <Label className="text-gray-700 mb-2 block">
                  Maintenance Location
                </Label>
                <RadioGroup
                  value={serviceHistory.dealerMaintained ? 'dealer' : 'independent'}
                  onValueChange={(value) => handleFieldChange('dealerMaintained', value === 'dealer')}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dealer" id="dealer-maintained" />
                    <Label htmlFor="dealer-maintained">Dealer serviced</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="independent" id="independent-maintained" />
                    <Label htmlFor="independent-maintained">Independent shop</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card className="border-gray-200 bg-gray-50/50">
            <CardHeader>
              <CardTitle className="text-gray-700">Additional Service Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe recent services, repairs, or maintenance performed (oil changes, tire rotations, major repairs, etc.)"
                value={serviceHistory.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Information Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Service History Impact</h4>
              <p className="text-sm text-blue-600 mt-1">
                Well-documented service history can increase vehicle value by demonstrating proper care 
                and maintenance. Dealer service records typically carry more weight in valuation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
