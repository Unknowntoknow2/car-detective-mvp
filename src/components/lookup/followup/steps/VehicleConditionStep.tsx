
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ConditionSelectorBar } from '@/components/common/ConditionSelectorBar';
import { TireConditionSelectorBar } from '@/components/common/TireConditionSelectorBar';
import { ExteriorConditionSelectorBar } from '@/components/common/ExteriorConditionSelectorBar';
import { InteriorConditionSelectorBar } from '@/components/common/InteriorConditionSelectorBar';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface VehicleConditionStepProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function VehicleConditionStep({ formData, updateFormData }: VehicleConditionStepProps) {
  const handleConditionChange = (value: string) => {
    updateFormData({ condition: value });
  };

  const handleTireConditionChange = (value: string) => {
    updateFormData({ tire_condition: value as "excellent" | "good" | "worn" | "replacement" });
  };

  const handleExteriorConditionChange = (value: string) => {
    updateFormData({ exterior_condition: value as "excellent" | "very-good" | "good" | "fair" | "poor" });
  };

  const handleInteriorConditionChange = (value: string) => {
    updateFormData({ interior_condition: value as "excellent" | "very-good" | "good" | "fair" | "poor" });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="condition">Overall Vehicle Condition</Label>
        <p className="text-sm text-muted-foreground">
          Select the overall condition of the vehicle.
        </p>
        <ConditionSelectorBar
          value={formData.condition || 'fair'}
          onChange={handleConditionChange}
        />
      </div>

      <div>
        <Label htmlFor="tire_condition">Tire Condition</Label>
        <p className="text-sm text-muted-foreground">
          Select the condition of the tires.
        </p>
        <TireConditionSelectorBar
          value={formData.tire_condition || 'fair'}
          onChange={handleTireConditionChange}
        />
      </div>

      <div>
        <Label htmlFor="exterior_condition">Exterior Condition</Label>
        <p className="text-sm text-muted-foreground">
          Select the condition of the vehicle's exterior.
        </p>
        <ExteriorConditionSelectorBar
          value={formData.exterior_condition || 'fair'}
          onChange={handleExteriorConditionChange}
        />
      </div>

      <div>
        <Label htmlFor="interior_condition">Interior Condition</Label>
        <p className="text-sm text-muted-foreground">
          Select the condition of the vehicle's interior.
        </p>
        <InteriorConditionSelectorBar
          value={formData.interior_condition || 'fair'}
          onChange={handleInteriorConditionChange}
        />
      </div>

      <div>
        <Label htmlFor="additional_notes">Additional Notes</Label>
        <Textarea
          id="additional_notes"
          placeholder="Any additional notes about the vehicle's condition?"
          value={formData.additional_notes || ''}
          onChange={(e) => updateFormData({ additional_notes: e.target.value })}
        />
      </div>
    </div>
  );
}
