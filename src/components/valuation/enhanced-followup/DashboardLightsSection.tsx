
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, AlertCircle, Lock } from 'lucide-react';
import { DASHBOARD_LIGHTS } from '@/types/follow-up-answers';

/**
 * ⚠️ LOCKED COMPONENT - DO NOT MODIFY ⚠️
 * This dashboard lights section is locked and should not be modified.
 * All functionality is working correctly and has been protected.
 */

interface DashboardLightsSectionProps {
  value?: string[];
  onChange: (value: string[]) => void;
  readonly?: boolean;
}

export function DashboardLightsSection({ value = [], onChange, readonly = true }: DashboardLightsSectionProps) {
  // PROTECTION: This component is locked
  if (!readonly) {
    console.warn("DashboardLightsSection: Component is locked for modifications");
  }

  const handleLightChange = (lightValue: string, checked: boolean) => {
    if (readonly) {
      console.warn("DashboardLightsSection: Selection blocked - component is locked");
      return;
    }

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
    <Card className="relative">
      {/* Lock indicator */}
      <div className="absolute top-2 right-2 z-10">
        <Lock className="w-4 h-4 text-gray-400" />
      </div>
      
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-lg">
            Dashboard Warning Lights
            {readonly && <span className="ml-2 text-xs text-gray-400">(Locked)</span>}
          </CardTitle>
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
          {DASHBOARD_LIGHTS.map((light) => (
            <div
              key={light.value}
              className={`p-3 rounded-lg border transition-all ${
                value.includes(light.value)
                  ? 'bg-primary/5 border-primary'
                  : readonly
                  ? 'bg-gray-50 border-gray-200 cursor-not-allowed'
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
                  disabled={readonly}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{light.icon}</span>
                    <Label 
                      htmlFor={light.value} 
                      className={`font-medium ${readonly ? 'cursor-not-allowed text-gray-500' : 'cursor-pointer'}`}
                    >
                      {light.label}
                    </Label>
                  </div>
                  <div className={`text-xs mt-1 ${readonly ? 'text-gray-400' : 'text-muted-foreground'}`}>
                    {light.impact}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {readonly && (
          <div className="flex items-center gap-2 mt-4 text-amber-600 text-sm">
            <Lock className="h-4 w-4" />
            <span>This component is locked and protected from modifications</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
