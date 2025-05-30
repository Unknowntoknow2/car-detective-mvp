
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Wrench, Calendar, Building, CheckCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ServiceHistoryTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function ServiceHistoryTab({ formData, updateFormData }: ServiceHistoryTabProps) {
  const handleServiceChange = (field: string, value: any) => {
    const currentService = formData.serviceHistory || {
      hasRecords: false,
      lastService: '',
      frequency: '',
      dealerMaintained: false,
      description: ''
    };

    updateFormData({
      serviceHistory: {
        ...currentService,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
          <Wrench className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Service History</h2>
          <p className="text-gray-600 text-lg">Maintenance and service records</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Has Service Records Toggle */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700 text-xl">
              <Wrench className="h-6 w-6 mr-3" />
              Service Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="hasRecords" className="text-lg font-medium">
                  Do you have maintenance/service records?
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Complete service records can increase vehicle value
                </p>
              </div>
              <Switch
                id="hasRecords"
                checked={formData.serviceHistory?.hasRecords || false}
                onCheckedChange={(checked) => handleServiceChange('hasRecords', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        {formData.serviceHistory?.hasRecords && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Last Service Date */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2" />
                  Last Service Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="date"
                  value={formData.serviceHistory?.lastService || ''}
                  onChange={(e) => handleServiceChange('lastService', e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Service Frequency */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={formData.serviceHistory?.frequency || ''} 
                  onValueChange={(value) => handleServiceChange('frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How often is it serviced?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular (every 3-6 months)</SelectItem>
                    <SelectItem value="scheduled">As scheduled by manufacturer</SelectItem>
                    <SelectItem value="irregular">Irregular service</SelectItem>
                    <SelectItem value="minimal">Minimal service only</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Dealer Maintained */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Building className="h-5 w-5 mr-2" />
                  Dealer Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dealerMaintained" className="font-medium">
                      Has the vehicle been primarily dealer-maintained?
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Dealer maintenance often indicates higher quality service
                    </p>
                  </div>
                  <Switch
                    id="dealerMaintained"
                    checked={formData.serviceHistory?.dealerMaintained || false}
                    onCheckedChange={(checked) => handleServiceChange('dealerMaintained', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Service Description */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Service Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe recent services, repairs, or maintenance performed..."
                  value={formData.serviceHistory?.description || ''}
                  onChange={(e) => handleServiceChange('description', e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Service Records Message */}
        {!formData.serviceHistory?.hasRecords && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-yellow-600" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800">Limited Service Records</h3>
                  <p className="text-yellow-700">
                    Missing service records may slightly impact valuation accuracy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service History Benefits */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Why Service History Matters</h3>
                <ul className="text-green-700 mt-2 space-y-1">
                  <li>• Regular maintenance indicates responsible ownership</li>
                  <li>• Complete records can increase resale value by 5-15%</li>
                  <li>• Helps identify potential future maintenance needs</li>
                  <li>• Dealer maintenance often ensures quality parts and service</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
