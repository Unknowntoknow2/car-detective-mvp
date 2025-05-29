
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, MapPin, Gauge } from 'lucide-react';
import { FollowUpAnswers, CONDITION_OPTIONS } from '@/types/follow-up-answers';

interface BasicInfoTabProps {
  formData: FollowUpAnswers;
  onUpdate: (updates: Partial<FollowUpAnswers>) => void;
}

export function BasicInfoTab({ formData, onUpdate }: BasicInfoTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-500" />
            Basic Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mileage */}
          <div>
            <Label htmlFor="mileage" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Current Mileage
            </Label>
            <Input
              id="mileage"
              type="number"
              placeholder="e.g., 45000"
              value={formData.mileage || ''}
              onChange={(e) => onUpdate({ mileage: parseInt(e.target.value) || undefined })}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the current odometer reading
            </p>
          </div>

          {/* ZIP Code */}
          <div>
            <Label htmlFor="zip-code" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              ZIP Code
            </Label>
            <Input
              id="zip-code"
              placeholder="e.g., 90210"
              maxLength={5}
              value={formData.zip_code || ''}
              onChange={(e) => onUpdate({ zip_code: e.target.value })}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Location affects market value and demand
            </p>
          </div>

          {/* Overall Condition */}
          <div>
            <Label htmlFor="condition">Overall Vehicle Condition</Label>
            <Select
              value={formData.condition || ''}
              onValueChange={(value) => onUpdate({ condition: value as any })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select overall condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Separate Exterior and Interior Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exterior-condition">Exterior Condition</Label>
              <Select
                value={formData.exterior_condition || ''}
                onValueChange={(value) => onUpdate({ exterior_condition: value as any })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select exterior condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="interior-condition">Interior Condition</Label>
              <Select
                value={formData.interior_condition || ''}
                onValueChange={(value) => onUpdate({ interior_condition: value as any })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select interior condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Previous Owners */}
          <div>
            <Label htmlFor="previous-owners">Number of Previous Owners</Label>
            <Select
              value={formData.previous_owners?.toString() || ''}
              onValueChange={(value) => onUpdate({ previous_owners: parseInt(value) || undefined })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select number of owners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 owner (you are second)</SelectItem>
                <SelectItem value="2">2 owners</SelectItem>
                <SelectItem value="3">3 owners</SelectItem>
                <SelectItem value="4">4+ owners</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
