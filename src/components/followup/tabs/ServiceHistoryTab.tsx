
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Wrench, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { FollowUpAnswers, ServiceHistoryDetails } from '@/types/follow-up-answers';

interface ServiceHistoryTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function ServiceHistoryTab({ formData, updateFormData }: ServiceHistoryTabProps) {
  const serviceHistory = formData.service_history || formData.serviceHistory || { 
    hasRecords: false,
    lastService: '',
    frequency: '',
    dealerMaintained: false,
    description: ''
  };

  const handleServiceRecordsChange = (hasRecords: boolean) => {
    const updatedHistory: ServiceHistoryDetails = {
      ...serviceHistory,
      hasRecords
    };
    updateFormData({ 
      service_history: updatedHistory,
      serviceHistory: updatedHistory 
    });
  };

  const handleFrequencyChange = (frequency: string) => {
    const updatedHistory: ServiceHistoryDetails = {
      ...serviceHistory,
      hasRecords: serviceHistory.hasRecords || false,
      frequency
    };
    updateFormData({ 
      service_history: updatedHistory,
      serviceHistory: updatedHistory 
    });
  };

  const handleLastServiceChange = (lastService: string) => {
    const updatedHistory: ServiceHistoryDetails = {
      ...serviceHistory,
      hasRecords: serviceHistory.hasRecords || false,
      lastService
    };
    updateFormData({ 
      service_history: updatedHistory,
      serviceHistory: updatedHistory 
    });
  };

  const handleDealerMaintenanceChange = (dealerMaintained: boolean) => {
    const updatedHistory: ServiceHistoryDetails = {
      ...serviceHistory,
      hasRecords: serviceHistory.hasRecords || false,
      dealerMaintained
    };
    updateFormData({ 
      service_history: updatedHistory,
      serviceHistory: updatedHistory 
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    const updatedHistory: ServiceHistoryDetails = {
      ...serviceHistory,
      hasRecords: serviceHistory.hasRecords || false,
      description
    };
    updateFormData({ 
      service_history: updatedHistory,
      serviceHistory: updatedHistory 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <Wrench className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service History</h2>
          <p className="text-gray-600">Tell us about your vehicle's maintenance</p>
        </div>
      </div>

      {/* Service Records Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Do you have service records?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant={serviceHistory.hasRecords === true ? 'default' : 'outline'}
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => handleServiceRecordsChange(true)}
            >
              <CheckCircle className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium">Yes, I have records</div>
                <div className="text-sm text-gray-500">Complete maintenance history</div>
              </div>
            </Button>
            
            <Button
              variant={serviceHistory.hasRecords === false ? 'default' : 'outline'}
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => handleServiceRecordsChange(false)}
            >
              <AlertTriangle className="h-8 w-8" />
              <div className="text-center">
                <div className="font-medium">No records available</div>
                <div className="text-sm text-gray-500">Limited or no documentation</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Frequency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            How often is the vehicle serviced?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'regular', label: 'Regular Schedule', desc: 'Every 3-6 months', impact: '+5%' },
              { value: 'occasional', label: 'Occasional', desc: 'When needed', impact: 'Neutral' },
              { value: 'minimal', label: 'Minimal', desc: 'Rarely serviced', impact: '-5%' }
            ].map((freq) => (
              <Button
                key={freq.value}
                variant={serviceHistory.frequency === freq.value ? 'default' : 'outline'}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => handleFrequencyChange(freq.value)}
              >
                <div className="text-center">
                  <div className="font-medium">{freq.label}</div>
                  <div className="text-sm text-gray-500">{freq.desc}</div>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {freq.impact}
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Last Service */}
      <Card>
        <CardHeader>
          <CardTitle>When was the last service?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'recent', label: 'Within 6 months' },
              { value: 'moderate', label: '6-12 months ago' },
              { value: 'old', label: '1-2 years ago' },
              { value: 'unknown', label: 'Unknown/2+ years' }
            ].map((period) => (
              <Button
                key={period.value}
                variant={serviceHistory.lastService === period.value ? 'default' : 'outline'}
                className="h-auto p-3 text-center"
                onClick={() => handleLastServiceChange(period.value)}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dealer Maintained */}
      <Card>
        <CardHeader>
          <CardTitle>Where is the vehicle typically serviced?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant={serviceHistory.dealerMaintained === true ? 'default' : 'outline'}
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => handleDealerMaintenanceChange(true)}
            >
              <div className="text-center">
                <div className="font-medium">Authorized Dealer</div>
                <div className="text-sm text-gray-500">OEM parts & certified techs</div>
                <Badge variant="secondary" className="mt-1 text-xs">+5% to +10%</Badge>
              </div>
            </Button>
            
            <Button
              variant={serviceHistory.dealerMaintained === false ? 'default' : 'outline'}
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => handleDealerMaintenanceChange(false)}
            >
              <div className="text-center">
                <div className="font-medium">Independent Shop</div>
                <div className="text-sm text-gray-500">Local mechanic or self-service</div>
                <Badge variant="secondary" className="mt-1 text-xs">Neutral</Badge>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Service Details (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="service-description">Recent services, upcoming maintenance, etc.</Label>
          <Textarea
            id="service-description"
            value={serviceHistory.description || ''}
            onChange={handleDescriptionChange}
            placeholder="Recent oil change, new tires, upcoming 100k service, etc."
            rows={3}
            className="mt-2"
          />
        </CardContent>
      </Card>
    </div>
  );
}
