
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
          <CardTitle>Vehicle Basics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="mileage">Current Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage || ''}
                onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || undefined })}
                placeholder="Enter current mileage"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="transmission">Transmission Type</Label>
              <Select
                value={formData.transmission || ''}
                onValueChange={(value: 'automatic' | 'manual' | 'unknown') => 
                  updateFormData({ transmission: value })
                }
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

            <div>
              <Label htmlFor="previous-use">Previous Use</Label>
              <Select
                value={formData.previous_use || 'personal'}
                onValueChange={(value: 'personal' | 'fleet' | 'rental' | 'taxi' | 'government' | 'unknown') => 
                  updateFormData({ previous_use: value })
                }
              >
                <SelectTrigger>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
