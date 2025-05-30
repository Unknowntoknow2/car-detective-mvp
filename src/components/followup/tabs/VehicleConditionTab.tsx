
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Car, Palette, Home, AlertTriangle } from 'lucide-react';
import { FollowUpAnswers, CONDITION_OPTIONS, TIRE_CONDITION_OPTIONS, DASHBOARD_LIGHTS } from '@/types/follow-up-answers';

interface VehicleConditionTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function VehicleConditionTab({ formData, updateFormData }: VehicleConditionTabProps) {
  const handleDashboardLightChange = (light: string, checked: boolean) => {
    const currentLights = formData.dashboard_lights || [];
    if (checked) {
      updateFormData({ dashboard_lights: [...currentLights, light] });
    } else {
      updateFormData({ dashboard_lights: currentLights.filter(l => l !== light) });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <Car className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Vehicle Condition</h2>
          <p className="text-gray-600 text-lg">Detailed condition assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Exterior Condition */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-green-700 text-xl">
              <Palette className="h-6 w-6 mr-3" />
              Exterior Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.exterior_condition || ''} 
              onValueChange={(value: 'excellent' | 'good' | 'fair' | 'poor') => updateFormData({ exterior_condition: value })}
            >
              <SelectTrigger className="h-14 text-lg bg-white border-2 border-green-200 hover:border-green-300 focus:border-green-500">
                <SelectValue placeholder="Select exterior condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold text-base">{option.label}</span>
                      <span className="text-sm text-gray-600">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Interior Condition */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-green-700 text-xl">
              <Home className="h-6 w-6 mr-3" />
              Interior Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.interior_condition || ''} 
              onValueChange={(value: 'excellent' | 'good' | 'fair' | 'poor') => updateFormData({ interior_condition: value })}
            >
              <SelectTrigger className="h-14 text-lg bg-white border-2 border-green-200 hover:border-green-300 focus:border-green-500">
                <SelectValue placeholder="Select interior condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold text-base">{option.label}</span>
                      <span className="text-sm text-gray-600">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Tire Condition */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-green-700 text-xl">
              <Car className="h-6 w-6 mr-3" />
              Tire Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.tire_condition || ''} 
              onValueChange={(value: 'new' | 'good' | 'worn' | 'bald') => updateFormData({ tire_condition: value })}
            >
              <SelectTrigger className="h-14 text-lg bg-white border-2 border-green-200 hover:border-green-300 focus:border-green-500">
                <SelectValue placeholder="Select tire condition" />
              </SelectTrigger>
              <SelectContent>
                {TIRE_CONDITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold text-base">{option.label}</span>
                      <span className="text-sm text-gray-600">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Dashboard Warning Lights */}
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-orange-700 text-xl">
              <AlertTriangle className="h-6 w-6 mr-3" />
              Dashboard Warning Lights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {DASHBOARD_LIGHTS.map((light) => (
                <div key={light} className="flex items-center space-x-3">
                  <Checkbox
                    id={light}
                    checked={formData.dashboard_lights?.includes(light) || false}
                    onCheckedChange={(checked) => handleDashboardLightChange(light, !!checked)}
                  />
                  <Label htmlFor={light} className="text-base cursor-pointer">
                    {light}
                  </Label>
                </div>
              ))}
            </div>
            {formData.dashboard_lights && formData.dashboard_lights.length === 0 && (
              <p className="text-sm text-green-600 mt-4 font-medium">
                No warning lights selected - Great!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Additional Condition Issues */}
        <Card className="border-red-200 bg-red-50/50 md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-red-700 text-xl">
              <AlertTriangle className="h-6 w-6 mr-3" />
              Additional Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="smoking"
                  checked={formData.smoking || false}
                  onCheckedChange={(checked) => updateFormData({ smoking: !!checked })}
                />
                <Label htmlFor="smoking" className="cursor-pointer">Smoking Odor</Label>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="petDamage"
                  checked={formData.petDamage || false}
                  onCheckedChange={(checked) => updateFormData({ petDamage: !!checked })}
                />
                <Label htmlFor="petDamage" className="cursor-pointer">Pet Damage</Label>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="rust"
                  checked={formData.rust || false}
                  onCheckedChange={(checked) => updateFormData({ rust: !!checked })}
                />
                <Label htmlFor="rust" className="cursor-pointer">Rust</Label>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="hailDamage"
                  checked={formData.hailDamage || false}
                  onCheckedChange={(checked) => updateFormData({ hailDamage: !!checked })}
                />
                <Label htmlFor="hailDamage" className="cursor-pointer">Hail Damage</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
