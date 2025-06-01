
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Gauge, Disc } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface TiresBrakesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function TiresBrakesTab({ formData, updateFormData }: TiresBrakesTabProps) {
  const getTireConditionImpact = (condition: string) => {
    switch (condition) {
      case 'new': return { amount: 300, color: 'text-green-600' };
      case 'good': return { amount: 0, color: 'text-gray-600' };
      case 'worn': return { amount: -200, color: 'text-orange-600' };
      case 'bald': return { amount: -500, color: 'text-red-600' };
      default: return { amount: 0, color: 'text-gray-600' };
    }
  };

  const getBrakeConditionImpact = (condition: string) => {
    switch (condition) {
      case 'new': return { amount: 200, color: 'text-green-600' };
      case 'good': return { amount: 0, color: 'text-gray-600' };
      case 'fair': return { amount: -150, color: 'text-orange-600' };
      case 'poor': return { amount: -400, color: 'text-red-600' };
      default: return { amount: 0, color: 'text-gray-600' };
    }
  };

  const tireImpact = getTireConditionImpact(formData.tire_condition || 'good');
  const brakeImpact = getBrakeConditionImpact(formData.brake_condition || 'good');

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <Gauge className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tires & Brakes</h2>
          <p className="text-gray-600">Condition of your vehicle's tires and braking system</p>
        </div>
      </div>

      {/* Tire Condition */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gauge className="h-5 w-5 mr-2 text-orange-500" />
            Tire Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tire-condition">Overall Tire Condition</Label>
            <Select
              value={formData.tire_condition || 'good'}
              onValueChange={(value) => updateFormData({ tire_condition: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tire condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">
                  <div className="flex items-center justify-between w-full">
                    <span>New (Less than 6 months old)</span>
                  </div>
                </SelectItem>
                <SelectItem value="good">
                  <div className="flex items-center justify-between w-full">
                    <span>Good (Good tread remaining)</span>
                  </div>
                </SelectItem>
                <SelectItem value="worn">
                  <div className="flex items-center justify-between w-full">
                    <span>Worn (Some wear but safe)</span>
                  </div>
                </SelectItem>
                <SelectItem value="bald">
                  <div className="flex items-center justify-between w-full">
                    <span>Bald (Need replacement soon)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground">
                {formData.tire_condition === 'new' && 'Adds significant value - new tires are a major selling point'}
                {formData.tire_condition === 'good' && 'No impact on value - expected condition'}
                {formData.tire_condition === 'worn' && 'Minor negative impact - buyers may negotiate'}
                {formData.tire_condition === 'bald' && 'Significant negative impact - immediate replacement needed'}
              </p>
              <Badge variant={tireImpact.amount >= 0 ? "default" : "destructive"}>
                <span className={tireImpact.color}>
                  {tireImpact.amount >= 0 ? '+' : ''}${tireImpact.amount}
                </span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brake Condition */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Disc className="h-5 w-5 mr-2 text-red-500" />
            Brake Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="brake-condition">Brake System Condition</Label>
            <Select
              value={formData.brake_condition || 'good'}
              onValueChange={(value) => updateFormData({ brake_condition: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brake condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">
                  <div className="flex items-center justify-between w-full">
                    <span>New/Recently Serviced</span>
                  </div>
                </SelectItem>
                <SelectItem value="good">
                  <div className="flex items-center justify-between w-full">
                    <span>Good (No issues, good pad life)</span>
                  </div>
                </SelectItem>
                <SelectItem value="fair">
                  <div className="flex items-center justify-between w-full">
                    <span>Fair (Some wear, service soon)</span>
                  </div>
                </SelectItem>
                <SelectItem value="poor">
                  <div className="flex items-center justify-between w-full">
                    <span>Poor (Needs immediate service)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground">
                {formData.brake_condition === 'new' && 'Adds value - recent brake service is appealing to buyers'}
                {formData.brake_condition === 'good' && 'No impact on value - expected condition'}
                {formData.brake_condition === 'fair' && 'Minor negative impact - buyers factor in upcoming service'}
                {formData.brake_condition === 'poor' && 'Significant negative impact - safety concern for buyers'}
              </p>
              <Badge variant={brakeImpact.amount >= 0 ? "default" : "destructive"}>
                <span className={brakeImpact.color}>
                  {brakeImpact.amount >= 0 ? '+' : ''}${brakeImpact.amount}
                </span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Combined Impact Summary */}
      {(formData.tire_condition !== 'good' || formData.brake_condition !== 'good') && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-800">Total Tires & Brakes Impact</h4>
                <p className="text-sm text-blue-600">Combined effect on vehicle value</p>
              </div>
              <Badge variant="outline" className="bg-white">
                <span className={tireImpact.amount + brakeImpact.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {tireImpact.amount + brakeImpact.amount >= 0 ? '+' : ''}${tireImpact.amount + brakeImpact.amount}
                </span>
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
