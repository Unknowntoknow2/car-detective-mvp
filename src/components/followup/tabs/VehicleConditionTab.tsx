
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Gauge, MapPin, Eye, Palette } from 'lucide-react';
import { FollowUpAnswers, CONDITION_OPTIONS } from '@/types/follow-up-answers';

interface VehicleConditionTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function VehicleConditionTab({ formData, updateFormData }: VehicleConditionTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <Star className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Condition</h2>
          <p className="text-gray-600">Assess the overall state of your vehicle</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mileage */}
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-emerald-700">
              <Gauge className="h-5 w-5 mr-2" />
              Current Mileage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              placeholder="Enter mileage"
              value={formData.mileage || ''}
              onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || 0 })}
              className="text-lg font-medium"
            />
            <p className="text-xs text-emerald-600 mt-1">Lower mileage typically means higher value</p>
          </CardContent>
        </Card>

        {/* ZIP Code */}
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-emerald-700">
              <MapPin className="h-5 w-5 mr-2" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="ZIP Code"
              value={formData.zip_code || ''}
              onChange={(e) => updateFormData({ zip_code: e.target.value })}
              className="text-lg font-medium"
              maxLength={5}
            />
            <p className="text-xs text-emerald-600 mt-1">Regional market values vary by location</p>
          </CardContent>
        </Card>

        {/* Overall Condition */}
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-emerald-700">
              <Star className="h-5 w-5 mr-2" />
              Overall Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.condition || ''} 
              onValueChange={(value) => updateFormData({ condition: value as any })}
            >
              <SelectTrigger className="text-lg">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITION_OPTIONS.map((option) => (
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

        {/* Exterior Condition */}
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-emerald-700">
              <Eye className="h-5 w-5 mr-2" />
              Exterior Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.exterior_condition || ''} 
              onValueChange={(value) => updateFormData({ exterior_condition: value as any })}
            >
              <SelectTrigger className="text-lg">
                <SelectValue placeholder="Select exterior condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-gray-500">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Interior Condition */}
        <Card className="border-emerald-200 bg-emerald-50/50 md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-emerald-700">
              <Palette className="h-5 w-5 mr-2" />
              Interior Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.interior_condition || ''} 
              onValueChange={(value) => updateFormData({ interior_condition: value as any })}
            >
              <SelectTrigger className="text-lg">
                <SelectValue placeholder="Select interior condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-gray-500">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
