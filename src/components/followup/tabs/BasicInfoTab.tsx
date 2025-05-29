
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Car, MapPin, Gauge, AlertTriangle, Settings, Wrench } from 'lucide-react';
import { FollowUpAnswers, CONDITION_OPTIONS } from '@/types/follow-up-answers';

interface BasicInfoTabProps {
  formData: FollowUpAnswers;
  onUpdate: (updates: Partial<FollowUpAnswers>) => void;
}

const dashboardLights = [
  {
    id: 'check_engine',
    name: 'Check Engine Light',
    icon: '🔧',
    color: 'text-amber-500',
    description: 'Engine diagnostics warning'
  },
  {
    id: 'abs',
    name: 'ABS Warning Light',
    icon: '🛡️',
    color: 'text-red-500',
    description: 'Anti-lock brake system issue'
  },
  {
    id: 'tpms',
    name: 'TPMS (Tire Pressure)',
    icon: '🛞',
    color: 'text-orange-500',
    description: 'Tire pressure monitoring system'
  },
  {
    id: 'oil_change',
    name: 'Oil Change Light',
    icon: '🛢️',
    color: 'text-yellow-500',
    description: 'Oil change required'
  },
  {
    id: 'battery',
    name: 'Battery Warning',
    icon: '🔋',
    color: 'text-red-500',
    description: 'Charging system issue'
  },
  {
    id: 'coolant',
    name: 'Coolant Temperature',
    icon: '🌡️',
    color: 'text-blue-500',
    description: 'Engine temperature warning'
  },
  {
    id: 'airbag',
    name: 'Airbag Warning',
    icon: '🎈',
    color: 'text-red-500',
    description: 'Airbag system malfunction'
  },
  {
    id: 'brake',
    name: 'Brake System',
    icon: '⚠️',
    color: 'text-red-500',
    description: 'Brake system warning'
  }
];

export function BasicInfoTab({ formData, onUpdate }: BasicInfoTabProps) {
  const handleDashboardLightChange = (lightId: string, isActive: boolean) => {
    const currentLights = formData.dashboard_lights || [];
    let updatedLights;
    
    if (isActive) {
      updatedLights = [...currentLights, lightId];
    } else {
      updatedLights = currentLights.filter(id => id !== lightId);
    }
    
    onUpdate({ dashboard_lights: updatedLights });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-500" />
            Basic Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mileage and ZIP Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mileage" className="flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                Current Mileage
              </Label>
              <Input
                id="mileage"
                type="number"
                placeholder="e.g., 45000"
                value={formData.mileage || ''}
                onChange={(e) => onUpdate({ mileage: parseInt(e.target.value) || undefined })}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the current odometer reading
              </p>
            </div>

            <div>
              <Label htmlFor="zip-code" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                ZIP Code
              </Label>
              <Input
                id="zip-code"
                placeholder="e.g., 90210"
                maxLength={5}
                value={formData.zip_code || ''}
                onChange={(e) => onUpdate({ zip_code: e.target.value })}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Location affects market value and demand
              </p>
            </div>
          </div>

          {/* Vehicle Condition - Radio Button Style */}
          <div>
            <Label className="text-base font-medium mb-4 block">Overall Vehicle Condition</Label>
            <RadioGroup
              value={formData.condition || ''}
              onValueChange={(value) => onUpdate({ condition: value as any })}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {CONDITION_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex-1">
                    <Label htmlFor={option.value} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                    <div className="mt-2">
                      {option.value === 'excellent' && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">+15% to +20% value</span>
                      )}
                      {option.value === 'good' && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Market value baseline</span>
                      )}
                      {option.value === 'fair' && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">-10% to -20% value</span>
                      )}
                      {option.value === 'poor' && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">-25% to -40% value</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Dashboard Warning Lights */}
          <div>
            <Label className="text-base font-medium mb-4 block flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Dashboard Warning Lights
            </Label>
            <p className="text-sm text-gray-500 mb-4">
              Select any warning lights that are currently active on your dashboard
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {dashboardLights.map((light) => (
                <div
                  key={light.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                    formData.dashboard_lights?.includes(light.id)
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => 
                    handleDashboardLightChange(
                      light.id, 
                      !formData.dashboard_lights?.includes(light.id)
                    )
                  }
                >
                  <div className="text-center">
                    <div className={`text-2xl mb-2 ${light.color}`}>
                      {light.icon}
                    </div>
                    <div className="text-sm font-medium">{light.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{light.description}</div>
                    {formData.dashboard_lights?.includes(light.id) && (
                      <div className="mt-2">
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          Active
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Separate Exterior and Interior Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exterior-condition">Exterior Condition</Label>
              <Select
                value={formData.exterior_condition || ''}
                onValueChange={(value) => onUpdate({ exterior_condition: value as any })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select exterior condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="interior-condition">Interior Condition</Label>
              <Select
                value={formData.interior_condition || ''}
                onValueChange={(value) => onUpdate({ interior_condition: value as any })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select interior condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Previous Owners */}
          <div>
            <Label htmlFor="previous-owners">Number of Previous Owners</Label>
            <Select
              value={formData.previous_owners?.toString() || ''}
              onValueChange={(value) => onUpdate({ previous_owners: parseInt(value) || undefined })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select number of owners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 owner (you are second)</SelectItem>
                <SelectItem value="2">2 owners</SelectItem>
                <SelectItem value="3">3 owners</SelectItem>
                <SelectItem value="4">4+ owners</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
