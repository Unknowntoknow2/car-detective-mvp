
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Wrench, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { FollowUpAnswers, SERVICE_HISTORY_OPTIONS, MAINTENANCE_STATUS_OPTIONS } from '@/types/follow-up-answers';

interface ServiceMaintenanceTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function ServiceMaintenanceTab({ formData, updateFormData }: ServiceMaintenanceTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Wrench className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service & Maintenance</h2>
          <p className="text-gray-600">Track maintenance history and current status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service History */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-blue-700">
              <Wrench className="h-5 w-5 mr-2" />
              Service History Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.service_history || ''} 
              onValueChange={(value) => updateFormData({ service_history: value })}
            >
              <SelectTrigger className="text-lg">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_HISTORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-gray-500">{option.impact}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Maintenance Status */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-blue-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              Current Maintenance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.maintenance_status || ''} 
              onValueChange={(value) => updateFormData({ maintenance_status: value })}
            >
              <SelectTrigger className="text-lg">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {MAINTENANCE_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    <div className="flex items-center">
                      {option === 'Up to date' && <CheckCircle className="h-4 w-4 mr-2 text-green-500" />}
                      {option === 'Overdue' && <AlertCircle className="h-4 w-4 mr-2 text-red-500" />}
                      {option === 'Unknown' && <Clock className="h-4 w-4 mr-2 text-gray-500" />}
                      <span>{option}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Last Service Date */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-blue-700">
              <Clock className="h-5 w-5 mr-2" />
              Last Service Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={formData.last_service_date || ''}
              onChange={(e) => updateFormData({ last_service_date: e.target.value })}
              className="text-lg"
            />
            <p className="text-xs text-blue-600 mt-1">Recent service indicates better maintenance</p>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-blue-700">
              <Wrench className="h-5 w-5 mr-2" />
              Maintenance Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Any specific maintenance history, recent repairs, or upcoming service needs..."
              value={formData.service_history || ''}
              onChange={(e) => updateFormData({ service_history: e.target.value })}
              rows={4}
              className="resize-none"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
