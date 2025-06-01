
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Wrench, CheckCircle, Calendar, FileText } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ServiceHistoryTabProps {
  formData: FollowUpAnswers;
  onServiceHistoryChange: (serviceData: any) => void;
}

export function ServiceHistoryTab({ formData, onServiceHistoryChange }: ServiceHistoryTabProps) {
  const hasRecords = formData.service_history?.hasRecords || formData.serviceHistory?.hasRecords;
  
  const handleServiceStatusChange = (hasRecords: boolean) => {
    const serviceData = {
      hasRecords,
      lastService: hasRecords ? '' : undefined,
      frequency: hasRecords ? 'regular' : undefined,
      dealerMaintained: hasRecords ? false : undefined,
      description: ''
    };
    onServiceHistoryChange(serviceData);
  };

  const handleServiceDetailsChange = (field: string, value: any) => {
    const currentData = formData.service_history || formData.serviceHistory || { hasRecords: false };
    const updatedData = {
      ...currentData,
      [field]: value
    };
    onServiceHistoryChange(updatedData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
          <Wrench className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service History</h2>
          <p className="text-gray-600">Maintenance records and service information</p>
        </div>
      </div>

      {/* Primary Question */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-700">
            <Wrench className="h-5 w-5 mr-2" />
            Do you have service records for this vehicle?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={hasRecords ? 'yes' : 'no'}
            onValueChange={(value) => handleServiceStatusChange(value === 'yes')}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="has-records" />
              <Label htmlFor="has-records" className="flex items-center cursor-pointer">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                Yes, I have service records
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-records" />
              <Label htmlFor="no-records" className="flex items-center cursor-pointer">
                <FileText className="h-4 w-4 mr-1 text-gray-500" />
                No service records available
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Service Details */}
      {hasRecords && (
        <div className="space-y-4">
          <Card className="border-teal-200 bg-teal-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-teal-700">
                <Calendar className="h-5 w-5 mr-2" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="lastService">When was the last service?</Label>
                <Input
                  id="lastService"
                  type="date"
                  value={formData.service_history?.lastService || formData.serviceHistory?.lastService || ''}
                  onChange={(e) => handleServiceDetailsChange('lastService', e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="frequency">Service Frequency</Label>
                <Select 
                  value={formData.service_history?.frequency || formData.serviceHistory?.frequency || ''}
                  onValueChange={(value) => handleServiceDetailsChange('frequency', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select service frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular (every 3-6 months)</SelectItem>
                    <SelectItem value="occasional">Occasional (6-12 months)</SelectItem>
                    <SelectItem value="rare">Rare (over 12 months)</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Where was the vehicle serviced?</Label>
                <RadioGroup
                  value={
                    (formData.service_history?.dealerMaintained || formData.serviceHistory?.dealerMaintained) !== undefined
                      ? (formData.service_history?.dealerMaintained || formData.serviceHistory?.dealerMaintained) ? 'dealer' : 'independent'
                      : ''
                  }
                  onValueChange={(value) => handleServiceDetailsChange('dealerMaintained', value === 'dealer')}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dealer" id="dealer-service" />
                    <Label htmlFor="dealer-service">Authorized dealer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="independent" id="independent-service" />
                    <Label htmlFor="independent-service">Independent mechanic</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="serviceDescription">Service Notes</Label>
                <Textarea
                  id="serviceDescription"
                  placeholder="Describe recent services, major repairs, or maintenance highlights..."
                  value={formData.service_history?.description || formData.serviceHistory?.description || ''}
                  onChange={(e) => handleServiceDetailsChange('description', e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
