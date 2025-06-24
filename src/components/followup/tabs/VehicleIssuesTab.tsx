
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { AlertTriangle } from 'lucide-react';

interface VehicleIssuesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const commonIssues = [
  'Check Engine Light',
  'ABS Light',
  'Airbag Light',
  'Battery Light',
  'Oil Pressure Light',
  'Temperature Warning',
  'Brake Warning Light',
  'Transmission Warning',
  'Low Fuel Light',
  'Service Required Light'
];

export function VehicleIssuesTab({ formData, updateFormData }: VehicleIssuesTabProps) {
  const handleDashboardLightChange = (light: string, checked: boolean) => {
    const currentLights = formData.dashboard_lights || [];
    let updatedLights;
    
    if (checked) {
      updatedLights = [...currentLights, light];
    } else {
      updatedLights = currentLights.filter(l => l !== light);
    }
    
    updateFormData({ dashboard_lights: updatedLights });
  };

  const handleNotesChange = (notes: string) => {
    updateFormData({ additional_notes: notes });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Dashboard Warning Lights
          </CardTitle>
          <p className="text-sm text-gray-600">
            Select any warning lights currently active on your dashboard
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {commonIssues.map((issue) => (
              <div key={issue} className="flex items-center space-x-2">
                <Checkbox
                  id={issue}
                  checked={formData.dashboard_lights?.includes(issue) || false}
                  onCheckedChange={(checked) => 
                    handleDashboardLightChange(issue, checked as boolean)
                  }
                />
                <Label htmlFor={issue} className="text-sm">
                  {issue}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
          <p className="text-sm text-gray-600">
            Describe any other issues, concerns, or notable features about your vehicle
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe any other issues, recent repairs, unusual noises, or anything else we should know about your vehicle..."
            value={formData.additional_notes || ''}
            onChange={(e) => handleNotesChange(e.target.value)}
            rows={4}
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}
