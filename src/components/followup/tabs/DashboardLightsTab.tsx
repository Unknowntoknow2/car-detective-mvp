
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface DashboardLightsTabProps {
  formData: any;
  updateFormData: (updates: Partial<any>) => void;
}

const lights = [
  { value: 'abs', label: 'ABS' },
  { value: 'check_engine', label: 'Check Engine' },
  { value: 'battery', label: 'Battery' },
  { value: 'oil_pressure', label: 'Oil Pressure' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'brake', label: 'Brake' },
  { value: 'airbag', label: 'Airbag' },
];

export function DashboardLightsTab({ formData, updateFormData }: DashboardLightsTabProps) {
  const handleLightChange = (checked: boolean, lightType: string) => {
    const currentLights = formData.dashboard_lights || [];
    let updatedLights;

    if (checked) {
      updatedLights = [...currentLights, lightType];
    } else {
      updatedLights = currentLights.filter((light: string) => light !== lightType);
    }

    updateFormData({ dashboard_lights: updatedLights });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Are any dashboard lights currently on?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lights.map((light) => (
          <div key={light.value} className="flex items-center space-x-2">
            <Checkbox
              id={light.value}
              checked={formData.dashboard_lights?.includes(light.value)}
              onCheckedChange={(checked: boolean) => handleLightChange(checked, light.value)}
            />
            <Label htmlFor={light.value} className="cursor-pointer">
              {light.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
