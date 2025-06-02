
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface VehicleIssuesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const VEHICLE_ISSUES = [
  { key: 'smoking', label: 'Smoking odor or evidence', description: 'Can reduce value by $500-$1500' },
  { key: 'petDamage', label: 'Pet damage (scratches, odors)', description: 'Can reduce value by $200-$800' },
  { key: 'rust', label: 'Visible rust or corrosion', description: 'Can reduce value by $300-$2000' },
  { key: 'hailDamage', label: 'Hail damage (dents, dimples)', description: 'Can reduce value by $500-$3000' },
  { key: 'frame_damage', label: 'Frame or structural damage', description: 'Can reduce value by $2000-$8000' },
];

export function VehicleIssuesTab({ formData, updateFormData }: VehicleIssuesTabProps) {
  const hasAnyIssues = VEHICLE_ISSUES.some(issue => formData[issue.key as keyof FollowUpAnswers]);

  return (
    <div className="space-y-4">
      <div className="p-3 rounded-lg border bg-red-50 border-red-200">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <h3 className="font-medium text-sm">Vehicle Issues</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {VEHICLE_ISSUES.map((issue) => {
            const isSelected = formData[issue.key as keyof FollowUpAnswers] as boolean;
            
            return (
              <div
                key={issue.key}
                className={`p-2 rounded-md border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-100 border-red-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => updateFormData({ [issue.key]: !isSelected })}
              >
                <div className="flex items-start space-x-2">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => updateFormData({ [issue.key]: !!checked })}
                    className="pointer-events-none mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-xs">{issue.label}</div>
                    <div className="text-xs text-red-600 mt-1">{issue.description}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {hasAnyIssues && (
          <div className="mt-3 p-2 bg-red-100 rounded-md border border-red-300">
            <p className="text-xs text-red-800">
              <strong>Impact:</strong> These issues can significantly reduce your vehicle's value.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
