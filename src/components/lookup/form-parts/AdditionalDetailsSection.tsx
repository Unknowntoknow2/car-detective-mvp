
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface AdditionalDetailsSectionProps {
  tireCondition: 'excellent' | 'good' | 'worn' | 'replacement';
  setTireCondition: (value: 'excellent' | 'good' | 'worn' | 'replacement') => void;
  dashboardLights: string[];
  setDashboardLights: (value: string[]) => void;
  hasModifications: boolean;
  setHasModifications: (value: boolean) => void;
  modificationTypes: string[];
  setModificationTypes: (value: string[]) => void;
}

const DASHBOARD_LIGHTS = [
  { value: 'check_engine', label: 'Check Engine', impact: '-5% to -15% value' },
  { value: 'abs', label: 'ABS', impact: '-3% to -8% value' },
  { value: 'tire_pressure', label: 'Tire Pressure', impact: '-1% to -3% value' },
  { value: 'oil', label: 'Oil', impact: '-2% to -5% value' },
  { value: 'none', label: 'None', impact: 'No impact' }
];

const MODIFICATION_TYPES = [
  'Lift Kit', 'Performance Tune', 'Wrap/Paint', 'Exhaust System',
  'Wheels/Tires', 'Suspension', 'Audio System', 'Interior Modifications', 'Other'
];

export function AdditionalDetailsSection({
  tireCondition,
  setTireCondition,
  dashboardLights,
  setDashboardLights,
  hasModifications,
  setHasModifications,
  modificationTypes,
  setModificationTypes
}: AdditionalDetailsSectionProps) {
  const handleDashboardLightChange = (lightValue: string, checked: boolean) => {
    if (lightValue === 'none') {
      setDashboardLights(checked ? ['none'] : []);
    } else {
      const newLights = checked
        ? [...dashboardLights.filter(l => l !== 'none'), lightValue]
        : dashboardLights.filter(l => l !== lightValue);
      setDashboardLights(newLights);
    }
  };

  const handleModificationTypeChange = (modType: string, checked: boolean) => {
    const newTypes = checked
      ? [...modificationTypes, modType]
      : modificationTypes.filter(t => t !== modType);
    setModificationTypes(newTypes);
  };

  return (
    <div className="space-y-4 border-t pt-6">
      <h3 className="text-lg font-semibold">Additional Details</h3>
      
      <div>
        <Label htmlFor="tire-condition">Tire Condition</Label>
        <Select value={tireCondition} onValueChange={setTireCondition}>
          <SelectTrigger>
            <SelectValue placeholder="Select tire condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="excellent">Excellent (8/32"+ tread) (+2% to +3% value)</SelectItem>
            <SelectItem value="good">Good (6–7/32") (Neutral impact)</SelectItem>
            <SelectItem value="worn">Worn (3–5/32") (-1% to -2% value)</SelectItem>
            <SelectItem value="replacement">Needs Replacement (&lt;3/32") (-3% to -5% value)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Dashboard Warning Lights (Check all that apply)</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {DASHBOARD_LIGHTS.map((light) => (
            <div key={light.value} className="flex items-center space-x-2">
              <Checkbox
                id={`light-${light.value}`}
                checked={dashboardLights.includes(light.value)}
                onCheckedChange={(checked) => handleDashboardLightChange(light.value, checked as boolean)}
              />
              <Label htmlFor={`light-${light.value}`} className="text-sm">
                {light.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Has the vehicle been modified?</Label>
        <div className="flex gap-4 mt-2">
          <button
            type="button"
            onClick={() => setHasModifications(false)}
            className={`px-4 py-2 rounded-md border ${
              !hasModifications 
                ? 'bg-green-100 border-green-300 text-green-800' 
                : 'bg-gray-50 border-gray-300'
            }`}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => setHasModifications(true)}
            className={`px-4 py-2 rounded-md border ${
              hasModifications 
                ? 'bg-yellow-100 border-yellow-300 text-yellow-800' 
                : 'bg-gray-50 border-gray-300'
            }`}
          >
            Yes
          </button>
        </div>
      </div>

      {hasModifications && (
        <div>
          <Label>Types of Modifications (Check all that apply)</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {MODIFICATION_TYPES.map((modType) => (
              <div key={modType} className="flex items-center space-x-2">
                <Checkbox
                  id={`mod-${modType}`}
                  checked={modificationTypes.includes(modType)}
                  onCheckedChange={(checked) => handleModificationTypeChange(modType, checked as boolean)}
                />
                <Label htmlFor={`mod-${modType}`} className="text-sm">
                  {modType}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
