
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Car, Home } from 'lucide-react';
import { FollowUpAnswers, CONDITION_OPTIONS } from '@/types/follow-up-answers';

interface VehicleConditionTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function VehicleConditionTab({ formData, updateFormData }: VehicleConditionTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
          <Star className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Vehicle Condition Assessment</h2>
          <p className="text-gray-600 text-lg">Rate the condition of different parts of your vehicle</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Exterior Condition */}
        <Card className="border-yellow-200 bg-yellow-50/50 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-yellow-700 text-xl">
              <Car className="h-6 w-6 mr-3" />
              Exterior Condition
            </CardTitle>
            <p className="text-gray-600 mt-2">Body, paint, bumpers, lights, trim</p>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.exterior_condition || ''} 
              onValueChange={(value: 'excellent' | 'good' | 'fair' | 'poor') => updateFormData({ exterior_condition: value })}
            >
              <SelectTrigger className="h-14 text-lg bg-white border-2 border-yellow-200 hover:border-yellow-300 focus:border-yellow-500">
                <SelectValue placeholder="Rate exterior condition" className="text-lg" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-yellow-200">
                {CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="p-4 cursor-pointer hover:bg-yellow-50">
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold text-base">{option.label}</span>
                      <span className="text-sm text-gray-600">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Interior Condition */}
        <Card className="border-yellow-200 bg-yellow-50/50 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-yellow-700 text-xl">
              <Home className="h-6 w-6 mr-3" />
              Interior Condition
            </CardTitle>
            <p className="text-gray-600 mt-2">Seats, dashboard, controls, carpets</p>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.interior_condition || ''} 
              onValueChange={(value: 'excellent' | 'good' | 'fair' | 'poor') => updateFormData({ interior_condition: value })}
            >
              <SelectTrigger className="h-14 text-lg bg-white border-2 border-yellow-200 hover:border-yellow-300 focus:border-yellow-500">
                <SelectValue placeholder="Rate interior condition" className="text-lg" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-yellow-200">
                {CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="p-4 cursor-pointer hover:bg-yellow-50">
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold text-base">{option.label}</span>
                      <span className="text-sm text-gray-600">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Condition Summary */}
        <Card className="border-yellow-200 bg-yellow-50/50 md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-yellow-700 text-xl">
              <Star className="h-6 w-6 mr-3" />
              Condition Assessment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
                <div className="text-lg font-semibold text-gray-700">Overall</div>
                <div className="text-xl font-bold text-yellow-600 capitalize">
                  {formData.condition || 'Not Set'}
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
                <div className="text-lg font-semibold text-gray-700">Exterior</div>
                <div className="text-xl font-bold text-yellow-600 capitalize">
                  {formData.exterior_condition || 'Not Set'}
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-yellow-200">
                <div className="text-lg font-semibold text-gray-700">Interior</div>
                <div className="text-xl font-bold text-yellow-600 capitalize">
                  {formData.interior_condition || 'Not Set'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
