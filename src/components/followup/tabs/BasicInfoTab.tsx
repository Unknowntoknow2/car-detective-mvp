
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { MapPin, Gauge, Settings, User } from 'lucide-react';

interface BasicInfoTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function BasicInfoTab({ formData, updateFormData }: BasicInfoTabProps) {
  return (
    <div className="space-y-6">
      {/* Vehicle Location */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-blue-600" />
            Vehicle Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="zip-code" className="text-sm font-medium text-gray-700">ZIP Code</Label>
            <Input
              id="zip-code"
              value={formData.zip_code || ''}
              onChange={(e) => updateFormData({ zip_code: e.target.value })}
              placeholder="Enter ZIP code"
              className="mt-1 bg-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gauge className="h-5 w-5 text-green-600" />
            Vehicle Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mileage" className="text-sm font-medium text-gray-700">Current Mileage</Label>
            <Input
              id="mileage"
              type="number"
              value={formData.mileage || ''}
              onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || undefined })}
              placeholder="Enter current mileage"
              className="mt-1 bg-white"
            />
          </div>

          <div>
            <Label htmlFor="transmission" className="text-sm font-medium text-gray-700">Transmission Type</Label>
            <Select
              value={formData.transmission || ''}
              onValueChange={(value: 'automatic' | 'manual' | 'unknown') => 
                updateFormData({ transmission: value })
              }
            >
              <SelectTrigger className="mt-1 bg-white">
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle History */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-amber-600" />
            Vehicle History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="previous-use" className="text-sm font-medium text-gray-700">Previous Use</Label>
            <Select
              value={formData.previous_use || 'personal'}
              onValueChange={(value: 'personal' | 'fleet' | 'rental' | 'taxi' | 'government' | 'unknown') => 
                updateFormData({ previous_use: value })
              }
            >
              <SelectTrigger className="mt-1 bg-white">
                <SelectValue placeholder="Select previous use" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal Use</SelectItem>
                <SelectItem value="fleet">Fleet Vehicle</SelectItem>
                <SelectItem value="rental">Rental Vehicle</SelectItem>
                <SelectItem value="taxi">Taxi/Rideshare</SelectItem>
                <SelectItem value="government">Government Vehicle</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
