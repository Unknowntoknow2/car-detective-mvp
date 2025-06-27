
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ConditionTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function ConditionTab({ formData, updateFormData }: ConditionTabProps) {
  const handleLightChange = (checked: boolean, lightValue: string) => {
    const currentLights = formData.dashboard_lights || [];
    let updatedLights;

    if (checked) {
      updatedLights = [...currentLights, lightValue];
    } else {
      updatedLights = currentLights.filter((light: string) => light !== lightValue);
    }

    updateFormData({ dashboard_lights: updatedLights });
  };

  const dashboardLights = [
    'Check Engine',
    'Oil Pressure', 
    'Battery',
    'Brake',
    'ABS',
    'Airbag'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔧 Vehicle Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tire_condition" className="text-sm font-medium">
              Tire Condition
            </Label>
            <Select 
              value={formData.tire_condition || ''} 
              onValueChange={(value) => updateFormData({ tire_condition: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select tire condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Assess the overall condition of your tires
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Dashboard Warning Lights</Label>
            <p className="text-xs text-gray-500">
              Select any warning lights currently illuminated on your dashboard
            </p>
            <div className="grid grid-cols-2 gap-3">
              {dashboardLights.map((light) => {
                const isChecked = formData.dashboard_lights?.includes(light) || false;
                
                return (
                  <div key={light} className="flex items-center space-x-2">
                    <Checkbox
                      id={light}
                      checked={isChecked}
                      onCheckedChange={(checked: boolean) => 
                        handleLightChange(checked, light)
                      }
                    />
                    <Label 
                      htmlFor={light} 
                      className="cursor-pointer text-sm"
                    >
                      {light}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
