
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
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Wrench className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Service & Maintenance</h2>
          <p className="text-gray-600 text-lg">Track maintenance history and current status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Service History */}
        <Card className="border-blue-200 bg-blue-50/50 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-blue-700 text-xl">
              <Wrench className="h-6 w-6 mr-3" />
              Service History Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.service_history || ''} 
              onValueChange={(value) => updateFormData({ service_history: value })}
            >
              <SelectTrigger className="h-14 text-lg bg-white border-2 border-blue-200 hover:border-blue-300 focus:border-blue-500">
                <SelectValue placeholder="Select service type" className="text-lg" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-blue-200">
                {SERVICE_HISTORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="p-4 cursor-pointer hover:bg-blue-50">
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold text-base">{option.label}</span>
                      <span className="text-sm text-gray-600">{option.impact}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Maintenance Status */}
        <Card className="border-blue-200 bg-blue-50/50 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-blue-700 text-xl">
              <CheckCircle className="h-6 w-6 mr-3" />
              Current Maintenance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.maintenance_status || ''} 
              onValueChange={(value) => updateFormData({ maintenance_status: value })}
            >
              <SelectTrigger className="h-14 text-lg bg-white border-2 border-blue-200 hover:border-blue-300 focus:border-blue-500">
                <SelectValue placeholder="Select status" className="text-lg" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-blue-200">
                {MAINTENANCE_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option} className="p-4 cursor-pointer hover:bg-blue-50">
                    <div className="flex items-center space-x-3">
                      {option === 'Up to date' && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {option === 'Overdue' && <AlertCircle className="h-5 w-5 text-red-500" />}
                      {option === 'Unknown' && <Clock className="h-5 w-5 text-gray-500" />}
                      <span className="font-semibold text-base">{option}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Last Service Date */}
        <Card className="border-blue-200 bg-blue-50/50 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-blue-700 text-xl">
              <Clock className="h-6 w-6 mr-3" />
              Last Service Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={formData.last_service_date || ''}
              onChange={(e) => updateFormData({ last_service_date: e.target.value })}
              className="h-14 text-lg bg-white border-2 border-blue-200 hover:border-blue-300 focus:border-blue-500"
            />
            <p className="text-sm text-blue-600 mt-3 font-medium">Recent service indicates better maintenance</p>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card className="border-blue-200 bg-blue-50/50 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-blue-700 text-xl">
              <Wrench className="h-6 w-6 mr-3" />
              Maintenance Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Any specific maintenance history, recent repairs, or upcoming service needs..."
              value={formData.service_notes || ''}
              onChange={(e) => updateFormData({ service_notes: e.target.value })}
              rows={6}
              className="resize-none text-base bg-white border-2 border-blue-200 hover:border-blue-300 focus:border-blue-500 p-4"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
