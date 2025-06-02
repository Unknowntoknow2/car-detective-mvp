
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Dashboard Warning Lights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Select any warning lights that are currently on or have been intermittent
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DASHBOARD_LIGHTS.map((light) => (
              <div
                key={light}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedLights.includes(light)
                    ? 'bg-yellow-100 border-yellow-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleLightToggle(light, !selectedLights.includes(light))}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedLights.includes(light)}
                    onCheckedChange={(checked) => handleLightToggle(light, !!checked)}
                    className="pointer-events-none"
                  />
                  <span className="font-medium text-sm">{light}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedLights.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-300">
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
