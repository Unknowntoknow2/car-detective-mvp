
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Car, Zap, Thermometer, Disc, Shield, Info } from 'lucide-react';

interface DashboardLightsTabProps {
  formData: any;
  updateFormData: (updates: Partial<any>) => void;
}

const dashboardLights = [
  {
    category: 'Critical Issues',
    color: 'text-red-600',
    lights: [
      {
        value: 'check_engine',
        label: 'Check Engine Light',
        icon: AlertTriangle,
        description: 'Engine malfunction detected',
        severity: 'critical'
      },
      {
        value: 'oil_pressure',
        label: 'Oil Pressure Warning',
        icon: Car,
        description: 'Low oil pressure or oil level',
        severity: 'critical'
      },
      {
        value: 'temperature',
        label: 'Engine Temperature',
        icon: Thermometer,
        description: 'Engine overheating warning',
        severity: 'critical'
      },
      {
        value: 'brake',
        label: 'Brake System Warning',
        icon: Disc,
        description: 'Brake system malfunction',
        severity: 'critical'
      }
    ]
  },
  {
    category: 'Safety Systems',
    color: 'text-orange-600',
    lights: [
      {
        value: 'abs',
        label: 'ABS Warning',
        icon: Shield,
        description: 'Anti-lock brake system issue',
        severity: 'warning'
      },
      {
        value: 'airbag',
        label: 'Airbag Warning',
        icon: Shield,
        description: 'Airbag system malfunction',
        severity: 'warning'
      },
      {
        value: 'tpms',
        label: 'TPMS Sensor',
        icon: Car,
        description: 'Tire pressure monitoring system',
        severity: 'warning'
      }
    ]
  },
  {
    category: 'Electrical System',
    color: 'text-yellow-600',
    lights: [
      {
        value: 'battery',
        label: 'Battery/Charging',
        icon: Zap,
        description: 'Charging system issue',
        severity: 'warning'
      },
      {
        value: 'service_required',
        label: 'Service Required',
        icon: Info,
        description: 'Scheduled maintenance due',
        severity: 'info'
      }
    ]
  }
];

export function DashboardLightsTab({ formData, updateFormData }: DashboardLightsTabProps) {
  const handleLightChange = (checked: boolean, lightValue: string) => {
    const currentLights = formData.dashboard_lights || [];
    let updatedLights;

    if (checked) {
      updatedLights = [...currentLights, lightValue];
    } else {
      updatedLights = currentLights.filter((light: string) => light !== lightValue);
    }

    updateFormData({ dashboard_lights: updatedLights });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚨 Dashboard Warning Lights
          </CardTitle>
          <p className="text-sm text-gray-600">
            Select any warning lights currently illuminated on your dashboard
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {dashboardLights.map((category) => (
            <div key={category.category} className="space-y-3">
              <h3 className={`font-medium ${category.color}`}>
                {category.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.lights.map((light) => {
                  const IconComponent = light.icon;
                  const isChecked = formData.dashboard_lights?.includes(light.value) || false;
                  
                  return (
                    <div
                      key={light.value}
                      className={`border rounded-lg p-3 transition-all duration-200 ${
                        isChecked 
                          ? `${getSeverityColor(light.severity)} ring-2 ring-blue-200` 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={light.value}
                          checked={isChecked}
                          onCheckedChange={(checked: boolean) => 
                            handleLightChange(checked, light.value)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <IconComponent className={`w-4 h-4 ${category.color}`} />
                            <Label 
                              htmlFor={light.value} 
                              className="cursor-pointer font-medium"
                            >
                              {light.label}
                            </Label>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {light.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          {formData.dashboard_lights?.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Active warning lights may significantly impact your vehicle's value. 
                Consider having these issues diagnosed and repaired for the most accurate valuation.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
