
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface TiresBrakesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function TiresBrakesTab({ formData, updateFormData }: TiresBrakesTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tire & Brake Condition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tire-condition">Tire Condition</Label>
            <Select
              value={formData.tire_condition || 'good'}
              onValueChange={(value) => updateFormData({ tire_condition: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tire condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New (Less than 6 months old)</SelectItem>
                <SelectItem value="good">Good (Good tread remaining)</SelectItem>
                <SelectItem value="worn">Worn (Some wear but safe)</SelectItem>
                <SelectItem value="bald">Bald (Need replacement soon)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              {formData.tire_condition === 'new' && 'Adds significant value (+$300)'}
              {formData.tire_condition === 'good' && 'No impact on value'}
              {formData.tire_condition === 'worn' && 'Minor negative impact (-$200)'}
              {formData.tire_condition === 'bald' && 'Significant negative impact (-$500)'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
