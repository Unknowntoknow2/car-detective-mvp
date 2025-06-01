
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface BasicInfoTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function BasicInfoTab({ formData, updateFormData }: BasicInfoTabProps) {
  const dashboardLights = [
    'Check Engine',
    'ABS',
    'Airbag',
    'Oil Pressure',
    'Battery',
    'Temperature',
    'Brake',
    'Tire Pressure'
  ];

  const handleDashboardLightChange = (light: string, checked: boolean) => {
    const currentLights = formData.dashboard_lights || [];
    const updatedLights = checked
      ? [...currentLights, light]
      : currentLights.filter(l => l !== light);
    updateFormData({ dashboard_lights: updatedLights });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zip-code">ZIP Code</Label>
              <Input
                id="zip-code"
                type="text"
                maxLength={5}
                value={formData.zip_code}
                onChange={(e) => updateFormData({ zip_code: e.target.value })}
                placeholder="12345"
              />
            </div>
            
            <div>
              <Label htmlFor="mileage">Current Mileage</Label>
              <Input
                id="mileage"
                type="number"
                min="0"
                value={formData.mileage || ''}
                onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || 0 })}
                placeholder="e.g., 50000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="transmission">Transmission Type</Label>
            <Select
              value={formData.transmission || 'automatic'}
              onValueChange={(value) => updateFormData({ transmission: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Condition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="overall-condition">Overall Condition</Label>
            <Select
              value={formData.condition || 'good'}
              onValueChange={(value) => updateFormData({ condition: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exterior-condition">Exterior Condition</Label>
              <Select
                value={formData.exterior_condition || 'good'}
                onValueChange={(value) => updateFormData({ exterior_condition: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exterior condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="interior-condition">Interior Condition</Label>
              <Select
                value={formData.interior_condition || 'good'}
                onValueChange={(value) => updateFormData({ interior_condition: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interior condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="tire-condition">Tire Condition</Label>
            <Select
              value={formData.tire_condition || 'good'}
              onValueChange={(value) => updateFormData({ tire_condition: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tire condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="worn">Worn</SelectItem>
                <SelectItem value="bald">Need Replacement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Issues</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Dashboard Warning Lights</Label>
            <div className="grid grid-cols-2 gap-2">
              {dashboardLights.map((light) => (
                <div key={light} className="flex items-center space-x-2">
                  <Checkbox
                    id={`light-${light}`}
                    checked={(formData.dashboard_lights || []).includes(light)}
                    onCheckedChange={(checked) => handleDashboardLightChange(light, checked as boolean)}
                  />
                  <Label htmlFor={`light-${light}`} className="text-sm">{light}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="smoking-toggle"
                checked={formData.smoking || false}
                onCheckedChange={(checked) => updateFormData({ smoking: checked })}
              />
              <Label htmlFor="smoking-toggle">Smoking History</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="pet-damage-toggle"
                checked={formData.petDamage || false}
                onCheckedChange={(checked) => updateFormData({ petDamage: checked })}
              />
              <Label htmlFor="pet-damage-toggle">Pet Damage</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="rust-toggle"
                checked={formData.rust || false}
                onCheckedChange={(checked) => updateFormData({ rust: checked })}
              />
              <Label htmlFor="rust-toggle">Rust Present</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hail-damage-toggle"
                checked={formData.hailDamage || false}
                onCheckedChange={(checked) => updateFormData({ hailDamage: checked })}
              />
              <Label htmlFor="hail-damage-toggle">Hail Damage</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
