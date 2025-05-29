
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Car, AlertTriangle, Eye, CheckCircle } from 'lucide-react';
import { FollowUpAnswers, TIRE_CONDITION_OPTIONS, DASHBOARD_LIGHTS } from '@/types/follow-up-answers';

interface PhysicalFeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function PhysicalFeaturesTab({ formData, updateFormData }: PhysicalFeaturesTabProps) {
  const handleDashboardLightToggle = (lightValue: string, checked: boolean) => {
    const currentLights = formData.dashboard_lights || [];
    
    if (lightValue === 'none') {
      // If "None" is selected, clear all other lights
      updateFormData({ dashboard_lights: checked ? ['none'] : [] });
    } else {
      // Remove "none" if any other light is selected
      const filteredLights = currentLights.filter(light => light !== 'none');
      
      if (checked) {
        updateFormData({ dashboard_lights: [...filteredLights, lightValue] });
      } else {
        updateFormData({ dashboard_lights: filteredLights.filter(light => light !== lightValue) });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
          <Car className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Physical Features</h2>
          <p className="text-gray-600">Assess tires, lights, and physical condition</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tire Condition */}
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-orange-700">
              <Car className="h-5 w-5 mr-2" />
              Tire Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.tire_condition || ''} 
              onValueChange={(value) => updateFormData({ tire_condition: value })}
            >
              <SelectTrigger className="text-lg">
                <SelectValue placeholder="Select tire condition" />
              </SelectTrigger>
              <SelectContent>
                {TIRE_CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-gray-500">{option.impact}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Frame Damage */}
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-orange-700">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Frame Damage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="frame-damage"
                checked={formData.frame_damage || false}
                onCheckedChange={(checked) => updateFormData({ frame_damage: !!checked })}
              />
              <Label htmlFor="frame-damage" className="text-lg">
                Vehicle has frame damage
              </Label>
            </div>
            <p className="text-xs text-orange-600 mt-1">Frame damage significantly affects value</p>
          </CardContent>
        </Card>

        {/* Dashboard Warning Lights */}
        <Card className="border-orange-200 bg-orange-50/50 md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-orange-700">
              <Eye className="h-5 w-5 mr-2" />
              Dashboard Warning Lights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {DASHBOARD_LIGHTS.map((light) => (
                <div key={light.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={light.value}
                    checked={(formData.dashboard_lights || []).includes(light.value)}
                    onCheckedChange={(checked) => handleDashboardLightToggle(light.value, !!checked)}
                  />
                  <Label htmlFor={light.value} className="flex items-center cursor-pointer">
                    <span className="text-lg mr-2">{light.icon}</span>
                    <div className="flex flex-col">
                      <span className="font-medium">{light.label}</span>
                      <span className="text-xs text-gray-500">{light.impact}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
