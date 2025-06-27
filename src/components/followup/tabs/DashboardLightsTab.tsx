
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Car, Zap, Thermometer, Disc, Shield, Info } from 'lucide-react';

interface DashboardLightsTabProps {
  formData: any;
  updateFormData: (updates: Partial<any>) => void;
}

const dashboardLights = [
  {
    category: 'Critical Issues',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
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
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
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
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
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
  const dashboardLightsList = Array.isArray(formData.dashboard_lights) ? formData.dashboard_lights : [];

  const handleLightChange = (lightValue: string, checked: boolean) => {
    console.log('Dashboard light change:', lightValue, checked);
    
    let updatedLights: string[];

    if (checked) {
      // Add the light if it's not already in the list
      if (!dashboardLightsList.includes(lightValue)) {
        updatedLights = [...dashboardLightsList, lightValue];
      } else {
        updatedLights = dashboardLightsList;
      }
    } else {
      // Remove the light from the list
      updatedLights = dashboardLightsList.filter((light: string) => light !== lightValue);
    }

    console.log('Updated dashboard lights:', updatedLights);
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

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'outline';
      case 'info': return 'secondary';
      default: return 'secondary';
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
            <Card key={category.category} className={`${category.borderColor} ${category.bgColor}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg ${category.color}`}>
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.lights.map((light) => {
                    const IconComponent = light.icon;
                    const isChecked = dashboardLightsList.includes(light.value);
                    
                    return (
                      <div
                        key={light.value}
                        className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                          isChecked 
                            ? `${getSeverityColor(light.severity)} ring-2 ring-blue-200` 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleLightChange(light.value, !isChecked)}
                      >
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id={light.value}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              console.log('Checkbox onCheckedChange:', light.value, checked);
                              handleLightChange(light.value, checked === true);
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <IconComponent className={`w-4 h-4 ${category.color}`} />
                                <Label 
                                  htmlFor={light.value} 
                                  className="cursor-pointer font-medium"
                                >
                                  {light.label}
                                </Label>
                              </div>
                              <Badge variant={getSeverityBadge(light.severity)} className="text-xs">
                                {light.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">
                              {light.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {dashboardLightsList.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium mb-2">
                      <strong>Warning Lights Detected ({dashboardLightsList.length})</strong>
                    </p>
                    <p className="text-sm text-yellow-700">
                      Active warning lights may significantly impact your vehicle's value. 
                      Consider having these issues diagnosed and repaired for the most accurate valuation.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {dashboardLightsList.map((lightValue: string) => {
                        const light = dashboardLights
                          .flatMap(cat => cat.lights)
                          .find(l => l.value === lightValue);
                        return light ? (
                          <Badge key={lightValue} variant="outline" className="text-xs">
                            {light.label}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
