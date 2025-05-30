
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Gauge, Settings, Star } from 'lucide-react';
import { FollowUpAnswers, CONDITION_OPTIONS } from '@/types/follow-up-answers';

interface BasicInfoTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function BasicInfoTab({ formData, updateFormData }: BasicInfoTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <MapPin className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
          <p className="text-gray-600">Tell us about your vehicle's location and condition</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Zip Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="zip_code">Zip Code</Label>
            <Input
              id="zip_code"
              placeholder="Enter zip code"
              value={formData.zip_code}
              onChange={(e) => updateFormData({ zip_code: e.target.value })}
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-2">
              This helps us determine local market values
            </p>
          </CardContent>
        </Card>

        {/* Mileage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Gauge className="h-5 w-5 mr-2" />
              Mileage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="mileage">Current Mileage</Label>
            <Input
              id="mileage"
              type="number"
              placeholder="Enter mileage"
              value={formData.mileage || ''}
              onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || 0 })}
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-2">
              Current odometer reading
            </p>
          </CardContent>
        </Card>

        {/* Overall Condition */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Star className="h-5 w-5 mr-2" />
              Overall Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="condition">Vehicle Condition</Label>
            <Select 
              value={formData.condition} 
              onValueChange={(value: 'excellent' | 'good' | 'fair' | 'poor') => updateFormData({ condition: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select overall condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-sm text-gray-500">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Transmission */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Settings className="h-5 w-5 mr-2" />
              Transmission Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="transmission">Transmission</Label>
            <Select 
              value={formData.transmission} 
              onValueChange={(value: 'automatic' | 'manual' | 'unknown') => updateFormData({ transmission: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select transmission type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
