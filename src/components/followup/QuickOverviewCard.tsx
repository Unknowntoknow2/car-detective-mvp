
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface QuickOverviewCardProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export function QuickOverviewCard({
  formData,
  updateFormData,
  onSubmit,
  onBack,
  isLoading
}: QuickOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Quick Overview - Critical Information</CardTitle>
          <Button variant="outline" size="sm" onClick={onBack}>
            Back to Detailed Form
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zip_code">ZIP Code *</Label>
            <Input
              id="zip_code"
              type="text"
              value={formData.zip_code || ''}
              onChange={(e) => updateFormData({ zip_code: e.target.value })}
              placeholder="Your ZIP code"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage *</Label>
            <Input
              id="mileage"
              type="number"
              value={formData.mileage || ''}
              onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || 0 })}
              placeholder="Current mileage"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="condition">Overall Condition *</Label>
            <Select
              value={formData.condition || 'good'}
              onValueChange={(value) => updateFormData({ condition: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="very-good">Very Good</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accidents">Any Accidents?</Label>
            <Select
              value={formData.accidents?.hadAccident ? 'yes' : 'no'}
              onValueChange={(value) => updateFormData({ 
                accidents: { 
                  ...formData.accidents,
                  hadAccident: value === 'yes'
                }
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <Button
            onClick={onSubmit}
            disabled={isLoading || !formData.zip_code || !formData.mileage}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Processing...' : 'Complete Valuation with Basic Info'}
          </Button>
          <p className="text-sm text-gray-600 mt-2 text-center">
            You can complete your valuation with just this basic information, or use the detailed form for a more accurate assessment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
