
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface BasicInfoTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function BasicInfoTab({ formData, updateFormData }: BasicInfoTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zip-code">ZIP Code</Label>
              <Input
                id="zip-code"
                value={formData.zip_code || ''}
                onChange={(e) => updateFormData({ zip_code: e.target.value })}
                placeholder="Enter ZIP code"
              />
            </div>
            
            <div>
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage || ''}
                onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || 0 })}
                placeholder="Enter mileage"
              />
            </div>
          </div>

          <div>
            <Label>Overall Condition</Label>
            <div className="space-y-2 mt-2">
              <Slider
                value={[formData.condition === 'excellent' ? 90 : formData.condition === 'good' ? 75 : formData.condition === 'fair' ? 50 : 25]}
                onValueChange={([value]) => {
                  const condition = value >= 85 ? 'excellent' : value >= 65 ? 'good' : value >= 40 ? 'fair' : 'poor';
                  updateFormData({ condition: condition as any });
                }}
                max={100}
                min={0}
                step={25}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Poor</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Current: {formData.condition === 'excellent' ? 'Excellent (90%)' : 
                       formData.condition === 'good' ? 'Good (75%)' : 
                       formData.condition === 'fair' ? 'Fair (50%)' : 'Poor (25%)'}
            </p>
          </div>

          <div>
            <Label htmlFor="transmission">Transmission</Label>
            <Select
              value={formData.transmission || 'automatic'}
              onValueChange={(value) => updateFormData({ transmission: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exterior-condition">Exterior Condition</Label>
              <Select
                value={formData.exterior_condition || 'good'}
                onValueChange={(value) => updateFormData({ exterior_condition: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="interior-condition">Interior Condition</Label>
              <Select
                value={formData.interior_condition || 'good'}
                onValueChange={(value) => updateFormData({ interior_condition: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
