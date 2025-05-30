
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Wrench, Calendar } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ServiceHistoryTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function ServiceHistoryTab({ formData, updateFormData }: ServiceHistoryTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
          <Wrench className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service History</h2>
          <p className="text-gray-600">Regular maintenance improves vehicle reliability and value</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Wrench className="h-5 w-5 mr-2" />
              Maintenance Records
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Do you have service records?</Label>
              <RadioGroup
                value={formData.serviceHistory?.hasRecords ? 'yes' : 'no'}
                onValueChange={(value) => 
                  updateFormData({
                    serviceHistory: {
                      ...formData.serviceHistory,
                      hasRecords: value === 'yes'
                    }
                  })
                }
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="records-yes" />
                  <Label htmlFor="records-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="records-no" />
                  <Label htmlFor="records-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="frequency">Service Frequency</Label>
              <Select 
                value={formData.serviceHistory?.frequency || 'regular'} 
                onValueChange={(value) => 
                  updateFormData({
                    serviceHistory: {
                      ...formData.serviceHistory,
                      frequency: value
                    }
                  })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent (every 3-5k miles)</SelectItem>
                  <SelectItem value="regular">Regular (every 5-7k miles)</SelectItem>
                  <SelectItem value="occasional">Occasional (every 7-10k miles)</SelectItem>
                  <SelectItem value="poor">Poor (over 10k miles)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="h-5 w-5 mr-2" />
              Recent Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="last-service">Last Service Date</Label>
              <Select 
                value={formData.serviceHistory?.lastService || 'recent'} 
                onValueChange={(value) => 
                  updateFormData({
                    serviceHistory: {
                      ...formData.serviceHistory,
                      lastService: value
                    }
                  })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Within 6 months</SelectItem>
                  <SelectItem value="moderate">6-12 months ago</SelectItem>
                  <SelectItem value="old">Over 1 year ago</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Dealer maintained?</Label>
              <RadioGroup
                value={formData.serviceHistory?.dealerMaintained ? 'yes' : 'no'}
                onValueChange={(value) => 
                  updateFormData({
                    serviceHistory: {
                      ...formData.serviceHistory,
                      dealerMaintained: value === 'yes'
                    }
                  })
                }
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="dealer-yes" />
                  <Label htmlFor="dealer-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="dealer-no" />
                  <Label htmlFor="dealer-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Additional Service Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="service-description">Service Details (Optional)</Label>
            <Textarea
              id="service-description"
              placeholder="Any recent repairs, upcoming maintenance, or service concerns..."
              value={formData.serviceHistory?.description || ''}
              onChange={(e) => 
                updateFormData({
                  serviceHistory: {
                    ...formData.serviceHistory,
                    description: e.target.value
                  }
                })
              }
              className="mt-2"
              rows={3}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
