
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
      updateFormData({ dashboard_lights: checked ? ['none'] : [] });
    } else {
      const filteredLights = currentLights.filter(light => light !== 'none');
      
      if (checked) {
        updateFormData({ dashboard_lights: [...filteredLights, lightValue] });
      } else {
        updateFormData({ dashboard_lights: filteredLights.filter(light => light !== lightValue) });
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
          <Car className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Physical Features</h2>
          <p className="text-gray-600 text-lg">Assess tires, lights, and physical condition</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tire Condition */}
        <Card className="border-orange-200 bg-orange-50/50 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-orange-700 text-xl">
              <Car className="h-6 w-6 mr-3" />
              Tire Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.tire_condition || ''} 
              onValueChange={(value) => updateFormData({ tire_condition: value })}
            >
              <SelectTrigger className="h-14 text-lg bg-white border-2 border-orange-200 hover:border-orange-300 focus:border-orange-500">
                <SelectValue placeholder="Select tire condition" className="text-lg" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-orange-200">
                {TIRE_CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="p-4 cursor-pointer hover:bg-orange-50">
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold text-base">{option.label}</span>
                      <span className="text-sm text-gray-600">{option.impact}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Frame Damage */}
        <Card className="border-orange-200 bg-orange-50/50 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-orange-700 text-xl">
              <AlertTriangle className="h-6 w-6 mr-3" />
              Frame Damage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border-2 border-orange-200">
              <Checkbox
                id="frame-damage"
                checked={formData.frame_damage || false}
                onCheckedChange={(checked) => updateFormData({ frame_damage: !!checked })}
                className="h-5 w-5"
              />
              <Label htmlFor="frame-damage" className="text-lg font-semibold cursor-pointer">
                Vehicle has frame damage
              </Label>
            </div>
            <p className="text-sm text-orange-600 font-medium">Frame damage significantly affects value</p>
          </CardContent>
        </Card>

        {/* Dashboard Warning Lights */}
        <Card className="border-orange-200 bg-orange-50/50 md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-orange-700 text-xl">
              <Eye className="h-6 w-6 mr-3" />
              Dashboard Warning Lights
            </CardTitle>
            <p className="text-gray-600 mt-2">Select any warning lights that are currently active on your dashboard</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DASHBOARD_LIGHTS.map((light) => (
                <div key={light.value} className="p-4 bg-white rounded-lg border-2 border-orange-200 hover:border-orange-300 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      id={light.value}
                      checked={(formData.dashboard_lights || []).includes(light.value)}
                      onCheckedChange={(checked) => handleDashboardLightToggle(light.value, !!checked)}
                      className="h-5 w-5"
                    />
                    <Label htmlFor={light.value} className="flex items-center cursor-pointer flex-1">
                      <span className="text-2xl mr-3">{light.icon}</span>
                      <div className="flex flex-col">
                        <span className="font-semibold text-base">{light.label}</span>
                        <span className="text-sm text-gray-600">{light.impact}</span>
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
