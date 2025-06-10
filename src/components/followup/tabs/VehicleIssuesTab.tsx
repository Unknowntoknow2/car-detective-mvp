import React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface VehicleIssuesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const issues = [
  { value: 'engine_trouble', label: 'Engine Trouble' },
  { value: 'transmission_problems', label: 'Transmission Problems' },
  { value: 'electrical_issues', label: 'Electrical Issues' },
  { value: 'brake_problems', label: 'Brake Problems' },
  { value: 'suspension_problems', label: 'Suspension Problems' },
  { value: 'cooling_system_issues', label: 'Cooling System Issues' },
  { value: 'exhaust_system_problems', label: 'Exhaust System Problems' },
  { value: 'fuel_system_issues', label: 'Fuel System Issues' },
  { value: 'steering_problems', label: 'Steering Problems' },
  { value: 'other_mechanical_issues', label: 'Other Mechanical Issues' },
];

export function VehicleIssuesTab({ formData, updateFormData }: VehicleIssuesTabProps) {
  const handleIssueChange = (checked: boolean, issueType: string) => {
    const currentLights = formData.dashboard_lights || [];
    let updatedLights;

    if (checked) {
      updatedLights = [...currentLights, issueType];
    } else {
      updatedLights = currentLights.filter(light => light !== issueType);
    }

    updateFormData({ dashboard_lights: updatedLights });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {issues.map(issue => (
          <div key={issue.value} className="flex items-center space-x-2">
            <Checkbox
              id={issue.value}
              checked={formData.dashboard_lights?.includes(issue.value) || false}
              onCheckedChange={(checked) => handleIssueChange(checked, issue.value)}
            />
            <Label htmlFor={issue.value} className="cursor-pointer">
              {issue.label}
            </Label>
          </div>
        ))}
      </div>

      <div>
        <Label htmlFor="additional_notes">Additional Notes</Label>
        <Textarea
          id="additional_notes"
          placeholder="Any other issues or notes about the vehicle's condition?"
          value={formData.additional_notes || ''}
          onChange={(e) => updateFormData({ additional_notes: e.target.value })}
        />
      </div>
    </div>
  );
}
