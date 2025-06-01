
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle } from 'lucide-react';
import { FollowUpAnswers, DASHBOARD_LIGHTS } from '@/types/follow-up-answers';

interface DashboardLightsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function DashboardLightsTab({ formData, updateFormData }: DashboardLightsTabProps) {
  const selectedLights = formData.dashboard_lights || [];

  const handleLightToggle = (light: string, checked: boolean) => {
    if (checked) {
      updateFormData({ dashboard_lights: [...selectedLights, light] });
    } else {
      updateFormData({ dashboard_lights: selectedLights.filter(l => l !== light) });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
            Dashboard Warning Lights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select any warning lights that are currently on or have been intermittent
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {DASHBOARD_LIGHTS.map((light) => (
              <div key={light} className="flex items-center space-x-3">
                <Checkbox
                  id={light}
                  checked={selectedLights.includes(light)}
                  onCheckedChange={(checked) => handleLightToggle(light, !!checked)}
                />
                <Label htmlFor={light} className="cursor-pointer">
                  {light}
                </Label>
              </div>
            ))}
          </div>

          {selectedLights.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Warning lights typically reduce vehicle value and may indicate 
                necessary repairs. Each light can impact value by $200-$1000 depending on severity.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
