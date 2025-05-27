
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, AlertCircle } from 'lucide-react';
import { DASHBOARD_LIGHTS } from '@/types/follow-up-answers';

interface DashboardLightsSectionProps {
  value?: string[];
  onChange: (value: string[]) => void;
}

export function DashboardLightsSection({ value = [], onChange }: DashboardLightsSectionProps) {
  const handleLightChange = (lightValue: string, checked: boolean) => {
    if (lightValue === 'none') {
      // If "None" is selected, clear all others
      onChange(checked ? ['none'] : []);
    } else {
      // Remove "none" if selecting any specific light
      const newValue = value.filter(v => v !== 'none');
      if (checked) {
        onChange([...newValue, lightValue]);
      } else {
        onChange(newValue.filter(v => v !== lightValue));
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-lg">Dashboard Warning Lights</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Active warning lights may require immediate repair or diagnostics.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Label className="text-base font-medium mb-4 block">
          Which warning lights are currently active?
        </Label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DASHBOARD_LIGHTS.map((light: typeof DASHBOARD_LIGHTS[number]) => (
            <div
              key={light.value}
              className={`p-3 rounded-lg border transition-all ${
                value.includes(light.value)
                  ? 'bg-primary/5 border-primary'
                  : 'bg-muted/30 border-muted hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={light.value}
                  checked={value.includes(light.value)}
                  onCheckedChange={(checked) => 
                    handleLightChange(light.value, checked as boolean)
                  }
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{light.icon}</span>
                    <Label htmlFor={light.value} className="font-medium cursor-pointer">
                      {light.label}
                    </Label>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {light.impact}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
