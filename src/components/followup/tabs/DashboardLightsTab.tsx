
import React from 'react';
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
    <div className="space-y-4">
      <div className="p-3 rounded-lg border bg-yellow-50 border-yellow-200">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <h3 className="font-medium text-sm">Dashboard Warning Lights</h3>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Select any warning lights that are currently on or have been intermittent
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          {DASHBOARD_LIGHTS.map((light) => (
            <div
              key={light}
              className={`p-2 rounded-md border transition-all cursor-pointer ${
                selectedLights.includes(light)
                  ? 'bg-yellow-100 border-yellow-300'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleLightToggle(light, !selectedLights.includes(light))}
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedLights.includes(light)}
                  onCheckedChange={(checked) => handleLightToggle(light, !!checked)}
                  className="pointer-events-none"
                />
                <span className="font-medium text-xs">{light}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedLights.length > 0 && (
          <div className="mt-3 p-2 bg-yellow-100 rounded-md border border-yellow-300">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Warning lights can impact value by $200-$1000 depending on severity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
