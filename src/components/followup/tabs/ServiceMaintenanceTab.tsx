
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Wrench, CheckCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ServiceMaintenanceTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function ServiceMaintenanceTab({ formData, updateFormData }: ServiceMaintenanceTabProps) {
  const serviceHistory = formData.serviceHistory || {
    hasRecords: false,
    frequency: 'unknown',
    dealerMaintained: false,
    description: '',
    services: []
  };

  const handleServiceChange = (field: string, value: any) => {
    updateFormData({
      serviceHistory: {
        ...serviceHistory,
        [field]: value
      }
    });
  };

  const handleHasRecordsChange = (hasRecords: boolean) => {
    updateFormData({
      serviceHistory: {
        ...serviceHistory,
        hasRecords
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Service & Maintenance History
          </CardTitle>
          <p className="text-sm text-gray-600">
            Information about your vehicle's maintenance and service history
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Has Service Records */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Do you have service records?</Label>
              <p className="text-sm text-gray-600 mb-3">
                Complete service records help verify maintenance history
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[80px] ${
                  serviceHistory.hasRecords === true
                    ? 'bg-green-50 border-green-200 ring-2 ring-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleHasRecordsChange(true)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={serviceHistory.hasRecords === true}
                    onCheckedChange={() => handleHasRecordsChange(true)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <Label className="cursor-pointer font-medium text-green-700">
                      Yes, I have records
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Complete maintenance documentation
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[80px] ${
                  serviceHistory.hasRecords === false
                    ? 'bg-yellow-50 border-yellow-200 ring-2 ring-yellow-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleHasRecordsChange(false)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={serviceHistory.hasRecords === false}
                    onCheckedChange={() => handleHasRecordsChange(false)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <Label className="cursor-pointer font-medium text-yellow-700">
                      No records available
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Limited or no documentation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Frequency */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Maintenance Frequency</Label>
              <p className="text-sm text-gray-600">How regularly has the vehicle been maintained?</p>
            </div>
            
            <RadioGroup 
              value={serviceHistory.frequency || 'unknown'} 
              onValueChange={(value) => handleServiceChange('frequency', value)}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: 'regular', label: 'Regular', desc: 'On schedule maintenance', color: 'text-green-600' },
                { value: 'occasional', label: 'Occasional', desc: 'Some delays but maintained', color: 'text-blue-600' },
                { value: 'rare', label: 'Rare', desc: 'Infrequent maintenance', color: 'text-yellow-600' },
                { value: 'unknown', label: 'Unknown', desc: 'Maintenance history unclear', color: 'text-gray-600' }
              ].map((option) => (
                <div
                  key={option.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[80px] ${
                    serviceHistory.frequency === option.value
                      ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-200'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleServiceChange('frequency', option.value)}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={option.value} 
                      id={option.value}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <Label htmlFor={option.value} className={`cursor-pointer font-medium ${option.color}`}>
                        {option.label}
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">{option.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Dealer Maintained */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Dealer Maintained</Label>
              <p className="text-sm text-gray-600">Was the vehicle serviced at authorized dealers?</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[80px] ${
                  serviceHistory.dealerMaintained === true
                    ? 'bg-green-50 border-green-200 ring-2 ring-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleServiceChange('dealerMaintained', true)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={serviceHistory.dealerMaintained === true}
                    onCheckedChange={() => handleServiceChange('dealerMaintained', true)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <Label className="cursor-pointer font-medium text-green-700">
                      Dealer Serviced
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Authorized dealer maintenance
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[80px] ${
                  serviceHistory.dealerMaintained === false
                    ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleServiceChange('dealerMaintained', false)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={serviceHistory.dealerMaintained === false}
                    onCheckedChange={() => handleServiceChange('dealerMaintained', false)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <Label className="cursor-pointer font-medium text-blue-700">
                      Independent Service
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Third-party or self-maintained
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="service-description" className="text-base font-medium">
                Additional Service Details
              </Label>
              <p className="text-sm text-gray-600">
                Describe any major services, repairs, or maintenance performed
              </p>
            </div>
            
            <Textarea
              id="service-description"
              value={serviceHistory.description || ''}
              onChange={(e) => handleServiceChange('description', e.target.value)}
              placeholder="Describe recent services, repairs, or maintenance history..."
              className="min-h-[100px]"
            />
          </div>

          {/* Service Summary */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Service History Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-blue-700 mb-1">Records</div>
                  <Badge variant={serviceHistory.hasRecords ? 'default' : 'outline'} className="text-xs">
                    {serviceHistory.hasRecords ? 'Available' : 'Limited'}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-blue-700 mb-1">Frequency</div>
                  <Badge variant="secondary" className="text-xs">
                    {(serviceHistory.frequency || 'unknown').charAt(0).toUpperCase() + (serviceHistory.frequency || 'unknown').slice(1)}
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-blue-700 mb-1">Service Type</div>
                  <Badge variant={serviceHistory.dealerMaintained ? 'default' : 'secondary'} className="text-xs">
                    {serviceHistory.dealerMaintained ? 'Dealer' : 'Independent'}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Impact:</strong> Regular maintenance with complete records typically maintains higher resale value.
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
