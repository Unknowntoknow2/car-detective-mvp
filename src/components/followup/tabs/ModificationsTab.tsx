import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ModificationsTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const modificationTypes = [
  'Lift Kit',
  'Performance Tune',
  'Custom Paint Job',
  'Tinted Windows',
  'Upgraded Sound System',
  'Custom Wheels',
  'Other'
];

export function ModificationsTab({ formData, updateFormData }: ModificationsTabProps) {
  const handleModificationChange = (checked: boolean, modType: string) => {
    const currentMods = formData.modifications?.types || [];
    let updatedMods;

    if (checked) {
      updatedMods = [...currentMods, modType];
    } else {
      updatedMods = currentMods.filter((mod: string) => mod !== modType);
    }

    updateFormData({
      modifications: {
        ...formData.modifications,
        hasModifications: true,
        types: updatedMods
      }
    });
  };

  const handleAdditionalNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({
      modifications: {
        ...formData.modifications,
        additionalNotes: e.target.value
      }
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Has the vehicle been modified from its original factory condition?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modificationTypes.map((modType) => (
          <div key={modType} className="flex items-center space-x-2">
            <Checkbox
              id={modType}
              checked={formData.modifications?.types?.includes(modType) || false}
              onCheckedChange={(checked) => handleModificationChange(checked, modType)}
            />
            <Label htmlFor={modType} className="cursor-pointer">
              {modType}
            </Label>
          </div>
        ))}
      </div>
      <div>
        <Label htmlFor="modification_notes">Additional Notes</Label>
        <Textarea
          id="modification_notes"
          placeholder="Please provide details about the modifications."
          value={formData.modifications?.additionalNotes || ''}
          onChange={handleAdditionalNotesChange}
        />
      </div>
    </div>
  );
}
