
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Car, MapPin, Gauge } from 'lucide-react';
import { FollowUpAnswers, CONDITION_OPTIONS } from '@/types/follow-up-answers';

interface BasicInfoTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function BasicInfoTab({ formData, updateFormData }: BasicInfoTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Car className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Basic Information</h2>
          <p className="text-gray-600 text-lg">Tell us about your vehicle's basic details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Overall Condition */}
        <Card className="border-blue-200 bg-blue-50/50 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-blue-700 text-xl">
              <Gauge className="h-6 w-6 mr-3" />
              Overall Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.condition || ''} 
              onValueChange={(value: 'excellent' | 'good' | 'fair' | 'poor') => updateFormData({ condition: value })}
            >
              <SelectTrigger className="h-14 text-lg bg-white border-2 border-blue-200 hover:border-blue-300 focus:border-blue-500">
                <SelectValue placeholder="Select overall condition" className="text-lg" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-blue-200">
                {CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="p-4 cursor-pointer hover:bg-blue-50">
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

        {/* Mileage */}
        <Card className="border-blue-200 bg-blue-50/50 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-blue-700 text-xl">
              <Gauge className="h-6 w-6 mr-3" />
              Current Mileage
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <Input
              type="number"
              placeholder="Enter mileage"
              value={formData.mileage || ''}
              onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || 0 })}
              className="h-14 text-lg font-semibold bg-white border-2 border-blue-200 hover:border-blue-300 focus:border-blue-500"
            />
            <p className="text-sm text-blue-600 mt-4 font-medium">Lower mileage typically means higher value</p>
          </CardContent>
        </Card>

        {/* ZIP Code */}
        <Card className="border-blue-200 bg-blue-50/50 md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-blue-700 text-xl">
              <MapPin className="h-6 w-6 mr-3" />
              Vehicle Location (ZIP Code)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Enter ZIP code"
              value={formData.zip_code || ''}
              onChange={(e) => updateFormData({ zip_code: e.target.value })}
              className="h-14 text-lg bg-white border-2 border-blue-200 hover:border-blue-300 focus:border-blue-500 max-w-md"
            />
            <p className="text-sm text-blue-600 mt-3 font-medium">Location affects market value</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
